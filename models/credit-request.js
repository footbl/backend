'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'creditedUser' : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  },
  'chargedUser'  : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'User',
    'required'     : true,
    'autopopulate' : true
  },
  'value'        : {
    'type' : Number
  },
  'status'       : {
    'type'    : String,
    'default' : 'pending'
  }
}, {
  'collection' : 'credits',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'          : 1,
  'creditedUser' : 1,
  'chargedUser'  : 1,
  'value'        : 1,
  'status'       : 1
});

schema.path('value').validate(function (value, next) {
  return async.waterfall([function (next) {
    this.populate('chargedUser');
    this.populate(next);
  }.bind(this)], function (error) {
    next(!error && value <= this.chargedUser.funds);
  }.bind(this));
}, 'insufficient funds');

schema.pre('save', function (next) {
  require('./badge').giveTrophy(this.creditedUser, 'WALLET', 'BEGGAR', next);
});

schema.pre('save', function (next) {
  if (!this.payed) return next();
  require('./badge').giveTrophy(this.chargedUser, 'WALLET', 'GIVER', next);
});

module.exports = mongoose.model('CreditRequest', schema);
