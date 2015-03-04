'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
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
  'user'      : 1,
  'match'     : 1,
  'bid'       : 1,
  'result'    : 1,
  'reward'    : 1,
  'profit'    : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.virtual('reward').get(function getBetReward() {
  if (!this.match.finished || this.match.winner !== this.result) return 0;
  return (this.match ? this.match.reward * this.bid : undefined);
});

schema.virtual('profit').get(function getBetProfit() {
  return (this.reward ? this.reward : 0) - this.bid;
});

schema.methods.updateMatch = function updateMatch(result, bid, next) {
  return async.waterfall([function (next) {
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    var query;
    query = this.constructor.findOne();
    query.where('_id').equals(this._id);
    query.exec(next);
  }.bind(this), function (oldBet, next) {
    var Match, oldBid, oldResult;
    Match = require('./match');
    oldBid = oldBet ? oldBet.bid : 0;
    oldResult = oldBet ? oldBet.result : null;
    Match.update({'_id' : this.match._id}, {
      '$inc' : {
        'pot.guest' : (result === 'guest' ? bid : 0) - (oldResult === 'guest' ? oldBid : 0),
        'pot.host'  : (result === 'host' ? bid : 0) - (oldResult === 'host' ? oldBid : 0),
        'pot.draw'  : (result === 'draw' ? bid : 0) - (oldResult === 'draw' ? oldBid : 0)
      }
    }, next);
  }.bind(this)], next);
};

schema.methods.updateUser = function updateUser(bid, next) {
  return async.waterfall([function (next) {
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    var query;
    query = this.constructor.findOne();
    query.where('_id').equals(this._id);
    query.exec(next);
  }.bind(this), function (oldBet, next) {
    var User, oldBid;
    User = require('./user');
    oldBid = oldBet ? oldBet.bid : 0;
    User.update({'_id' : this.user._id}, {
      '$inc' : {
        'stake' : -oldBid + bid,
        'funds' : oldBid - bid
      }
    }, next);
  }.bind(this)], next);
};

schema.pre('save', function setBetUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

schema.pre('save', function updateCascadeUserAndMatch(next) {
  return async.parallel([function (next) {
    this.updateMatch(this.result, this.bid, next);
  }.bind(this), function (next) {
    this.updateUser(this.bid, next);
  }.bind(this)], next);
});

schema.pre('remove', function deleteCascadeUserAndMatch(next) {
  return async.parallel([function (next) {
    this.updateMatch(this.result, 0, next);
  }.bind(this), function (next) {
    this.updateUser(0, next);
  }.bind(this)], next);
});

schema.path('match').validate(function validateStartedMatch(value, next) {
  return async.waterfall([function (next) {
    this.populate('match');
    this.populate(next);
  }.bind(this)], function (error) {
    next(!error && !this.match.finished && !this.match.elapsed);
  }.bind(this));
}, 'match already started');

schema.path('bid').validate(function validateSufficientFunds(value, next) {
  return async.waterfall([function (next) {
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

module.exports = mongoose.model('Bet', schema);