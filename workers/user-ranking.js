'use strict';
var mongoose = require('mongoose');
var nconf = require('nconf');
var async = require('async');
var User = require('../models/user');

module.exports = function createSeason(done) {
  async.waterfall([function (next) {
    User.find().exec(next);
  }, function (users, next) {
    async.sortBy(users, function (user, next) {
      next(null, user.funds + user.stake);
    }, next);
  }, function (users, next) {
    users.forEach(function (user, index) {
      user.previousRanking = user.ranking;
      user.ranking = index;
    });
    async.each(users, function (user, next) {
      user.save(next);
    }, next);
  }], done);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  module.exports(process.exit);
}
