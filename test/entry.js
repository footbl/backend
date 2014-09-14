/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Entry, Championship,
user, otherUser;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Entry = require('../models/entry');
Championship = require('../models/championship');

describe('entry controller', function () {
  'use strict';

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
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.post('/championships');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.send({'name' : 'brasileirão'});
    request.send({'type' : 'national league'});
    request.send({'country' : 'brasil'});
    request.send({'edition' : 2014});
    request.end(done);
  });

  describe('create', function () {
    before(Entry.remove.bind(Entry));

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/invalid/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error without championship', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('championship').be.equal('required');
      });
      request.end(done);
    });

    it('should raise error with other user token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(otherUser));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.expect(405);
      request.end(done);
    });

    it('should create with user', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
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

    it('should create by me slug', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/me/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(otherUser));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.expect(201);
      request.expect(function (response) {
        response.body.should.have.property('user');
        response.body.should.have.property('championship');
        response.body.should.have.property('slug');
      });
      request.end(done);
    });

    describe('with entry created', function () {
      before(Entry.remove.bind(Entry));

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/users/me/entries');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.end(done);
      });

      it('should raise error with repeated user', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/users/me/entries');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'championship' : 'brasileirao-brasil-2014'});
        request.expect(409);
        request.end(done);
      });
    });

  });

  describe('list', function () {
    before(Entry.remove.bind(Entry));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/me/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/invalid/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should list', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body.every(function (championship) {
          championship.should.have.property('user');
          championship.should.have.property('championship');
          championship.should.have.property('slug');
        });
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
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

  describe('details', function () {
    before(Entry.remove.bind(Entry));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/me/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/invalid/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/entries/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should show', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('championship');
        response.body.should.have.property('user');
        response.body.should.have.property('slug');
      });
      request.end(done);
    });
  });

  describe('delete', function () {
    before(Entry.remove.bind(Entry));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/me/entries');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'championship' : 'brasileirao-brasil-2014'});
      request.end(done);
    });

    it('should raise without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/user/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise with other user token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/user/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(otherUser));
      request.expect(405);
      request.end(done);
    });

    it('should raise with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/invalid/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/user/entries/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should remove', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/user/entries/brasileirao-brasil-2014');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(204);
      request.end(done);
    });
  });
});