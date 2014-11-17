var VError, mongoose, jsonSelect, nconf, async, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
async = require('async');
Schema = mongoose.Schema;

schema = new Schema({
  'slug'            : {
    'type' : String
  },
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
  'facebookId'      : {
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
  'type'            : {
    'type'     : String,
    'required' : true,
    'default'  : 'user',
    'enum'     : ['user', 'admin']
  },
  'apnsToken'       : {
    'type' : String
  },
  'ranking'         : {
    'type'     : Number,
    'required' : true,
    'default'  : Infinity
  },
  'previousRanking' : {
    'type'     : Number,
    'required' : true,
    'default'  : Infinity
  },
  'history'         : [
    {
      'date'  : {
        'type'     : Date,
        'required' : true
      },
      'funds' : {
        'type'     : Number,
        'required' : true
      }
    }
  ],
  'lastRecharge'    : {
    'type'    : Date,
    'default' : Date.now
  },
  'active'          : {
    'type'    : Boolean,
    'default' : true
  },
  'country'         : {
    'type' : String
  },
  'createdAt'       : {
    'type'    : Date,
    'default' : Date.now
  },
  'updatedAt'       : {
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
  '_id'             : 0,
  'slug'            : 1,
  'email'           : 1,
  'username'        : 1,
  'facebookId'      : 1,
  'password'        : 0,
  'name'            : 1,
  'about'           : 1,
  'verified'        : 1,
  'featured'        : 1,
  'picture'         : 1,
  'type'            : 0,
  'apnsToken'       : 0,
  'ranking'         : 1,
  'previousRanking' : 1,
  'history'         : 1,
  'lastRecharge'    : 0,
  'active'          : 0,
  'country'         : 1,
  'createdAt'       : 1,
  'updatedAt'       : 1,
  'stake'           : 1,
  'funds'           : 1
});

schema.pre('save', function setUserUpdatedAt(next) {
  'use strict';

  this.updatedAt = new Date();
  next();
});

schema.pre('save', function insertUserIntoInvitedGroups(next) {
  'use strict';

  if (!this.facebookId && !this.email) {
    return next();
  }

  var Group, GroupMember, query;
  Group = require('./group');
  GroupMember = require('./group-member');
  query = Group.find();
  query.where('invites').equals(this.facebookId ? this.facebookId : this.email);
  return query.exec(function (error, groups) {
    if (error) {
      error = new VError(error, 'error finding user "%s" invited groups.', this._id);
      return next(error);
    }
    return async.each(groups, function (group, next) {
      var groupMember;
      groupMember = new GroupMember({
        'user'  : this._id,
        'group' : group._id
      });
      groupMember.save(next);
    }.bind(this), next);
  }.bind(this));
});

schema.pre('save', function setUserDefaultEntry(next) {
  'use strict';

  if (!this.isNew) {
    return next();
  }

  var Championship, Entry;
  Championship = require('./championship');
  Entry = require('./entry');
  return async.waterfall([function (next) {
    var query;
    query = Championship.find();
    query.or([
      {'country' : this.country},
      {'country' : 'United Kingdom'}
    ]);
    return query.exec(next);
  }.bind(this), function (championships, next) {
    var championship, entry;
    if (championships.length === 2) {
      championship = championships[0].country === 'United Kingdom' ? championships[1] : championships[0];
    } else if (championships.length === 1) {
      championship = championships[0];
    } else {
      return next();
    }
    entry = new Entry({
      'slug'         : championship ? championship.slug : null,
      'championship' : championship._id,
      'user'         : this._id
    });
    return entry.save(next);
  }.bind(this)], next);
});

schema.pre('save', function updateCascadeBets(next) {
  'use strict';

  var Bet;
  Bet = require('./bet');
  async.waterfall([function (next) {
    var query;
    query = Bet.find();
    query.where('user').equals(this._id);
    query.populate('match');
    query.exec(next);
  }.bind(this), function (bets, next) {
    async.each(bets, function (bet, next) {
      Bet.update({'_id' : bet._id}, {'$set' : {
        'slug' : bet.match.slug + '-' + this.slug
      }}, next);
    }.bind(this), next)
  }.bind(this)], next);
});

schema.pre('save', function updateCascadeFeatureds(next) {
  'use strict';

  var Featured;
  Featured = require('./featured');
  Featured.update({
    'featured' : this._id
  }, {'$set' : {
    'slug' : this.slug || 'me'
  }}, {'multi' : true}, next);
});

schema.pre('save', function updateCascadeMembers(next) {
  'use strict';

  var Member;
  Member = require('./group-member');
  Member.update({
    'user' : this._id
  }, {'$set' : {
    'slug' : this.slug || 'me'
  }}, {'multi' : true}, next);
});

schema.pre('init', function populateUserCreditRequests(next, data) {
  'use strict';

  async.waterfall([function (next) {
    var CreditRequest, query;
    CreditRequest = require('./credit-request');
    query = CreditRequest.find();
    query.or([
      {'creditedUser' : data._id},
      {'chargedUser' : data._id}
    ]);
    query.exec(next);
  }.bind(this), function (creditRequests, next) {
    this.creditRequests = creditRequests;
    return next();
  }.bind(this)], next);
});

schema.pre('init', function populateUserBets(next, data) {
  'use strict';

  async.waterfall([function (next) {
    var Bet, query;
    Bet = require('./bet');
    query = Bet.find();
    query.where('user').equals(data._id);
    query.populate('match');
    query.exec(next);
  }.bind(this), function (bets, next) {
    this.bets = bets;
    return next();
  }.bind(this)], next);
});

schema.pre('init', function populateUserPrizes(next, data) {
  'use strict';

  async.waterfall([function (next) {
    var Prize, query;
    Prize = require('./prize');
    query = Prize.find();
    query.where('user').equals(data._id);
    query.exec(next);
  }.bind(this), function (prizes, next) {
    this.prizes = prizes;
    return next();
  }.bind(this)], next);
});

schema.virtual('stake').get(function getUserStake() {
  'use strict';

  if (!this.bets) {
    return 0;
  }

  return this.bets.filter(function (bet) {
    return bet.createdAt > this.lastRecharge;
  }.bind(this)).filter(function (bet) {
    return !bet.match.finished;
  }.bind(this)).map(function (bet) {
    return bet.bid;
  }.bind(this)).reduce(function (stake, bid) {
    return stake + bid;
  }.bind(this), 0);
});

schema.virtual('funds').get(function getUserFunds() {
  'use strict';

  if (!this.bets) {
    return 100;
  }

  return this.bets.filter(function (bet) {
    return bet.createdAt > this.lastRecharge;
  }.bind(this)).map(function (bet) {
    return bet.profit;
  }.bind(this)).reduce(function (stake, bid) {
    return stake + bid;
  }.bind(this), this.credits + this.debts);
});

schema.virtual('credits').get(function getUserCredits() {
  'use strict';

  return 100 + this.creditRequestCredits;
});

schema.virtual('debts').get(function getUserDebts() {
  'use strict';

  return this.creditRequestDebts + this.prizeCredits;
});

schema.virtual('prizeCredits').get(function getUserCreditRequestCredits() {
  'use strict';

  if (!this.prizes) {
    return 0;
  }

  return this.prizes.filter(function (prize) {
    return prize.createdAt > this.lastRecharge;
  }.bind(this)).map(function (prize) {
    return prize.value;
  }.bind(this)).reduce(function (credits, prize) {
    return credits + prize;
  }.bind(this), 0);
});

schema.virtual('creditRequestCredits').get(function getUserCreditRequestCredits() {
  'use strict';

  if (!this.creditRequests) {
    return 0;
  }

  return this.creditRequests.filter(function (creditRequest) {
    return creditRequest.createdAt > this.lastRecharge;
  }.bind(this)).filter(function (creditRequest) {
    return creditRequest.creditedUser.toString() === this._id.toString() && creditRequest.payed;
  }.bind(this)).map(function (creditRequest) {
    return creditRequest.value;
  }.bind(this)).reduce(function (credits, credit) {
    return credits + credit;
  }.bind(this), 0);
});

schema.virtual('creditRequestDebts').get(function getUserDebts() {
  'use strict';

  if (!this.creditRequests) {
    return 0;
  }

  return this.creditRequests.filter(function (creditRequest) {
    return creditRequest.createdAt > this.lastRecharge;
  }.bind(this)).filter(function (creditRequest) {
    return creditRequest.chargedUser.toString() === this._id.toString() && creditRequest.payed;
  }.bind(this)).map(function (creditRequest) {
    return -1 * creditRequest.value;
  }.bind(this)).reduce(function (debts, debt) {
    return debts + debt;
  }.bind(this), 0);
});

module.exports = mongoose.model('User', schema);