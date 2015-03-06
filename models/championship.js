'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'name'         : {
    'type'     : String,
    'required' : true
  },
  'picture'      : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'type'         : {
    'type'     : String,
    'enum'     : ['national league', 'continental league', 'world cup'],
    'default'  : 'national league'
  },
  'country'      : {
    'type'     : String,
    'required' : true
  },
  'rounds'       : {
    'type' : Number
  },
  'currentRound' : {
    'type'    : Number,
    'default' : 1
  },
  'createdAt'    : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'    : {
    'type' : Date
  }
}, {
  'collection' : 'championships',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'          : 1,
  'name'         : 1,
  'picture'      : 1,
  'type'         : 1,
  'country'      : 1,
  'rounds'       : 1,
  'currentRound' : 1,
  'createdAt'    : 1,
  'updatedAt'    : 1
});

schema.pre('save', function setChampionshipUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

module.exports = mongoose.model('Championship', schema);