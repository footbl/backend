'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'bets'      : [{
    'user'     : {
      'type'     : Schema.Types.ObjectId,
      'ref'      : 'User',
      'required' : true
    },
    'result'   : {
      'type' : String,
      'enum' : ['guest', 'host', 'draw']
    },
    'accepted' : {
      'type'    : Boolean,
      'default' : false
    }
  }],
  'match'     : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Match',
    'required' : true
  },
  'bid'       : {
    'type'     : Number,
    'required' : true
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
  'collection' : 'challenges',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'       : 1,
  'users'     : 1,
  'match'     : 1,
  'bid'       : 1,
  'payed'     : 0,
  'createdAt' : 1,
  'updatedAt' : 1
});

module.exports = mongoose.model('Challenge', schema);
