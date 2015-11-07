'use strict';
var mongoose = require('mongoose');
var nconf = require('nconf');
var async = require('async');
var User = require('../models/user');

module.exports = function createSeason(done) {
  async.waterfall([function (next) {
    User.find().exec(next);
  }, function (users, next) {
    async.each(users, function (user, next) {
      user.update({'$push' : {'history' : {'date' : new Date, 'funds' : user.funds, 'stake' : user.stake}}}, next);
    }, next);
  }], done);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  module.exports(process.exit);
}
