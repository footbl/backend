'use strict';
var mongoose, nconf, async, User, Match, now;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
User = require('../models/user');
Match = require('../models/match');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

module.exports = function (next) {
  async.waterfall([function (next) {
    var query;
    query = User.find();
    query.or([
      {'email' : {'$exists' : true}},
      {'facebookId' : {'$exists' : true}}
    ]);
    query.exec(next);
  }, function (users, next) {
    async.each(users, function (user, next) {
      user.previousRanking = user.ranking;
      user.save(next);
    }, next);
  }], next);
};

if (require.main === module) {
  now = new Date();
  if (now.getDay() !== 0) {
    process.exit();
  }
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}