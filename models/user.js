'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'email'      : {
    'type'   : String,
    'match'  : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'unique' : true,
    'sparse' : true
  },
  'username'   : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'facebookId' : {
    'type'   : String,
    'unique' : true,
    'sparse' : true
  },
  'password'   : {
    'type'     : String,
    'required' : true
  },
  'name'       : {
    'type' : String
  },
  'about'      : {
    'type' : String
  },
  'verified'   : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'featured'   : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'picture'    : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'apnsToken'  : {
    'type' : String
  },
  'active'     : {
    'type'    : Boolean,
    'default' : true
  },
  'country'    : {
    'type' : String
  },
  'entries'    : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Championship',
    'required' : true
  }],
  'seasons'    : [{
    'season'    : {
      'type'     : Schema.Types.ObjectId,
      'ref'      : 'Season',
      'required' : true
    },
    'rankings'  : [Number],
    'stake'     : {
      'type'    : Number,
      'default' : 0
    },
    'funds'     : {
      'type'    : Number,
      'default' : 100
    },
    'evolution' : [{
      'funds'     : {
        'type'    : Number,
        'default' : 100
      },
      'createdAt' : {
        'type'    : Date,
        'default' : Date.now
      }
    }]
  }],
  'starred'    : [{
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'User',
    'required' : true
  }],
  'createdAt'  : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'  : {
    'type' : Date
  }
}, {
  'collection' : 'users',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(require('mongoose-json-select'), {
  'email'             : 1,
  'username'          : 1,
  'facebookId'        : 1,
  'password'          : 0,
  'name'              : 1,
  'about'             : 1,
  'verified'          : 1,
  'featured'          : 0,
  'picture'           : 1,
  'apnsToken'         : 0,
  'active'            : 0,
  'country'           : 1,
  'entries'           : 1,
  'seasons'           : 1,
  'seasons.season'    : 1,
  'seasons.rankings'  : 0,
  'seasons.stake'     : 1,
  'seasons.funds'     : 1,
  'seasons.evolution' : 1,
  'funds'             : 1,
  'stake'             : 1,
  'ranking'           : 1,
  'previousRanking'   : 1,
  'starred'           : 0,
  'createdAt'         : 1,
  'updatedAt'         : 1
});

schema.pre('save', function setUserUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

schema.pre('save', function setUserDefaultEntry(next) {
  if (!this.isNew) return next();
  return async.waterfall([function (next) {
    var Championship, query;
    Championship = require('./championship');
    query = Championship.find();
    query.where('country').in([this.country ? this.country : '', 'Europe']);
    query.exec(next);
  }.bind(this), function (championships, next) {
    this.entries = championships;
    next();
  }.bind(this)], next);
});

schema.pre('save', function setUserDefaultSeason(next) {
  if (!this.isNew) return next();
  return async.waterfall([function (next) {
    var Season, query;
    Season = require('./season');
    query = Season.find();
    query.sort('-finishAt');
    query.exec(next);
  }.bind(this), function (seasons, next) {
    this.seasons = seasons.map(function (season) {
      return {'season' : season};
    });
    next();
  }.bind(this)], next);
});

schema.pre('save', function insertUserIntoInvitedGroups(next) {
  if (!this.facebookId && !this.email) return next();
  return async.waterfall([function (next) {
    var Group, query;
    Group = require('./group');
    query = Group.find();
    query.where('invites').equals(this.facebookId || this.email);
    query.where('members.user').ne(this._id);
    query.exec(next);
  }.bind(this), function (groups, next) {
    async.each(groups, function (group, next) {
      group.members.push({'user' : this});
      group.save(next);
    }.bind(this), next);
  }.bind(this)], next);
});


schema.virtual('currentSeason').get(function () {
  return this.seasons[0] || {
    'rankings'  : [Infinity],
    'funds'     : 100,
    'stake'     : 0,
    'evolution' : []
  };
});

schema.virtual('funds').get(function () {
  return this.currentSeason.funds;
}).set(function (funds) {
  var now, lastDate, sameDay;
  now = new Date();
  lastDate = this.currentSeason.evolution[0] ? this.currentSeason.evolution[0].createdAt : null;
  sameDay = !!lastDate;
  sameDay = sameDay && lastDate.getFullYear() === now.getFullYear();
  sameDay = sameDay && lastDate.getMonth() === now.getMonth();
  sameDay = sameDay && lastDate.getDate() === now.getDate();
  this.currentSeason.funds = funds;
  if (sameDay) {
    this.currentSeason.evolution[0].funds = this.funds + this.stake;
  } else {
    this.currentSeason.evolution.unshift({'funds' : this.funds + this.stake});
  }
  this.markModified('seasons.0');
});

schema.virtual('stake').get(function () {
  return this.currentSeason.stake;
}).set(function (stake) {
  this.currentSeason.stake = stake;
});

schema.virtual('ranking').get(function () {
  return this.currentSeason.rankings[0];
}).set(function (ranking) {
  this.currentSeason.rankings.unshift(ranking);
  this.currentSeason.rankings.splice(2);
  this.markModified('seasons.rankings');
});

schema.virtual('previousRanking').get(function () {
  return this.currentSeason.rankings[1];
});

module.exports = mongoose.model('User', schema);
