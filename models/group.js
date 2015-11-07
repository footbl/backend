'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'name'     : {
    'type'     : String,
    'required' : true
  },
  'code'     : {
    'type'     : String,
    'required' : true
  },
  'owner'    : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  },
  'picture'  : {
    'type' : String
  },
  'featured' : {
    'type'    : Boolean,
    'default' : false
  },
  'invites'  : [{
    'type' : String
  }],
  'members'  : [{
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  }]
}, {
  'collection' : 'groups',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'      : 1,
  'name'     : 1,
  'code'     : 1,
  'owner'    : 1,
  'picture'  : 1,
  'featured' : 0,
  'invites'  : 0,
  'members'  : 1
});

module.exports = mongoose.model('Group', schema);
