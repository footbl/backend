var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'slug'            : {
    'type' : String
  },
  'user'            : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'group'           : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Group',
    'required' : true
  },
  'initialFunds'    : {
    'type' : Number
  },
  'ranking'         : {
    'type'     : Number,
    'required' : true,
    'default'  : Infinity
  },
  'previousRanking' : {
    'type'     : Number,
    'required' : true,
    'default'  : Infinity
  },
  'notifications'   : {
    'type'    : Boolean,
    'default' : true
  },
  'createdAt'       : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'       : {
    'type' : Date
  }
}, {
  'collection' : 'groupMembers',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({
  'user'  : 1,
  'group' : 1
}, {
  'unique' : true
});

schema.plugin(jsonSelect, {
  '_id'             : 0,
  'user'            : 1,
  'group'           : 0,
  'initialFunds'    : 1,
  'ranking'         : 1,
  'previousRanking' : 1,
  'slug'            : 1,
  'notifications'   : 1,
  'createdAt'       : 1,
  'updatedAt'       : 1
});

schema.pre('save', function setGroupMemberUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('GroupMember', schema);