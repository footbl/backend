'use strict';
var mongoose, nconf, async,
Season, User,
now, today;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
Season = require('../models/season');
User = require('../models/user');
now = new Date();
today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

module.exports = function createSeason(done) {
  async.waterfall([function (next) {
    var query;
    query = Season.findOne();
    query.where('finishAt').gt(today);
    query.exec(next);
  }, function (season, next) {
    if (season) done();
    season = new Season();
    season.finishAt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    season.save(next);
  }, function (season, _, next) {
    User.update({}, {'$set' : {'funds' : 100, 'stake' : 0}}, {'multi' : true}, next);
  }], done);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  module.exports(process.exit);
}
