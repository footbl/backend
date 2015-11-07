'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'user'      : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  },
  'room'      : {
    'type'     : mongoose.Schema.Types.ObjectId,
    'required' : true
  },
  'message'   : {
    'type' : String
  },
  'type'      : {
    'type' : String
  },
  'seenBy'    : [{
    'type' : mongoose.Schema.Types.ObjectId,
    'ref'  : 'User'
  }],
  'visibleTo' : [{
    'type' : mongoose.Schema.Types.ObjectId,
    'ref'  : 'User'
  }]
}, {
  'collection' : 'messages',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'       : 1,
  'user'      : 1,
  'room'      : 0,
  'message'   : 1,
  'type'      : 1,
  'seenBy'    : 0,
  'visibleTo' : 0,
  'createdAt' : 1,
  'updatedAt' : 1
});

module.exports = mongoose.model('Message', schema);
