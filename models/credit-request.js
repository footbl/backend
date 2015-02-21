'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'slug'         : {
    'type' : String
  },
  'creditedUser' : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'chargedUser'  : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  },
  'value'        : {
    'type' : Number
  },
  'payed'        : {
    'type'    : Boolean,
    'default' : false
  },
  'seenBy'       : [
    {
      'type' : Schema.Types.ObjectId,
      'ref'  : 'User'
    }
  ],
  'createdAt'    : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'    : {
    'type' : Date
  }
}, {
  'collection' : 'credits',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({
  'slug'        : 1,
  'chargedUser' : 1
}, {
  'unique' : true
});

schema.plugin(jsonSelect, {
  '_id'          : 0,
  'slug'         : 1,
  'creditedUser' : 1,
  'chargedUser'  : 1,
  'payed'        : 1,
  'value'        : 1,
  'seenBy'       : 0,
  'createdAt'    : 1,
  'updatedAt'    : 1
});

schema.pre('save', function setCreditRequestUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

schema.path('value').validate(function validateSufficientFunds(value, next) {
  async.waterfall([function (next) {
    this.populate('chargedUser');
    this.populate(next);
  }.bind(this)], function (error) {
    next(!error && value <= this.chargedUser.funds);
  }.bind(this));
}, 'insufficient funds');

schema.methods.approve = function approve(next) {
  async.waterfall([function (next) {
    this.populate('creditedUser');
    this.populate('chargedUser');
    this.populate(next);
  }.bind(this), function (_, next) {
    this.payed = true;
    this.value = (this.creditedUser.funds + this.creditedUser.stake < 100) ? (100 - this.creditedUser.funds + this.creditedUser.stake) : 0;
    this.save(next);
  }.bind(this), function () {
    async.parallel([function (next) {
      this.creditedUser.funds += this.value;
      this.creditedUser.save(next);
    }.bind(this), function (next) {
      this.chargedUser.funds -= this.value;
      this.chargedUser.save(next);
    }.bind(this), function (next) {
      async.waterfall([function (next) {
        var query;
        query = this.constructor.find();
        query.where('creditedUser').equals(this.creditedUser._id);
        query.where('payed').equals(false);
        query.exec(next);
      }.bind(this), function (creditRequests, next) {
        async.each(creditRequests, function (creditRequest, next) {
          creditRequest.remove(next);
        }, next);
      }], next);
    }.bind(this)], next);
  }.bind(this)], next);
};

module.exports = mongoose.model('CreditRequest', schema);