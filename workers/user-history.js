'use strict';
var mongoose, nconf, async, User, Match, now;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
User = require('../models/user');
Match = require('../models/match');
now = new Date();

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

module.exports = function (next) {
  async.waterfall([function (next) {
    var query;
    query = User.find();
    query.exec(next);
  }, function (users, next) {
    async.each(users, function (user, next) {
      var emptyHistory, hasTodayHistory, changedFunds;
      emptyHistory = user.history.length === 0;
      hasTodayHistory = user.history[0] && user.history[0].date.getDate() === now.getDate() && user.history[0].date.getMonth() === now.getMonth() && user.history[0].date.getFullYear() === now.getFullYear();
      changedFunds = user.history[0] && user.history[0].funds !== user.funds + user.stake;

      if (emptyHistory || (!hasTodayHistory && changedFunds)) {
        user.history.push({'date' : now, 'funds' : user.funds + user.stake});
      } else if (hasTodayHistory && changedFunds) {
        user.history[0].funds = user.funds + user.stake;
      }
      user.history = user.history.sort(function (a, b) {
        return b.date - a.date;
      }).slice(0, 7);
      user.save(next);
    }, next);
  }], next);
};

if (require.main === module) {
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}