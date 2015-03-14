'use strict';

var mongoose, jsonSelect, nconf, async, Schema, schema;

mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'championship' : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Championship',
    'required' : true
  },
  'guest'        : {
    'name'    : {
      'type'     : String,
      'required' : true
    },
    'picture' : {
      'type'  : String,
      'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    }
  },
  'host'         : {
    'name'    : {
      'type'     : String,
      'required' : true
    },
    'picture' : {
      'type'  : String,
      'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    }
  },
  'round'        : {
    'type'     : Number,
    'required' : true
  },
  'date'         : {
    'type'     : Date,
    'required' : true
  },
  'finished'     : {
    'type'     : Boolean,
    'required' : true,
    'default'  : false
  },
  'elapsed'      : {
    'type' : Number
  },
  'result'       : {
    'guest' : {
      'type'     : Number,
      'required' : true,
      'default'  : 0
    },
    'host'  : {
      'type'     : Number,
      'required' : true,
      'default'  : 0
    }
  },
  'pot'          : {
    'guest' : {
      'type'    : Number,
      'default' : 0
    },
    'host'  : {
      'type'    : Number,
      'default' : 0
    },
    'draw'  : {
      'type'    : Number,
      'default' : 0
    }
  },
  'createdAt'    : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'    : {
    'type' : Date
  }
}, {
  'collection' : 'matches',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({
  'championship' : 1,
  'guest'        : 1,
  'host'         : 1,
  'round'        : 1
}, {
  'unique' : true
});

schema.plugin(jsonSelect, {
  '_id'          : 1,
  'championship' : 0,
  'guest'        : 1,
  'host'         : 1,
  'round'        : 1,
  'date'         : 1,
  'finished'     : 1,
  'elapsed'      : 1,
  'result'       : 1,
  'pot'          : 1,
  'winner'       : 1,
  'jackpot'      : 1,
  'reward'       : 1,
  'createdAt'    : 1,
  'updatedAt'    : 1
});

schema.pre('save', function setMatchUpdatedAt(next) {
  this.updatedAt = new Date();
  return next();
});

schema.pre('save', function updateMatchBets(next) {
  if (!this.finished) return next();
  return async.waterfall([function (next) {
    var Bet, query;
    Bet = require('./bet');
    query = Bet.find();
    query.where('payed').equals(false);
    query.populate('user');
    query.exec(next);
  }.bind(this), function (bets, next) {
    async.each(bets, function (bet, next) {
      bet.payed = true;
      bet.user.stake -= bet.bid;
      if (bet.result === this.winner) bet.user.funds += bet.bid * this.reward;
      async.parallel([bet.save.bind(bet), bet.user.save.bind(bet.user)], next);
    }.bind(this), next);
  }.bind(this)], next);
});

schema.pre('remove', function removeCascadeBets(next) {
  async.waterfall([function (next) {
    var Bet, query;
    Bet = require('./bet');
    query = Bet.find();
    query.where('match').equals(this._id);
    query.exec(next);
  }.bind(this), function (bets, next) {
    async.each(bets, function (bet, next) {
      bet.remove(next);
    }.bind(this), next);
  }.bind(this)], next);
});

schema.virtual('winner').get(function getMatchWinner() {
  if (!this.finished) return null;
  if (this.result.guest > this.result.host) return 'guest';
  if (this.result.guest < this.result.host) return 'host';
  return 'draw';
});

schema.virtual('jackpot').get(function getMatchJackpot() {
  return this.pot.guest + this.pot.draw + this.pot.host;
});

schema.virtual('reward').get(function getMatchReward() {
  if (!this.jackpot) return 0;
  return this.jackpot / this.pot[this.winner];
});

module.exports = mongoose.model('Match', schema);
