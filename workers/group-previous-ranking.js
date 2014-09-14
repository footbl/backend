'use strict';
var mongoose, nconf, async, Group, GroupMember, User, now;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
Group = require('../models/group');
GroupMember = require('../models/group-member');
User = require('../models/user');

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
        async.each(members, function (member, next) {
          member.previousRanking = member.ranking;
          member.save(next);
        }, next);
      }], next);
    }, next);
  }], next);
};

if (require.main === module) {
  now = new Date();
  if (now.getDay() !== 0) {
    process.exit();
  }
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  module.exports(process.exit);
}