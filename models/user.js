var mongoose, jsonSelect, nconf, async, Schema, schema;

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
  'stake'           : {
    'type'    : Number,
    'default' : 0
  },
  'funds'           : {
    'type'    : Number,
    'default' : 100
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
  'stake'           : 1,
  'funds'           : 1,
  'createdAt'       : 1,
  'updatedAt'       : 1
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

  var Group, GroupMember;
  Group = require('./group');
  GroupMember = require('./group-member');
  return async.waterfall([function (next) {
    var query;
    query = Group.find();
    query.where('invites').equals(this.facebookId ? this.facebookId : this.email);
    query.exec(next);
  }.bind(this), function (groups, next) {
    async.each(groups, function (group, next) {
      var groupMember;
      groupMember = new GroupMember({
        'user'  : this._id,
        'group' : group._id
      });
      groupMember.save(next);
    }.bind(this), next);
  }.bind(this)], next);
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

module.exports = mongoose.model('User', schema);