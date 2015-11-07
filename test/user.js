/*globals describe, before, it*/
'use strict';
require('should');
describe('user', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');

  before(User.remove.bind(User));

  before(function (done) {
    var user = new User();
    user._id = '563decb2a6269cb39236de97';
    user.email = 'u0@footbl.co';
    user.username = 'owner';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de98';
    user.email = 'u1@footbl.co';
    user.username = 'u1';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('create', function () {
    beforeEach(User.remove.bind(User, {'_id' : {'$nin' : ['563decb2a6269cb39236de97', '563decb7a6269cb39236de98']}}));

    it('should create', function (done) {
      app.post('/users').send({'password' : 'teste'}).expect(201).end(done)
    });
  });

  describe('list', function () {
    beforeEach(User.remove.bind(User, {'_id' : {'$nin' : ['563decb2a6269cb39236de97', '563decb7a6269cb39236de98']}}));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/users').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      it('should list one user', function (done) {
        app.get('/users').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(2);
        }).end(done)
      });
    });
  });

  describe('get', function () {
    beforeEach(User.remove.bind(User, {'_id' : {'$nin' : ['563decb2a6269cb39236de97', '563decb7a6269cb39236de98']}}));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('without valid id', function () {
        it('should return', function (done) {
          app.get('/users/invalid').expect(404).end(done);
        });
      });

      describe('with valid id', function () {
        it('should return', function (done) {
          app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.have.property('email');
          }).end(done);
        });
      });
    });
  });

  describe('update', function () {
  });

  describe('delete', function () {
  });

  describe('recharge', function () {
  });

  describe('password recovery', function () {
  });

  describe('follow', function () {
  });

  describe('unfollow', function () {
  });

  describe('followers', function () {
  });

  describe('following', function () {
  });
});
