'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'email'      : {
    'type'   : String,
    'match'  : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'unique' : true,
    'sparse' : true
  },
  'username'   : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'facebookId' : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'password'   : {
    'type'     : String,
    'required' : true
  },
  'name'       : {
    'type' : String
  },
  'about'      : {
    'type' : String
  },
  'verified'   : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'featured'   : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'picture'    : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'apnsToken'  : {
    'type' : String
  },
  'active'     : {
    'type'    : Boolean,
    'default' : true
  },
  'country'    : {
    'type' : String
  },
  'entries'    : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Championship',
    'required' : true
  }],
  'starred'    : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  }],
  'stake'      : {
    'type'    : Number,
    'default' : 0
  },
  'funds'      : {
    'type'    : Number,
    'default' : 100
  },
  'createdAt'  : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'  : {
    'type' : Date
  }
}, {
  'collection' : 'users',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-json-select'), {
  'email'      : 1,
  'username'   : 1,
  'facebookId' : 1,
  'password'   : 0,
  'name'       : 1,
  'about'      : 1,
  'verified'   : 1,
  'featured'   : 0,
  'picture'    : 1,
  'apnsToken'  : 0,
  'active'     : 0,
  'country'    : 1,
  'entries'    : 1,
  'stake'      : 1,
  'funds'      : 1,
  'starred'    : 0,
  'createdAt'  : 1,
  'updatedAt'  : 1
});

schema.pre('save', function setUserUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

schema.pre('save', function setUserDefaultEntry(next) {
  if (!this.isNew) return next();
  return async.waterfall([function (next) {
    var Championship, query;
    Championship = require('./championship');
    query = Championship.find();
    query.where('country').in([this.country ? this.country : '', 'Europe']);
    query.exec(next);
  }.bind(this), function (championships, next) {
    this.entries = championships;
    next();
  }.bind(this)], next);
});

module.exports = mongoose.model('User', schema);
