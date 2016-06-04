'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'email'           : {
    'type'   : String,
    'match'  : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'unique' : true,
    'sparse' : true
  },
  'username'        : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'facebook'        : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'password'        : {
    'type'     : String,
    'required' : true
  },
  'name'            : {
    'type' : String
  },
  'about'           : {
    'type' : String
  },
  'verified'        : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'featured'        : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'picture'         : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'apnsToken'       : {
    'type' : String
  },
  'active'          : {
    'type'    : Boolean,
    'default' : true
  },
  'country'         : {
    'type' : String
  },
  'ranking'         : {
    'type'    : Number,
    'default' : Infinity
  },
  'previousRanking' : {
    'type'    : Number,
    'default' : Infinity
  },
  'stake'           : {
    'type'    : Number,
    'default' : 0
  },
  'funds'           : {
    'type'    : Number,
    'default' : 100
  },
  'history'         : [{
    'date'  : Date,
    'stake' : Number,
    'funds' : Number
  }],
  'experience'      : {
    'type'    : Number,
    'default' : 0
  },
  'starred'         : [{
    'type'     : mongoose.Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  }]
}, {
  'collection' : 'users',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'             : 1,
  'email'           : 1,
  'username'        : 1,
  'facebook'        : 1,
  'password'        : 0,
  'name'            : 1,
  'about'           : 1,
  'verified'        : 1,
  'featured'        : 0,
  'picture'         : 1,
  'apnsToken'       : 0,
  'active'          : 0,
  'country'         : 1,
  'ranking'         : 1,
  'previousRanking' : 1,
  'stake'           : 1,
  'funds'           : 1,
  'history'         : 1,
  'experience'      : 1,
  'starred'         : 0
});

schema.pre('save', function (next) {
  if (!this.facebookId && !this.email) return next();
  return async.waterfall([function (next) {
    require('./group').find()
    .where('invites').equals(this.facebookId || this.email)
    .where('members.user').ne(this._id)
    .exec(next);
  }.bind(this), function (groups, next) {
    async.each(groups, function (group, next) {
      group.update({'$addToSet' : {'members' : this.id}}).exec(next);
    }.bind(this), next);
  }.bind(this)], next);
});

schema.post('save', function () {
  async.each([150, 200, 500, 1000, 5000, 10000], function (level, next) {
    if (this.funds < level) return next();
    require('./badge').giveTrophy(this, 'WALLET', level, next);
  }.bind(this));
});

module.exports = mongoose.model('User', schema);
