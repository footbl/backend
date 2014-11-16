'use strict';
var VError, mongoose, nconf, async, Match, Championship, User, now, today, tomorrow;

VError = require('verror');
mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
Match = require('../models/match');
Championship = require('../models/championship');
User = require('../models/user');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

now = new Date();
today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

module.exports = function (next) {
  async.waterfall([function (next) {
    async.parallel([function (next) {
      async.waterfall([function (next) {
        var query;
        query = Match.find();
        query.where('date').lt(today);
        query.where('finished').equals(false);
        query.populate('championship');
        query.exec(next);
      }, function (matches, next) {
        async.each(matches, function (match, next) {
          match.remove(next);
        }, next);
      }], next);
    }, function (next) {
      async.waterfall([function (next) {
        var query;
        query = Match.find();
        query.where('date').gt(tomorrow);
        query.where('finished').equals(true);
        query.populate('championship');
        query.exec(next);
      }, function (matches, next) {
        async.each(matches, function (match, next) {
          match.remove(next);
        }, next);
      }], next);
    }], next);
  }], next);
};

if (require.main === module) {
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}