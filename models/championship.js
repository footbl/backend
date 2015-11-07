'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'name'    : {
    'type'     : String,
    'required' : true
  },
  'picture' : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'type'    : {
    'type' : String,
    'enum' : ['national league', 'continental league', 'world cup']
  },
  'country' : {
    'type'     : String,
    'required' : true
  }
}, {
  'collection' : 'championships',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'     : 1,
  'name'    : 1,
  'picture' : 1,
  'type'    : 1,
  'country' : 1
});

module.exports = mongoose.model('Championship', schema);
