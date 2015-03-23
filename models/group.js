'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'name'      : {
    'type'     : String,
    'required' : true
  },
  'code'      : {
    'type'     : String,
    'required' : true
  },
  'owner'     : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'picture'   : {
    'type' : String
  },
  'featured'  : {
    'type'    : Boolean,
    'default' : false
  },
  'invites'   : [{
    'type' : String
  }],
  'members'   : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  }],
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'groups',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'       : 1,
  'name'      : 1,
  'code'      : 1,
  'owner'     : 1,
  'picture'   : 1,
  'featured'  : 0,
  'invites'   : 0,
  'members'   : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setGroupUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

module.exports = mongoose.model('Group', schema);
