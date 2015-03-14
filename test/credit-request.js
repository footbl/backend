/*globals describe, before, after, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
    Season, User, CreditRequest;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));
Season = require('../models/season');
User = require('../models/user');
CreditRequest = require('../models/credit-request');

describe('credit request', function () {
  var creditedUser, chargedUser;

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
    creditedUser = new User();
    creditedUser.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    creditedUser.country = 'Brazil';
    creditedUser.save(done);
  });

  before(function (done) {
    chargedUser = new User();
    chargedUser.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    chargedUser.country = 'Brazil';
    chargedUser.save(done);
  });

  describe('create', function () {
    describe('facebook user', function () {
      before(CreditRequest.remove.bind(CreditRequest));

      it('should create', function (done) {
        var request;
        request = app.post('/users/1234/credit-requests');
        request.set('auth-token', auth.token(creditedUser));
        request.expect(201);
        request.end(done);
      });
    });

    describe('registered user', function () {
      before(CreditRequest.remove.bind(CreditRequest));

      it('should create', function (done) {
        var request;
        request = app.post('/users/' + chargedUser._id + '/credit-requests');
        request.set('auth-token', auth.token(creditedUser));
        request.expect(201);
        request.end(done);
      });
    });
  });

  describe('list', function () {
    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var creditRequest;
      creditRequest = new CreditRequest({
        'creditedUser' : creditedUser,
        'chargedUser'  : chargedUser
      });
      creditRequest.save(done);
    });

    it('should list two credit request', function (done) {
      var request;
      request = app.get('/users/' + chargedUser._id + '/credit-requests');
      request.set('auth-token', auth.token(chargedUser));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });

    it('should list two requested credit', function (done) {
      var request;
      request = app.get('/users/' + creditedUser._id + '/requested-credits');
      request.set('auth-token', auth.token(creditedUser));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });
  });

  describe('get', function () {
    var creditRequest;

    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      creditRequest = new CreditRequest({
        'creditedUser' : creditedUser,
        'chargedUser'  : chargedUser
      });
      creditRequest.save(done);
    });

    describe('without id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/' + chargedUser._id + '/credit-requests/1234');
        request.set('auth-token', auth.token(chargedUser));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid id', function () {
      it('should get', function (done) {
        var request;
        request = app.get('/users/' + chargedUser._id + '/credit-requests/' + creditRequest._id);
        request.set('auth-token', auth.token(chargedUser));
        request.expect(200);
        request.end(done);
      });
    });
  });

  describe('approve', function () {
    var creditRequest;

    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      creditRequest = new CreditRequest({
        'creditedUser' : creditedUser,
        'chargedUser'  : chargedUser
      });
      creditRequest.save(done);
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/' + chargedUser._id + '/credit-requests/' + creditRequest._id + '/approve');
        request.set('auth-token', auth.token(creditedUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with valid token', function () {
      describe('requester with less than 100 of funds', function () {
        describe('with suficcient funds', function () {
          before(function (done) {
            chargedUser.funds = 110;
            chargedUser.save(done);
          });

          before(function (done) {
            creditedUser.funds = 90;
            creditedUser.save(done);
          });

          it('should recharge user wallet', function (done) {
            var request;
            request = app.put('/users/' + chargedUser._id + '/credit-requests/' + creditRequest._id + '/approve');
            request.set('auth-token', auth.token(chargedUser));
            request.expect(200);
            request.end(done);
          });
        });
      });

      describe('requester with more than 100 of funds', function () {
        before(function (done) {
          chargedUser.funds = 110;
          chargedUser.save(done);
        });

        it('should not recharge wallet', function (done) {
          var request;
          request = app.put('/users/' + chargedUser._id + '/credit-requests/' + creditRequest._id + '/approve');
          request.set('auth-token', auth.token(chargedUser));
          request.expect(200);
          request.end(done);
        });
      });
    });
  });
});
