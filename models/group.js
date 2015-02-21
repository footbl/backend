'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'name'       : {
    'type'     : String,
    'required' : true
  },
  'slug'       : {
    'type'   : String,
    'unique' : true
  },
  'picture'    : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'freeToEdit' : {
    'type'     : Boolean,
    'required' : true,
    'default'  : true
  },
  'owner'      : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'invites'    : [
    {
      'type' : String
    }
  ],
  'featured'   : {
    'type'    : Boolean,
    'default' : false
  },
  'createdAt'  : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'  : {
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
  '_id'        : 0,
  'name'       : 1,
  'slug'       : 1,
  'picture'    : 1,
  'freeToEdit' : 1,
  'owner'      : 1,
  'invites'    : 0,
  'members'    : 0,
  'featured'   : 1,
  'createdAt'  : 1,
  'updatedAt'  : 1
});

schema.pre('save', function setGroupUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

schema.pre('remove', function deleteCascadeMembers(next) {
  var Members;
  Members = require('./group-member');
  Members.remove({'group' : this._id}, next);
});

module.exports = mongoose.model('Group', schema);