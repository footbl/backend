'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'slug'      : {
    'type' : String
  },
  'user'      : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'featured'  : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'featureds',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({
  'user'     : 1,
  'featured' : 1
}, {
  'unique' : true
});

schema.plugin(jsonSelect, {
  '_id'       : 0,
  'user'      : 1,
  'featured'  : 1,
  'slug'      : 1,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setFeaturedUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Featured', schema);