/*globals describe, before, after, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
Season, User, Prize;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));

Season = require('../models/season');
User = require('../models/user');
Prize = require('../models/prize');

nconf.defaults(require('../config'));

describe('prize', function () {
  var user;

  before(Season.remove.bind(Season));
  before(User.remove.bind(User));

  before(function (done) {
    var season;
    season = new Season({
      'finishAt'  : new Date(),
      'createdAt' : new Date()
    });
    season.save(done);
  });

  before(function (done) {
    user = new User();
    user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    user.country = 'Brazil';
    user.save(done);
  });

  describe('daily bonus', function () {
    describe('first login in the day', function () {
      before(Prize.remove.bind(Prize));

      it('should give bonus', function (done) {
        var request;
        request = app.get('/users/me/auth');
        request.send({'password' : '1234'});
        request.expect(200);
        request.end(done);
      });

      after(function (done) {
        var request;
        request = app.get('/users/' + user._id + '/prizes');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('second login in the day', function () {
      before(Prize.remove.bind(Prize));

      before(function (done) {
        var request;
        request = app.get('/users/me/auth');
        request.send({'password' : '1234'});
        request.expect(200);
        request.end(done);
      });

      it('should not give bonus', function (done) {
        var request;
        request = app.get('/users/me/auth');
        request.send({'password' : '1234'});
        request.expect(200);
        request.end(done);
      });

      after(function (done) {
        var request;
        request = app.get('/users/' + user._id + '/prizes');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    before(Prize.remove.bind(Prize));

    before(function (done) {
      var prize;
      prize = new Prize({
        'user'   : user,
        'value'  : 2,
        'type'   : 'daily',
        'seenBy' : [user]
      });
      prize.save(done);
    });

    describe('filter unread prizes', function () {
      it('should not list seen prizes', function (done) {
        var request;
        request = app.get('/users/' + user._id + '/prizes');
        request.set('auth-token', auth.token(user));
        request.send({'unreadMessages' : true});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(0);
        });
        request.end(done);
      });
    });

    describe('without filter', function () {
      it('should not list seen prizes', function (done) {
        var request;
        request = app.get('/users/' + user._id + '/prizes');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });
  });

  describe('get', function () {
    var prize;

    before(Prize.remove.bind(Prize));

    before(function (done) {
      prize = new Prize({
        'user'   : user,
        'value'  : 2,
        'type'   : 'daily',
        'seenBy' : [user]
      });
      prize.save(done);
    });

    describe('without id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/' + user._id + '/prizes/1234');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/' + user._id + '/prizes/' + prize._id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('value').be.equal(2);
          response.body.should.have.property('type').be.equal('daily');
        });
        request.end(done);
      });
    });
  });

  describe('mark as read', function () {
    var prize;

    before(Prize.remove.bind(Prize));

    before(function (done) {
      prize = new Prize({
        'user'   : user,
        'value'  : 2,
        'type'   : 'daily',
        'seenBy' : [user]
      });
      prize.save(done);
    });

    it('should mark as read', function (done) {
      var request;
      request = app.put('/users/' + user._id + '/prizes/' + prize._id + '/mark-as-read');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.end(done);
    });

    after(function (done) {
      var request;
      request = app.get('/users/' + user._id);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('funds').be.equal(102);
      });
      request.end(done);
    });
  });
});
