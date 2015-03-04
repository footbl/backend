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
  'group'     : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Group',
    'required' : true
  },
  'message'   : {
    'type'     : String
  },
  'type'      : {
    'type' : String
  },
  'seenBy'    : [{
    'type' : Schema.Types.ObjectId,
    'ref'  : 'User'
  }],
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'messages',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'       : 0,
  'user'      : 1,
  'group'     : 0,
  'message'   : 1,
  'seenBy'    : 1,
  'type'      : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setMessageUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

module.exports = mongoose.model('Message', schema);