'use strict';
var mongoose, nconf, async, Group, GroupMember, User, Match;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
Group = require('../models/group');
GroupMember = require('../models/group-member');
User = require('../models/user');
Match = require('../models/match');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

module.exports = function (next) {
  async.waterfall([function (next) {
    var query;
    query = Group.find();
    query.exec(next);
  }, function (groups, next) {
    async.each(groups, function (group, next) {
      async.waterfall([function (next) {
        var query;
        query = GroupMember.find();
        query.populate('user');
        query.where('group').equals(group._id);
        query.exec(next);
      }, function (members, next) {
        async.sortBy(members, function (member, next) {
          next(null, (member.user.funds + member.user.stake) / member.initialFunds * -1);
        }, next);
      }, function (members, next) {
        var ranking;
        ranking = 1;
        async.eachSeries(members, function (member, next) {
          member.ranking = ranking;
          ranking += 1;
          member.save(next);
        }, next);
      }], next);
    }, next);
  }], next);
};

if (require.main === module) {
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}