'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'user'   : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  },
  'value'  : {
    'type'     : Number,
    'required' : true
  },
  'type'   : {
    'type'     : String,
    'required' : true,
    'enum'     : ['daily', 'update']
  },
  'seenBy' : [{
    'type' : mongoose.Schema.Types.ObjectId,
    'ref'  : 'User'
  }]
}, {
  'collection' : 'prizes',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'    : 1,
  'user'   : 0,
  'value'  : 1,
  'type'   : 1,
  'seenBy' : 0
});

module.exports = mongoose.model('Prize', schema);
