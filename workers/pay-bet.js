'use strict';
var mongoose = require('mongoose');
var nconf = require('nconf');
var async = require('async');
var Bet = require('../models/bet');
var Match = require('../models/match');
var Championship = require('../models/championship');
var User = require('../models/user');

module.exports = function (done) {
  async.waterfall([function (next) {
    Bet.find().where('payed').equals(false).exec(next);
  }, function (bets, next) {
    async.each(bets, function (bet, next) {
      if (!bet.match.finished) return next();
      async.parallel([function (next) {
        bet.update({'$set' : {'payed' : true}}, next);
      }, function (next) {
        bet.user.update({
          '$inc' : {
            'funds' : bet.result === bet.match.winner ? bet.bid * bet.match.reward : 0,
            'stake' : -bet.bid
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
