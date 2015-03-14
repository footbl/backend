/*globals describe, before, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
Season, User;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));

Season = require('../models/season');
User = require('../models/user');
Season = require('../models/season');

nconf.defaults(require('../config'));

describe('season', function () {
  var user;

  before(User.remove.bind(User));

  before(function (done) {
    user = new User();
    user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    user.country = 'Brazil';
    user.save(done);
  });

  describe('list', function () {
    before(Season.remove.bind(Season));

    before(function (done) {
      var season;
      season = new Season({
        'sponsor'  : 'Barcelona FC.',
        'gift'     : 'app store gift card',
        'finishAt' : '2015-03-05T22:29:47.133Z'
      });
      season.save(done);
    });

    it('should list one season', function (done) {
      var request;
      request = app.get('/seasons');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });
  });

  describe('get', function () {
    var season;

    before(Season.remove.bind(Season));

    before(function (done) {
      season = new Season({
        'sponsor'  : 'Barcelona FC.',
        'gift'     : 'app store gift card',
        'finishAt' : '2015-03-05T22:29:47.133Z'
      });
      season.save(done);
    });

    it('should list one season', function (done) {
      var request;
      request = app.get('/seasons/' + season._id);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('sponsor').be.equal('Barcelona FC.');
        response.body.should.have.property('gift').be.equal('app store gift card');
      });
      request.end(done);
    });
  });
});
