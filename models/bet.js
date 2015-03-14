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
  '_id'       : 1,
  'user'      : 1,
  'match'     : 1,
  'bid'       : 1,
  'result'    : 1,
  'payed'     : 0,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setBetUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

schema.pre('save', function updateCascadeUserAndMatch(next) {
  return async.waterfall([function (next) {
    this.populate('user');
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    var query;
    query = this.constructor.findOne();
    query.where('_id').equals(this._id);
    query.exec(next);
  }.bind(this), function (bet, next) {
    if (bet) this.match.pot[bet.result] -= bet.bid;
    this.match.pot[this.result] += this.bid;
    this.user.stake += -(bet ? bet.bid : 0) + this.bid;
    this.user.funds += (bet ? bet.bid : 0) - this.bid;
    async.parallel([this.match.save.bind(this.match), this.user.save.bind(this.user)], next);
  }.bind(this)], next);
});

schema.pre('remove', function removeCascadeUserAndMatch(next) {
  return async.waterfall([function (next) {
    this.populate('user');
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    this.match.pot[this.result] -= this.bid;
    this.user.stake -= this.bid;
    this.user.funds += this.bid;
    async.parallel([this.match.save.bind(this.match), this.user.save.bind(this.user)], next);
  }.bind(this)], next);
});

schema.path('match').validate(function validateStartedMatch(value, next) {
  if (!this.match) return next();
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
