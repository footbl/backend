/*globals describe, before, it, after*/
'use strict';

var async, ranking, previousRanking,
User, Group, GroupMember,
members, group;

require('should');
require('../../index.js');
async = require('async');
User = require('../../models/user');
Group = require('../../models/group');
GroupMember = require('../../models/group-member');
ranking = require('../../workers/group-ranking');
previousRanking = require('../../workers/group-previous-ranking');
members = [];

describe('group previous ranking worker', function () {
  before(User.remove.bind(User));
  before(Group.remove.bind(Group));
  before(GroupMember.remove.bind(GroupMember));

  before(function (done) {
    var user, member;
    user = new User({'password' : '1234', 'slug' : 'user', 'funds' : 110});
    group = new Group({
      'name'       : 'buddies',
      'slug'       : new Date().getTime().toString(36).substring(3),
      'freeToEdit' : true,
      'owner'      : user
    });
    member = new GroupMember({'slug' : user.slug, 'group' : group._id, 'user' : user._id, 'initialFunds' : 100});
    members.push(member);
    async.parallel([user.save.bind(user), member.save.bind(member), group.save.bind(group)], done);
  });

  before(function (done) {
    var user, member;
    user = new User({'password' : '1234', 'slug' : 'user', 'funds' : 100});
    member = new GroupMember({'slug' : user.slug, 'group' : group._id, 'user' : user._id, 'initialFunds' : 100});
    members.push(member);
    async.parallel([user.save.bind(user), member.save.bind(member)], done);
  });

  before(function (done) {
    var user, member;
    user = new User({'password' : '1234', 'slug' : 'user', 'funds' : 90});
    member = new GroupMember({'slug' : user.slug, 'group' : group._id, 'user' : user._id, 'initialFunds' : 100});
    members.push(member);
    async.parallel([user.save.bind(user), member.save.bind(member)], done);
  });

  before(function (done) {
    var user, member;
    user = new User({'password' : '1234', 'slug' : 'user', 'funds' : 80});
    member = new GroupMember({'slug' : user.slug, 'group' : group._id, 'user' : user._id, 'initialFunds' : 100});
    members.push(member);
    async.parallel([user.save.bind(user), member.save.bind(member)], done);
  });

  before(ranking);

  it('should save previous ranking', previousRanking);

  after(function (done) {
    GroupMember.findOne({'_id' : members[0]._id}, function (error, member) {
      member.should.have.property('previousRanking').be.equal(1);
      done();
    });
  });

  after(function (done) {
    GroupMember.findOne({'_id' : members[1]._id}, function (error, member) {
      member.should.have.property('previousRanking').be.equal(2);
      done();
    });
  });

  after(function (done) {
    GroupMember.findOne({'_id' : members[2]._id}, function (error, member) {
      member.should.have.property('previousRanking').be.equal(3);
      done();
    });
  });

  after(function (done) {
    GroupMember.findOne({'_id' : members[3]._id}, function (error, member) {
      member.should.have.property('previousRanking').be.equal(4);
      done();
    });
  });
});