/*globals describe, before, it, after*/
require('should');
var supertest, app, auth, nock,
User, Group, Message,
groupOwner, slug;

supertest = require('supertest');
app = require('../index.js');
auth = require('auth');
nock = require('nock');
User = require('../models/user');
Group = require('../models/group');
Message = require('../models/message');

nock('https://api.zeropush.com').get('/verify_credentials?auth_token=undefined').times(Infinity).reply(200, {'message' : 'authenticated'});
nock('https://api.zeropush.com').post('/notify').times(Infinity).reply(200, {'message' : 'authenticated'});

describe('message controller', function () {
  'use strict';

  before(Group.remove.bind(Group));
  before(User.remove.bind(User));

  before(function (done) {
    groupOwner = new User({'password' : '1234', 'slug' : 'group-owner'});
    groupOwner.save(done);
  });

  before(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.post('/groups');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(groupOwner));
    request.send({'name' : 'college buddies'});
    request.send({'freeToEdit' : false});
    request.expect(function (response) {
      slug = response.body.slug;
    });
    request.end(done);
  });

  describe('create', function () {
    before(Message.remove.bind(Message));

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.send({'message' : 'fala galera'});
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid group id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/invalid/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'message' : 'fala galera'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error without message', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('message').be.equal('required');
      });
      request.end(done);
    });

    it('should create', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'message' : 'fala galera'});
      request.expect(201);
      request.expect(function (response) {
        response.body.should.have.property('message');
        response.body.should.have.property('user');
      });
      request.end(done);
    });
  });

  describe('list', function () {
    before(Message.remove.bind(Message));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'message' : 'fala galera'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid group id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/invalid/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(404);
      request.end(done);
    });

    it('should list', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body.every(function (championship) {
          championship.should.have.property('user');
          championship.should.have.property('message');
        });
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
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
    var id;

    before(Message.remove.bind(Message));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'message' : 'fala galera'});
      request.expect(function (response) {
        id = response.body.slug;
      });
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid group id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/invalid/messages/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(404);
      request.end(done);
    });

    it('should show', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('user');
        response.body.should.have.property('message');
      });
      request.end(done);
    });
  });

  describe('mark as read', function () {
    var id;

    before(Message.remove.bind(Message));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'message' : 'fala galera'});
      request.expect(function (response) {
        id = response.body.slug;
      });
      request.end(done);
    });

    it('should mark as read', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/groups/' + slug + '/messages/' + id + '/mark-as-read');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(200);
      request.end(done);
    });

    after(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/messages');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'unreadMessages' : true});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(0);
      });
      request.end(done);
    });
  });
});