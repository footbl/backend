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
  'group'     : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Group',
    'required' : true
  },
  'message'   : {
    'type'     : String,
    'required' : true
  },
  'seenBy'    : [
    {
      'type' : Schema.Types.ObjectId,
      'ref'  : 'User'
    }
  ],
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
  'slug'      : 1,
  'user'      : 1,
  'group'     : 0,
  'message'   : 1,
  'seenBy'    : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setMessageUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Message', schema);