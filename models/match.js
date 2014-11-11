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
  'championship' : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Championship',
    'required' : true
  },
  'guest'        : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Team',
    'required' : true
  },
  'host'         : {
    'type'     : Schema.Types.ObjectId,
    'ref'      : 'Team',
    'required' : true
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
  '_id'          : 0,
  'slug'         : 1,
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
  'bet'          : 1,
  'createdAt'    : 1,
  'updatedAt'    : 1
});

schema.pre('save', function setMatchUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

schema.methods.findBet = function (user, next) {
  var Bet, query;
  Bet = require('./bet');
  query = Bet.findOne();
  query.where('match').equals(this._id);
  query.where('user').equals(user);
  query.populate('user');
  query.exec(function (error, bet) {
    this._bet = bet;
    next(error);
  }.bind(this));
};

schema.virtual('bet').get(function getMatchBet() {
  return this._bet;
});

schema.virtual('winner').get(function getMatchWinner() {
  'use strict';

  if (!this.finished) {
    return null;
  }
  if (this.result.guest > this.result.host) {
    return 'guest';
  }
  if (this.result.guest < this.result.host) {
    return 'host';
  }
  return 'draw';
});

schema.virtual('jackpot').get(function getMatchJackpot() {
  'use strict';

  return this.pot.guest + this.pot.draw + this.pot.host;
});

schema.virtual('reward').get(function getMatchReward() {
  'use strict';

  if (!this.jackpot) {
    return 0;
  }

  switch (this.winner) {
    case 'guest' :
      return this.jackpot / this.pot.guest;
    case 'host'  :
      return this.jackpot / this.pot.host;
    default      :
      return this.jackpot / this.pot.draw;
  }
});

module.exports = mongoose.model('Match', schema);