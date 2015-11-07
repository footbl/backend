'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'user'   : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  },
  'match'  : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'Match',
    'required'     : true,
    'autopopulate' : true
  },
  'bid'    : {
    'type'     : Number,
    'required' : true
  },
  'result' : {
    'type'     : String,
    'required' : true,
    'enum'     : ['guest', 'host', 'draw']
  }
}, {
  'collection' : 'bets',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({'user' : 1, 'match' : 1}, {'unique' : true});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'    : 1,
  'user'   : 1,
  'match'  : 1,
  'bid'    : 1,
  'result' : 1
});

schema.path('match').validate(function (value, next) {
  if (!this.match) return next();
  return async.waterfall([function (next) {
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    next(!this.match.finished && !this.match.elapsed);
  }.bind(this)], next);
}, 'match already started');

schema.path('bid').validate(function (value, next) {
  return async.waterfall([function (next) {
    this.populate('user');
    this.populate(next);
  }.bind(this), function (_, next) {
    this.constructor.findOne().where('_id').equals(this._id).exec(next);
  }.bind(this), function (oldBid, next) {
    var funds = this.user.funds;
    funds += oldBid ? oldBid.bid : 0;
    next(value <= funds);
  }.bind(this)], next);
}, 'insufficient funds');

module.exports = mongoose.model('Bet', schema);
