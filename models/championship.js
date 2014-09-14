var VError, mongoose, jsonSelect, nconf, async, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'name'      : {
    'type'     : String,
    'required' : true
  },
  'slug'      : {
    'type'   : String,
    'unique' : true
  },
  'picture'   : {
    'type'  : String,
    'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  },
  'edition'   : {
    'type'     : Number,
    'required' : true
  },
  'type'      : {
    'type'     : String,
    'required' : true,
    'enum'     : ['national league', 'continental league', 'world cup'],
    'default'  : 'national league'
  },
  'country'   : {
    'type'     : String,
    'required' : true
  },
  'createdAt' : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt' : {
    'type' : Date
  }
}, {
  'collection' : 'championships',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.plugin(jsonSelect, {
  '_id'          : 0,
  'name'         : 1,
  'slug'         : 1,
  'picture'      : 1,
  'edition'      : 1,
  'type'         : 1,
  'country'      : 1,
  'createdAt'    : 1,
  'updatedAt'    : 1,
  'rounds'       : 1,
  'currentRound' : 1,
  'active'       : 1
});

schema.pre('save', function setChampionshipUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

schema.pre('init', function populateChampionshipMatches(next, data) {
  'use strict';

  var Match, query;
  Match = require('./match');
  query = Match.find();
  query.where('championship').equals(data._id);
  query.exec(function (error, matches) {
    if (error) {
      error = new VError(error, 'error populating championship "%s" matches.', data._id);
      return next(error);
    }
    this.matches = matches;
    return next();
  }.bind(this));
});

schema.virtual('rounds').get(function getChampionshipRounds() {
  'use strict';

  var lastRound, matches;
  matches = this.matches || [];
  lastRound = matches.sort(function (a, b) {
    return b.round - a.round;
  }.bind(this))[0];
  return lastRound ? lastRound.round : 1;
});

schema.virtual('currentRound').get(function getChampionshipCurrentRound() {
  'use strict';

  var lastFinishedRound, lastFinishedRoundIsActive, hasUnfinishedMatch, matches;
  matches = this.matches || [];
  lastFinishedRound = matches.filter(function (match) {
    return match.finished;
  }.bind(this)).sort(function (a, b) {
    return b.round - a.round;
  }.bind(this))[0];

  lastFinishedRound = !lastFinishedRound ? 1 : lastFinishedRound.round;
  lastFinishedRoundIsActive = matches.some(function (match) {
    return match.round === lastFinishedRound && !match.finished;
  }.bind(this));

  hasUnfinishedMatch = matches.some(function (match) {
    return !match.finished;
  });

  if (lastFinishedRoundIsActive || !hasUnfinishedMatch) {
    return lastFinishedRound;
  } else {
    return lastFinishedRound + 1;
  }
});

module.exports = mongoose.model('Championship', schema);