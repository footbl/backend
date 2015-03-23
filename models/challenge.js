'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'challenger' : {
    'user'   : {
      'type'     : Schema.Types.ObjectId,
      'ref'      : 'User',
      'required' : true
    },
    'result' : {
      'type' : String,
      'enum' : ['guest', 'host', 'draw']
    }
  },
  'challenged' : {
    'user'   : {
      'type'     : Schema.Types.ObjectId,
      'ref'      : 'User',
      'required' : true
    },
    'result' : {
      'type' : String,
      'enum' : ['guest', 'host', 'draw']
    }
  },
  'match'      : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Match',
    'required' : true
  },
  'bid'        : {
    'type'     : Number,
    'required' : true
  },
  'accepted'   : {
    'type' : Boolean
  },
  'createdAt'  : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'  : {
    'type' : Date
  }
}, {
  'collection' : 'challenges',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  'challenger' : 1,
  'challenged' : 1,
  'match'      : 1,
  'bid'        : 1,
  'accepted'   : 1,
  'createdAt'  : 1,
  'updatedAt'  : 1
});

schema.pre('save', function setChallengeUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
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
    this.populate('challenger.user');
    this.populate('challenged.user');
    this.populate(next);
  }.bind(this), function (_, next) {
    next(this.challenger.user.funds < value || this.challenged.user.funds < value ? 'insufficient funds' : null);
  }.bind(this)], next);
}, 'insufficient funds');

module.exports = mongoose.model('Challenge', schema);
