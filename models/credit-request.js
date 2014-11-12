var VError, mongoose, jsonSelect, nconf, async, Schema, schema;

VError = require('verror');
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
  'createdAt'    : 1,
  'updatedAt'    : 1
});

schema.pre('save', function setCreditRequestUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

schema.path('value').validate(function validateSufficientFunds(value, next) {
  'use strict';

  async.waterfall([function (next) {
    this.populate('chargedUser');
    this.populate(next);
  }.bind(this)], function (error) {
    next(!error && value <= this.chargedUser.funds);
  }.bind(this));
}, 'insufficient funds');

module.exports = mongoose.model('CreditRequest', schema);