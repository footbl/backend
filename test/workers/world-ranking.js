/*globals describe, before, it, after*/
'use strict';

var async, ranking,
User,
users;

require('should');
require('../../index.js');
async = require('async');
User = require('../../models/user');
ranking = require('../../workers/world-ranking');
users = [];

describe('world ranking worker', function () {
  before(User.remove.bind(User));

  before(function (done) {
    var user;
    user = new User({'password' : '1234', 'facebookId' : '1', 'funds' : 110});
    users.push(user);
    user.save(done);
  });

  before(function (done) {
    var user;
    user = new User({'password' : '1234', 'facebookId' : '2', 'funds' : 100});
    users.push(user);
    user.save(done);
  });

  before(function (done) {
    var user;
    user = new User({'password' : '1234', 'facebookId' : '3', 'funds' : 90});
    users.push(user);
    user.save(done);
  });

  before(function (done) {
    var user;
    user = new User({'password' : '1234', 'facebookId' : '4', 'funds' : 80});
    users.push(user);
    user.save(done);
  });

  it('should sort', ranking);

  after(function (done) {
    User.findOne({'_id' : users[0]._id}, function (error, user) {
      user.should.have.property('ranking').be.equal(1);
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : users[1]._id}, function (error, user) {
      user.should.have.property('ranking').be.equal(2);
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : users[2]._id}, function (error, user) {
      user.should.have.property('ranking').be.equal(3);
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : users[3]._id}, function (error, user) {
      user.should.have.property('ranking').be.equal(4);
      done();
    });
  });
});