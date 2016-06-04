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
  'trophy' : {
    'type'     : String,
    'required' : true
  }
}, {
  'collection' : 'bets',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({'user' : 1, 'match' : 1}, {'unique' : true});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
  '_id'    : 1,
  'user'   : 1,
  'trophy' : 1
});

schema.statics.giveTrophy = function (user, trophy, level, next) {
  var trophyLevel = trophy + '_' + level;
  this.update({
    'user'   : user,
    'trophy' : trophyLevel
  }, {
    'user'   : user,
    'trophy' : trophyLevel
  }, {
    'upsert' : true
  }, next);
};

module.exports = mongoose.model('Badge', schema);
