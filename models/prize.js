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
  'value'     : {
    'type'     : Number,
    'required' : true
  },
  'type'      : {
    'type'     : String,
    'required' : true,
    'enum'     : ['daily', 'update']
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
  'collection' : 'prizes',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'       : 1,
  'user'      : 0,
  'value'     : 1,
  'type'      : 1,
  'seenBy'    : 0,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setPrizeUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

module.exports = mongoose.model('Prize', schema);