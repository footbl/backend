'use strict';
var redis, mongoose, nconf, async, push, User, Entry, Championship, Match, now, today, tomorrow, uri, url, client;

redis = require('redis');
url = require('url');
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

if (nconf.get('REDISCLOUD_URL')) {
  uri = url.parse(nconf.get('REDISCLOUD_URL'));
  client = redis.createClient(uri.port, uri.hostname);
  if (uri.auth) {
    client.auth(uri.auth.split(':')[1]);
  }
} else {
  client = redis.createClient();
}

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
        query.sort('date');
        query.limit(1);
        query.exec(next);
      }, function (matches, next) {
        var firstMatch, notify;
        firstMatch = matches[0];
        notify = !!firstMatch && firstMatch.date - now > 0 && firstMatch.date - now < 1000 * 60 * 10;
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
        async.filter(entries, function (entry, next) {
          next(entry && entry.user && entry.user._id);
        }, function (entries) {
          next(null, entries);
        });
      }, function (entries, next) {
        async.each(entries, function (entry, next) {
          async.waterfall([function (next) {
            client.get(entry.user._id + ':match-start-notification', next);
          }, function (id, next) {
            if (id) return next();
            client.set(entry.user._id + ':match-start-notification', true);
            client.expire(entry.user._id + ':match-start-notification', 9 * 60 * 60);
            return push(nconf.get('ZEROPUSH_TOKEN'), {
              'device' : entry.user.apnsToken,
              'sound'  : 'match_start.mp3',
              'alert'  : {
                'loc-key' : 'NOTIFICATION_ROUND_START'
              }
            }, next);
          }], next);
        }, next);
      }], next);
    }, next);
  }], next);
};

if (require.main === module) {
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}
