/*globals describe, before, it, after*/
var async, ranking, previousRanking,
User,
users;

require('should');
require('../../index.js');
async = require('async');
User = require('../../models/user');
ranking = require('../../workers/world-ranking');
previousRanking = require('../../workers/world-previous-ranking');
users = [];

describe('world previous ranking worker', function () {
  'use strict';

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

  before(ranking);

  it('should save previous ranking', previousRanking);

  after(function (done) {
    User.findOne({'_id' : users[0]._id}, function (error, user) {
      user.should.have.property('previousRanking').be.equal(1);
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : users[1]._id}, function (error, user) {
      user.should.have.property('previousRanking').be.equal(2);
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : users[2]._id}, function (error, user) {
      user.should.have.property('previousRanking').be.equal(3);
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : users[3]._id}, function (error, user) {
      user.should.have.property('previousRanking').be.equal(4);
      done();
    });
  });
});