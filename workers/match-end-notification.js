'use strict';
var mongoose, nconf, async, push, User, Entry, Championship, Match, now, today, tomorrow;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
push = require('push');
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
  async.waterfall([function (next) {
    var query;
    query = Championship.find();
    query.exec(next);
  }, function (championships, next) {
    async.filter(championships, function (championship, next) {
      async.waterfall([function (next) {
        var query;
        query = Match.find();
        query.where('championship').equals(championship._id);
        query.where('date').gte(today).lt(tomorrow);
        query.sort('-date');
        query.limit(1);
        query.exec(next);
      }, function (matches, next) {
        var lastMatch, notify;
        lastMatch = matches[0];
        notify = !!lastMatch && lastMatch.date - now > 0 && lastMatch.date - now < 1000 * 60 * 10;
        next(null, notify);
      }], function (error, result) {
        next(!error && result);
      })
    }, function (championships) {
      next(null, championships);
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
          push(nconf.get('ZEROPUSH_TOKEN'), {
            'device' : entry.user.apnsToken,
            'sound'  : 'match_end1.mp3',
            'alert'  : {
              'loc-key' : 'NOTIFICATION_ROUND_END'
            }
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