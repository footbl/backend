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
  'value'     : {
    'type'     : Number,
    'required' : true
  },
  'type'      : {
    'type'     : String,
    'required' : true,
    'enum'     : ['daily', 'update']
  },
  'seenBy'    : [
    {
      'type' : Schema.Types.ObjectId,
      'ref'  : 'User'
    }
  ],
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'prizes',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'       : 0,
  'slug'      : 1,
  'user'      : 0,
  'value'     : 1,
  'type'      : 1,
  'seenBy'    : 0,
  'createdAt' : 1,
  'updatedAt' : 1
});

schema.pre('save', function setPrizeUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

schema.methods.markAsRead = function markAsRead(user, next) {
  async.waterfall([function (next) {
    this.populate('user');
    this.populate(next);
  }.bind(this), function (_, next) {
    async.parallel([function (next) {
      this.seenBy.push(user);
      this.save(next);
    }.bind(this), function (next) {
      var User;
      User = require('./user');
      User.update({'_id' : this.user._id}, {'$inc' : {'funds' : this.value}}, next);
    }.bind(this)], next);
  }.bind(this)], next);
};

module.exports = mongoose.model('Prize', schema);