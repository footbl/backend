'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'challenger' : {
    'user'   : {
      'type'         : mongoose.Schema.Types.ObjectId,
      'ref'          : 'User',
      'required'     : true,
      'autopopulate' : true
    },
    'result' : {
      'type' : String,
      'enum' : ['guest', 'host', 'draw']
    }
  },
  'challenged' : {
    'user'   : {
      'type'         : mongoose.Schema.Types.ObjectId,
      'ref'          : 'User',
      'required'     : true,
      'autopopulate' : true
    },
    'result' : {
      'type' : String,
      'enum' : ['guest', 'host', 'draw']
    }
  },
  'match'      : {
    'type'     : mongoose.Schema.Types.ObjectId,
    'ref'      : 'Match',
    'required' : true
  },
  'bid'        : {
    'type'     : Number,
    'required' : true
  },
  'accepted'   : {
    'type' : Boolean
  }
}, {
  'collection' : 'challenges',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'        : 1,
  'challenger' : 1,
  'challenged' : 1,
  'match'      : 1,
  'bid'        : 1,
  'accepted'   : 1
});

schema.path('match').validate(function (value, next) {
  return async.waterfall([function (next) {
    this.populate('match');
    this.populate(next);
  }.bind(this), function (_, next) {
    next(!this.match.finished && !this.match.elapsed);
  }.bind(this)], next);
}, 'match already started');

schema.path('bid').validate(function (value, next) {
  return async.waterfall([function (next) {
    this.populate('challenger.user');
    this.populate('challenged.user');
    this.populate(next);
  }.bind(this), function (_, next) {
    next(this.challenger.user.funds >= value && this.challenged.user.funds >= value);
  }.bind(this)], next);
}, 'insufficient funds');

module.exports = mongoose.model('Challenge', schema);
