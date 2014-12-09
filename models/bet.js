var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'slug'      : {
    'type' : String
  },
  'user'      : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'match'     : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Match',
    'required' : true
  },
  'bid'       : {
    'type'     : Number,
    'required' : true
  },
  'result'    : {
    'type'     : String,
    'required' : true,
    'enum'     : ['guest', 'host', 'draw']
  },
  'payed'     : {
    'type'    : Boolean,
    'default' : false
  },
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'bets',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({
  'user'  : 1,
  'match' : 1
}, {
  'unique' : true
});

schema.plugin(jsonSelect, {
  '_id'       : 0,
  'slug'      : 1,
  'user'      : 1,
  'match'     : 1,
  'bid'       : 1,
  'result'    : 1,
  'reward'    : 1,
  'profit'    : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setBetUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

schema.pre('save', function updateCascadeUserAndMatch(next) {
  'use strict';

  async.waterfall([function (next) {
    this.populate('user');
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    var query;
    query = this.constructor.findOne();
    query.where('_id').equals(this._id);
    query.exec(next);
  }.bind(this), function (oldBet, next) {
    var oldBid, oldResult;
    oldBid = oldBet ? oldBet.bid : 0;
    oldResult = oldBet ? oldBet.result : null;
    async.parallel([function (next) {
      var Match;
      Match = require('./match');
      Match.update({'_id' : this.match._id}, {'$inc' : {
        'pot.guest' : (this.result === 'guest' ? this.bid : 0) - (oldResult === 'guest' ? oldBid : 0),
        'pot.host'  : (this.result === 'host' ? this.bid : 0) - (oldResult === 'host' ? oldBid : 0),
        'pot.draw'  : (this.result === 'draw' ? this.bid : 0) - (oldResult === 'draw' ? oldBid : 0)
      }}, next);
    }.bind(this), function (next) {
      var User;
      User = require('./user');
      User.update({'_id' : this.user._id}, {'$inc' : {
        'stake' : -oldBid + this.bid,
        'funds' : oldBid - this.bid
      }}, next);
    }.bind(this)], next);
  }.bind(this)], next);
});

schema.path('match').validate(function validateStartedMatch(value, next) {
  'use strict';

  async.waterfall([function (next) {
    this.populate('match');
    this.populate(next);
  }.bind(this)], function (error) {
    next(!error && !this.match.finished && !this.match.elapsed);
  }.bind(this));
}, 'match already started');

schema.path('bid').validate(function validateSufficientFunds(value, next) {
  'use strict';

  async.waterfall([function (next) {
    this.populate('user');
    this.populate(next);
  }.bind(this), function (_, next) {
    var query;
    query = this.constructor.findOne();
    query.where('_id').equals(this._id);
    query.exec(next);
  }.bind(this), function (oldBid, next) {
    var funds;
    funds = this.user.funds;
    funds += oldBid ? oldBid.bid : 0;
    next(value > funds ? 'insufficient funds' : null);
  }.bind(this)], function (error) {
    next(!error);
  }.bind(this));
}, 'insufficient funds');

schema.pre('remove', function (next) {
  'use strict';

  if (this._forceRemove) {
    return next();
  } else {
    return this.validate(next);
  }
});

schema.pre('remove', function deleteCascadeUserAndMatch(next) {
  'use strict';

  async.series([function (next) {
    this.populate('user');
    this.populate('match');
    this.populate(next);
  }.bind(this), function (next) {
    async.parallel([function (next) {
      var Match;
      Match = require('./match');
      Match.update({'_id' : this.match._id}, {'$inc' : {
        'pot.guest' : -(this.result === 'guest' ? this.bid : 0),
        'pot.host'  : -(this.result === 'host' ? this.bid : 0),
        'pot.draw'  : -(this.result === 'draw' ? this.bid : 0)
      }}, next);
    }.bind(this), function (next) {
      var User;
      User = require('./user');
      User.update({'_id' : this.user._id}, {'$inc' : {
        'stake' : -this.bid,
        'funds' : this.bid
      }}, next);
    }.bind(this)], next);
  }.bind(this)], next);
});

schema.virtual('reward').get(function getBetReward() {
  'use strict';

  if (!this.match.finished || this.match.winner !== this.result) {
    return 0;
  }
  return (this.match ? this.match.reward * this.bid : undefined);
});

schema.virtual('profit').get(function getBetProfit() {
  'use strict';

  return (this.reward ? this.reward : 0) - this.bid;
});

module.exports = mongoose.model('Bet', schema);