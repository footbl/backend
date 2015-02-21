/*globals describe, before, beforeEach, afterEach, it*/
'use strict';

var supertest, app, auth,
User, Entry, Championship,
user, otherUser, championship, now;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Entry = require('../../models/entry');
Championship = require('../../models/championship');
now = new Date();

describe('entry controller', function () {
  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  before(function (done) {
    championship = new Championship({
      'name'    : 'brasileirão',
      'slug'    : 'brasileirao-brasil-2014',
      'type'    : 'national league',
      'country' : 'brasil',
      'edition' : 2014
    });
    championship.save(done);
  });

  beforeEach('remove entries', Entry.remove.bind(Entry));

  describe('create', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/entries');
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/invalid/entries');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('without championship', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/entries');
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('championship').be.equal('required');
        });
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/entries');
        request.set('auth-token', auth.token(otherUser));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.expect(405);
        request.end(done);
      });
    });

    describe('with a created entry', function () {
      beforeEach('create entry', function (done) {
        var request;
        request = app.post('/users/me/entries');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.end(done);
      });

      it('should raise error with repeated user', function (done) {
        var request;
        request = app.post('/users/me/entries');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.expect(409);
        request.end(done);
      });
    });

    describe('with valid credentials and championship', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users/user/entries');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('user');
          response.body.should.have.property('championship');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/entries');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/entries');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one entry created', function () {
      beforeEach('create entry', function (done) {
        var request;
        request = app.post('/users/user/entries');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/user/entries');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });

      it('should return empty in second page', function (done) {
        var request;
        request = app.get('/users/user/entries');
        request.set('auth-token', auth.token(user));
        request.send({'page' : 1});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(0);
        });
        request.end(done);
      });
    });
  });

  describe('details', function () {
    beforeEach('create entry', function (done) {
      var request;
      request = app.post('/users/user/entries');
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/entries/brasileirao-brasil-2014');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/entries/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('user').with.property('slug').be.equal('user');
          response.body.should.have.property('championship').with.property('slug').be.equal('brasileirao-brasil-2014');
          response.body.should.have.property('slug').be.equal('brasileirao-brasil-2014');
        });
        request.end(done);
      });
    });
  });

  describe('update', function () {
    beforeEach('create entry', function (done) {
      var request;
      request = app.post('/users/user/entries');
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/user/entries/brasileirao-brasil-2014');
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.send({'order' : 1});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(otherUser));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.send({'order' : 1});
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/invalid/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.send({'order' : 1});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/user/entries/invalid');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.send({'order' : 1});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should update', function (done) {
        var request;
        request = app.put('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.send({'order' : 1});
        request.expect(200);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('order').be.equal(1);
        });
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    beforeEach('create entry', function (done) {
      var request;
      request = app.post('/users/user/entries');
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user/entries/brasileirao-brasil-2014');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(otherUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/invalid/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user/entries/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should remove', function (done) {
        var request;
        request = app.del('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.expect(204);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/user/entries/brasileirao-brasil-2014');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });
  });
});
