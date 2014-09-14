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

schema.pre('save', function validateStartedMatchBeforeSave(next) {
  'use strict';

  this.populate('match');
  this.populate(function (error) {
    if (error) {
      error = new VError(error, 'error populating bet "%s" match.', this._id);
      return next(error);
    }
    if (this.match.finished || this.match.elapsed) {
      error = new VError('match already started');
      return next(error);
    }
    return next();
  }.bind(this));
});

schema.pre('remove', function validateStartedMatchBeforeRemove(next) {
  'use strict';

  this.populate('match');
  this.populate(function (error) {
    if (error) {
      error = new VError(error, 'error populating bet "%s" match.', this._id);
      return next(error);
    }
    if (this.match.finished || this.match.elapsed) {
      error = new VError('match already started');
      return next(error);
    }
    return next();
  }.bind(this));
});

schema.pre('save', function validateSufficientFundsBeforeSave(next) {
  'use strict';

  var User, query;
  User = require('./user');
  query = User.findOne();
  query.where('_id').equals(this.user);
  query.exec(function (error, user) {
    if (error || !user) {
      error = new VError(error, 'error finding bet "%s" user.', this._id);
      return next(error);
    }
    if (this.bid > user.funds) {
      error = new VError('insufficient funds');
      return next(error);
    }
    return next();
  }.bind(this));
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