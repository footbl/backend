'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
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

schema.plugin(jsonSelect, {
  '_id'          : 1,
  'creditedUser' : 1,
  'chargedUser'  : 1,
  'payed'        : 1,
  'value'        : 1,
  'createdAt'    : 1,
  'updatedAt'    : 1
});

schema.pre('save', function setCreditRequestUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

schema.path('value').validate(function validateSufficientFunds(value, next) {
  return async.waterfall([function (next) {
    this.populate('chargedUser');
    this.populate(next);
  }.bind(this)], function (error) {
    next(!error && value <= this.chargedUser.funds);
  }.bind(this));
}, 'insufficient funds');

schema.methods.approve = function approve(next) {
  return async.waterfall([function (next) {
    this.populate('creditedUser');
    this.populate('chargedUser');
    this.populate(next);
  }.bind(this), function (_, next) {
    var available;
    available = this.creditedUser.funds + this.creditedUser.stake;
    this.payed = true;
    this.value = (available < 100) ? (100 - available) : 0;
    this.save(next);
  }.bind(this), function (__, _, next) {
    this.creditedUser.funds += this.value;
    this.creditedUser.save(next);
  }.bind(this), function (__, _, next) {
    this.chargedUser.funds -= this.value;
    this.chargedUser.save(next);
  }.bind(this), function (__, _, next) {
    var query;
    query = this.constructor.find();
    query.where('creditedUser').equals(this.creditedUser._id);
    query.where('payed').equals(false);
    query.exec(next);
  }.bind(this), function (requests, next) {
    async.each(requests, function (request, next) { request.remove(next); }, next);
  }.bind(this)], next);
};

module.exports = mongoose.model('CreditRequest', schema);
