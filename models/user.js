'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'email'           : {
    'type'   : String,
    'match'  : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'unique' : true,
    'sparse' : true
  },
  'username'        : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'facebookId'      : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'password'        : {
    'type'     : String,
    'required' : true
  },
  'name'            : {
    'type' : String
  },
  'about'           : {
    'type' : String
  },
  'verified'        : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'featured'        : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'picture'         : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'type'            : {
    'type'     : String,
    'required' : true,
    'default'  : 'user',
    'enum'     : ['user', 'admin']
  },
  'apnsToken'       : {
    'type' : String
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
  'history'         : [{
    'date'  : {
      'type'     : Date,
      'required' : true
    },
    'funds' : {
      'type'     : Number,
      'required' : true
    }
  }],
  'active'          : {
    'type'    : Boolean,
    'default' : true
  },
  'country'         : {
    'type' : String
  },
  'stake'           : {
    'type'    : Number,
    'default' : 0
  },
  'funds'           : {
    'type'    : Number,
    'default' : 100
  },
  'entries'         : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Championship',
    'required' : true
  }],
  'starred'         : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  }],
  'createdAt'       : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'       : {
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
  'email'           : 1,
  'username'        : 1,
  'facebookId'      : 0,
  'password'        : 0,
  'name'            : 1,
  'about'           : 1,
  'verified'        : 1,
  'featured'        : 1,
  'picture'         : 1,
  'type'            : 0,
  'apnsToken'       : 0,
  'ranking'         : 1,
  'previousRanking' : 1,
  'history'         : 1,
  'active'          : 1,
  'country'         : 1,
  'stake'           : 1,
  'funds'           : 1,
  'entries'         : 1,
  'starred'         : 1,
  'createdAt'       : 1,
  'updatedAt'       : 1
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

schema.path('funds').validate(function (value) {
  return value > 0;
}, 'insufficient funds');

module.exports = mongoose.model('User', schema);