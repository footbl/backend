/*globals describe, before, beforeEach, afterEach, it, after*/
var supertest, app, auth,
User, Prize,
user, otherUser;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Prize = require('../../models/prize');

describe('prize controller', function () {
  'use strict';

  before(User.remove.bind(User));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user', 'facebookId' : '111'});
    user.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  beforeEach('remove prizes', Prize.remove.bind(Prize));

  beforeEach('reset user funds', function (done) {
    User.update({'_id' : user._id}, {'$set' : {
      'funds' : 100,
      'stake' : 0
    }}, done);
  });

  describe('create on login', function () {
    describe('on first login', function () {
      describe('with 100 funds', function () {
        it('not should give daily bonus', function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.get('/users/me/auth');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('facebook-token', '1234');
          request.expect(200);
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/users/me/prizes');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(0);
          });
          request.end(done);
        });
      });

      describe('with less than 100 funds', function () {
        beforeEach('remove user funds', function (done) {
          User.update({'_id' : user._id}, {'$set' : {
            'funds' : 10,
            'stake' : 0
          }}, done);
        });

        it('should give daily bonus', function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.get('/users/me/auth');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('facebook-token', '1234');
          request.expect(200);
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/users/me/prizes');
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

    describe('on second login', function () {
      beforeEach(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = app.get('/users/me/auth');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('facebook-token', '1234');
        request.expect(200);
        request.end(done);
      });

      it('should not should give daily bonus', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = app.get('/users/me/auth');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('facebook-token', '1234');
        request.expect(200);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me/prizes');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(0);
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/prizes');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/prizes');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one prize created', function () {
      beforeEach('remove user funds', function (done) {
        User.update({'_id' : user._id}, {'$set' : {
          'funds' : 10,
          'stake' : 0
        }}, done);
      });

      beforeEach(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = app.get('/users/me/auth');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('facebook-token', '1234');
        request.expect(200);
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/user/prizes');
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
        request = app.get('/users/user/prizes');
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
    var id;

    beforeEach('remove user funds', function (done) {
      User.update({'_id' : user._id}, {'$set' : {
        'funds' : 10,
        'stake' : 0
      }}, done);
    });

    beforeEach(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = app.get('/users/me/auth');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('facebook-token', '1234');
      request.expect(200);
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/users/user/prizes');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/prizes/1234');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/prizes/1234');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/prizes/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/users/me/prizes/' + id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('slug');
          response.body.should.have.property('value');
          response.body.should.have.property('type');
        });
        request.end(done);
      });
    });
  });

  describe('mark as read', function () {
    var id;

    beforeEach('remove user funds', function (done) {
      User.update({'_id' : user._id}, {'$set' : {
        'funds' : 10,
        'stake' : 0
      }}, done);
    });

    beforeEach(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = app.get('/users/me/auth');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('facebook-token', '1234');
      request.expect(200);
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/users/user/prizes');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/user/prizes/1234/mark-as-read');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/invalid/prizes/1234/mark-as-read');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/user/prizes/invalid/mark-as-read');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should mark as read', function (done) {
        var request;
        request = app.put('/users/me/prizes/' + id + '/mark-as-read');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('slug');
          response.body.should.have.property('value');
          response.body.should.have.property('type');
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('funds').be.equal(11);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me/prizes');
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
  });
});