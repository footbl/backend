var VError, mongoose, jsonSelect, nconf, async, Schema, schema;

VError = require('verror');
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
    funds += oldBid ? oldBid.bind : 0;
    next(value > funds ? new VError('insufficient funds') : null);
  }.bind(this)], function (error) {
    next(!error);
  }.bind(this));
}, 'insufficient funds');

schema.pre('remove', function (next) {
  'use strict';

  this.validate(next);
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