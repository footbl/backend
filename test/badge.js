/*globals describe, before, it*/
'use strict';
require('should');
describe('badge', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var Badge = require('../models/badge');

  before(User.remove.bind(User));
  before(function (done) {
    var user = new User();
    user._id = '563decb2a6269cb39236de97';
    user.email = 'u0@footbl.co';
    user.username = 'owner';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('list', function () {
    before(Badge.remove.bind(Badge));

    before(function (done) {
      var badge = new Badge();
      badge._id = '563d72882cb3e53efe2827fc';
      badge.user = '563decb2a6269cb39236de97';
      badge.trophy = 'test';
      badge.save(done);
    });

    it('should list one badge', function (done) {
      app.get('/badges').expect(200).expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1)
      }).end(done)
    });
  });

  describe('get', function () {
    before(Badge.remove.bind(Badge));

    before(function (done) {
      var badge = new Badge();
      badge._id = '563d72882cb3e53efe2827fc';
      badge.user = '563decb2a6269cb39236de97';
      badge.trophy = 'test';
      badge.save(done);
    });

    describe('without valid id', function () {
      it('should return', function (done) {
        app.get('/badges/invalid').expect(404).end(done);
      });
    });

    describe('with valid id', function () {
      it('should return', function (done) {
        app.get('/badges/563d72882cb3e53efe2827fc').expect(200).expect(function (response) {
          response.body.should.have.property('trophy').be.equal('test');
        }).end(done);
      });
    });
  });
});
