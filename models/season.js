'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'sponsor'   : {
    'type' : String
  },
  'gift'      : {
    'type' : String
  },
  'finishAt'  : {
    'type' : Date
  },
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'seasons',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'       : 1,
  'sponsor'   : 1,
  'gift'      : 1,
  'finishAt'  : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setSeasonUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

module.exports = mongoose.model('Season', schema);
