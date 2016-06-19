'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'sponsor'  : {
    'type' : String
  },
  'gift'     : {
    'type' : String
  },
  'finishAt' : {
    'type' : Date
  },
  'startAt'  : {
    'type' : Date
  }
}, {
  'collection' : 'seasons',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'      : 1,
  'sponsor'  : 1,
  'gift'     : 1,
  'finishAt' : 1,
  'startAt'  : 1
});

module.exports = mongoose.model('Season', schema);
