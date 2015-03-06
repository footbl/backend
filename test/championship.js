/*globals describe, before, after, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
    User, Championship;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));
User = require('../models/user');
Championship = require('../models/championship');

nconf.defaults(require('../config'));

describe('championship', function () {
  var user;

  before(User.remove.bind(User));

  before(function (done) {
    user = new User();
    user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    user.country = 'Brazil';
    user.funds = 110;
    user.save(done);
  });

  describe('list', function () {
    before(Championship.remove.bind(Championship));

    before(function (done) {
      var championship;
      championship = new Championship({
        'name'    : 'brasileirão',
        'type'    : 'national league',
        'country' : 'Brazil'
      });
      championship.save(done);
    });

    it('should list one championship', function (done) {
      var request;
      request = app.get('/championships');
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
    var championship;

    before(Championship.remove.bind(Championship));

    before(function (done) {
      championship = new Championship({
        'name'    : 'brasileirão',
        'type'    : 'national league',
        'country' : 'Brazil'
      });
      championship.save(done);
    });

    it('should list one championship', function (done) {
      var request;
      request = app.get('/championships/' + championship._id);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('name').be.equal('brasileirão');
        response.body.should.have.property('type').be.equal('national league');
        response.body.should.have.property('country').be.equal('Brazil');
      });
      request.end(done);
    });
  });
});