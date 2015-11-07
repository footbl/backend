'use strict';
var mongoose = require('mongoose');
var nconf = require('nconf');
var async = require('async');
var Season = require('../models/season');
var User = require('../models/user');
var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

module.exports = function createSeason(done) {
  async.waterfall([function (next) {
    Season.findOne().where('finishAt').gt(today).exec(next);
  }, function (season, next) {
    if (season) done();
    season = new Season();
    season.finishAt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    season.save(next);
  }, function (season, _, next) {
    User.update({}, {'$set' : {'funds' : 100, 'stake' : 0, 'history' : []}}, {'multi' : true}, next);
  }], done);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  module.exports(process.exit);
}
