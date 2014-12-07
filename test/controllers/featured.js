/*globals describe, before, beforeEach, afterEach, it, after*/
var supertest, app, auth,
User, Featured,
user, otherUser;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Featured = require('../../models/featured');

describe('featured controller', function () {
  'use strict';

  before(User.remove.bind(User));

  before(function (done) {
    user = new User({'password' : '1234', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'slug' : 'featured-user'});
    otherUser.save(done);
  });

  beforeEach('remove featured', Featured.remove.bind(Featured));

  describe('create', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.send({'featured' : 'featured-user'});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/invalid/featured');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : 'featured-user'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('without user', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('featured').be.equal('required');
        });
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(otherUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with a created featured', function () {
      beforeEach('createfeatured', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : 'featured-user'});
        request.end(done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : 'featured-user'});
        request.expect(409);
        request.end(done);
      });
    });

    describe('with valid credentials and user', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : 'featured-user'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('featured').with.property('slug').be.equal('featured-user');
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
        request = app.get('/users/user/featured');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/featured');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one featured created', function () {
      beforeEach('create featured', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : 'featured-user'});
        request.end(done);
      });

      it('should list my featured', function (done) {
        var request;
        request = app.get('/users/me/featured');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/user/featured');
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
        request = app.get('/users/user/featured');
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

  describe('list fans', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/featured-user/fans');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/fans');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one featured created', function () {
      beforeEach('createfeatured', function (done) {
        var request;
        request = app.post('/users/user/featured');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : 'featured-user'});
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/featured-user/fans');
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
        request = app.get('/users/featured-user/fans');
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
    beforeEach('create featured', function (done) {
      var request;
      request = app.post('/users/user/featured');
      request.set('auth-token', auth.token(user));
      request.send({'featured' : 'featured-user'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/featured/featured-user');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/featured/featured-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/featured/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/users/user/featured/featured-user');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('featured').with.property('slug').be.equal('featured-user');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    beforeEach('createfeatured', function (done) {
      var request;
      request = app.post('/users/user/featured');
      request.set('auth-token', auth.token(user));
      request.send({'featured' : 'featured-user'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user/featured/featured-user');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user/featured/featured-user');
        request.set('auth-token', auth.token(otherUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/invalid/featured/featured-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user/featured/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should remove', function (done) {
        var request;
        request = app.del('/users/user/featured/featured-user');
        request.set('auth-token', auth.token(user));
        request.expect(204);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/user/featured/featured-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });
  });
});