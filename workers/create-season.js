'use strict';
var mongoose, nconf, async,
Season, User,
now, today;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
Season = require('../../models/season');
User = require('../../models/user');
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
    season.finishAt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 28));
    season.save(next);
  }, function (season, _, next) {
    User.update({}, {'$push' : {'season' : season._id}}, {'multi' : true}, next);
  }], done);
};

if (require.main === module) {
  nconf.argv();
  nconf.env();
  nconf.defaults(require('../../config'));
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}
