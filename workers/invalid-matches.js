'use strict';
var mongoose = require('mongoose');
var nconf = require('nconf');
var async = require('async');
var Bet = require('../models/bet');
var Championship = require('../models/championship');
var Challenge = require('../models/challenge');
var Match = require('../models/match');
var User = require('../models/user');
var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

module.exports = function (done) {
  async.waterfall([function (done) {
    Match.find()
    .where('finished').equals(false)
    .where('date').lt(today)
    .exec(done);
  }, function (matches, done) {
    async.each(matches, function (match, done) {
      async.series([function (done) {
        async.waterfall([function (done) {
          Bet.find()
          .where('match').equals(match)
          .exec(done);
        }, function (bets, done) {
          async.each(bets, function (bet, done) {
            async.series([function (done) {
              bet.user.update({'$inc' : {'funds' : bet.bid, 'stake' : -bet.bid}}, done);
            }, function (done) {
              bet.remove(done);
            }], done);
          }, done);
        }], done);
      }, function (done) {
        async.waterfall([function (done) {
          Challenge.find()
          .where('match').equals(match)
          .exec(done);
        }, function (challenges, done) {
          async.each(challenges, function (challenge) {
            async.series([function (done) {
              challenge.challenger.update({'$inc' : {'funds' : challenge.bid, 'stake' : -challenge.bid}}, done);
            }, function (done) {
              if (!challenge.accepted) return done();
              challenge.challenged.update({'$inc' : {'funds' : challenge.bid, 'stake' : -challenge.bid}}, done);
            }, function (done) {
              challenge.remove(done);
            }], done);
          }, done);
        }], done);
      }, function (done) {
        match.remove(done);
      }], done);
    }, done);
  }], done);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  module.exports(process.exit);
}
