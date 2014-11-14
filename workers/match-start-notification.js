'use strict';
var mongoose, nconf, async, ZeroPush, User, Entry, Championship, Match, now, today, tomorrow;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
ZeroPush = require('nzero-push').ZeroPush;
User = require('../models/user');
Entry = require('../models/entry');
Championship = require('../models/championship');
Match = require('../models/match');

now = new Date();
today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

module.exports = function (next) {
  async.waterfall([function () {
    var query;
    query = Championship.find();
    query.exec(next);
  }, function (championships, next) {
    async.filter(championships, function (championship, next) {
      var query;
      query = Match.find();
      query.where('championship').equals(championship._id);
      query.where('date').gte(today).lt(tomorrow);
      query.sort('date');
      query.limit(1);
      query.exec(next);
    }, function (error, matches) {
      var firstMatch;
      firstMatch = matches[0];
      next(!error && firstMatch.date - now > 0 && firstMatch.date - now < 1000 * 60 * 10);
    });
  }, function (championships, next) {
    async.each(championships, function (championship, next) {
      async.waterfall([function (next) {
        var query;
        query = Entry.find();
        query.where('championship').equals(championship._id);
        query.populate('user');
        query.exec(next);
      }, function (entries, next) {
        async.each(entries, function (entry, next) {
          var push;
          push = new ZeroPush(nconf.get('ZEROPUSH_TOKEN'));
          push.notify('ios-mac', {
            'device_tokens' : [entry.user.apnsToken]
          }, {
            'sound' : 'match_start.mp3',
            'alert' : JSON.stringify({
              'loc-key' : 'NOTIFICATION_ROUND_START'
            })
          }, next);
        }, next);
      }], next);
    }, next);
  }], next);
};

if (require.main === module) {
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}