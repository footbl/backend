'use strict';
var mongoose = require('mongoose');
var nconf = require('nconf');
var async = require('async');
var Challenge = require('../models/challenge');
var Match = require('../models/match');
var Championship = require('../models/championship');
var User = require('../models/user');

module.exports = function (done) {
  async.waterfall([function (next) {
    Challenge.find().where('payed').equals(false).where('accepted').equals(true).exec(next);
  }, function (challenges, next) {
    async.each(challenges, function (challenge, next) {
      if (!challenge.match.finished) return next();
      var hasWinner = challenge.challenger.result === challenge.match.winner || challenge.challenged.result === challenge.match.winner;
      async.parallel([function (next) {
        challenge.update({'$set' : {'payed' : true}}, next);
      }, function (next) {
        challenge.challenger.user.update({
          '$inc' : {
            'funds' : hasWinner ? (challenge.challenger.result === challenge.match.winner ? challenge.bid * challenge.match.reward : 0) : challenge.bid,
            'stake' : -challenge.bid
          }
        }, next);
      }, function (next) {
        challenge.challenged.user.update({
          '$inc' : {
            'funds' : hasWinner ? (challenge.challenged.result === challenge.match.winner ? challenge.bid * challenge.match.reward : 0) : challenge.bid,
            'stake' : -challenge.bid
          }
        }, next);
      }], next);
    }, next);
  }], done);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  module.exports(process.exit);
}
