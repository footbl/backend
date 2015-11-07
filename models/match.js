'use strict';

var mongoose = require('mongoose');
var async = require('async');
var schema = new mongoose.Schema({
  'championship' : {
    'type'         : mongoose.Schema.Types.ObjectId,
    'ref'          : 'Championship',
    'required'     : true,
    'autopopulate' : true
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
  }
}, {
  'collection' : 'matches',
  'strict'     : true,
  'toJSON'     : {
    'virtuals' : true
  }
});

schema.index({'championship' : 1, 'guest' : 1, 'host' : 1, 'round' : 1}, {'unique' : true});

schema.plugin(require('mongoose-autopopulate'));
schema.plugin(require('mongoose-json-select'), {
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
  'reward'       : 1
});

schema.virtual('winner').get(function () {
  if (this.result.guest > this.result.host) return 'guest';
  if (this.result.guest < this.result.host) return 'host';
  return 'draw';
});

schema.virtual('jackpot').get(function () {
  return this.pot.guest + this.pot.draw + this.pot.host;
});

schema.virtual('reward').get(function () {
  return this.jackpot / this.pot[this.winner];
});

module.exports = mongoose.model('Match', schema);
