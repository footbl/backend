/*globals describe, before, beforeEach, afterEach, it, after*/
var supertest, app, auth,
User, Championship, Entry,
user, championship;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Entry = require('../../models/entry');

describe('user controller', function () {
  'use strict';

  before(Championship.remove.bind(Championship));

  before(function (done) {
    championship = new Championship({
      'name'    : 'brasileirão',
      'slug'    : 'brasileirao-Brazil-2014',
      'type'    : 'national league',
      'country' : 'Brazil',
      'edition' : 2014
    });
    championship.save(done);
  });

  before(function (done) {
    new Championship({
      'name'    : 'premier league',
      'slug'    : 'premier-league-United-Kingdom-2014',
      'type'    : 'national league',
      'country' : 'United Kingdom',
      'edition' : 2014
    }).save(done);
  });

  beforeEach(User.remove.bind(User));

  beforeEach(Entry.remove.bind(Entry));

  beforeEach(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user', 'featured' : true, 'facebookId' : '112', 'email' : 'admin@user.com'});
    user.save(done);
  });

  describe('create', function () {
    describe('without password', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users');
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('password').be.equal('required');
        });
        request.end(done);
      });
    });

    describe('with registered username', function () {
      beforeEach(function (done) {
        var request;
        request = app.post('/users');
        request.send({'password' : '1234'});
        request.send({'username' : 'test'});
        request.end(done);
      });

      it('should raise error with repeated username', function (done) {
        var request;
        request = app.post('/users');
        request.send({'password' : '1234'});
        request.send({'username' : 'test'});
        request.expect(409);
        request.end(done);
      });
    });

    describe('with password', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users');
        request.send({'password' : '1234'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('slug');
          response.body.should.have.property('verified').be.equal(false);
          response.body.should.have.property('featured').be.equal(false);
        });
        request.end(done);
      });
    });

    describe('with email', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users');
        request.send({'email' : 'teste@teste.com'});
        request.send({'password' : '1234'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('slug');
          response.body.should.have.property('email');
          response.body.should.have.property('verified').be.equal(false);
          response.body.should.have.property('featured').be.equal(false);
        });
        request.end(done);
      });

      describe('with registered email', function () {
        beforeEach(function (done) {
          var request;
          request = app.post('/users');
          request.send({'password' : '1234'});
          request.send({'email' : 'test@test.com'});
          request.end(done);
        });

        it('should raise error with repeated email', function (done) {
          var request;
          request = app.post('/users');
          request.send({'password' : '1234'});
          request.send({'email' : 'test@test.com'});
          request.expect(409);
          request.end(done);
        });
      });
    });

    describe('with facebookId', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users');
        request.set('facebook-token', '1234');
        request.send({'password' : '1234'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('slug');
          response.body.should.have.property('verified').be.equal(false);
          response.body.should.have.property('featured').be.equal(false);
        });
        request.end(done);
      });

      describe('with registered facebookId', function () {
        beforeEach(function (done) {
          var request;
          request = app.post('/users');
          request.set('facebook-token', '1234');
          request.send({'password' : '1234'});
          request.end(done);
        });

        it('should raise error with repeated facebookId', function (done) {
          var request;
          request = app.post('/users');
          request.set('facebook-token', '1234');
          request.send({'password' : '1234'});
          request.end(done);
        });
      });
    });
  });

  describe('default entry', function () {
    it('should create', function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'username' : 'entry-user'});
      request.expect(201);
      request.end(done);
    });

    after(function (done) {
      var request;
      request = app.get('/users/entry-user/entries/brasileirao-Brazil-2014');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('user').with.property('slug').be.equal('entry-user');
        response.body.should.have.property('championship').with.property('slug').be.equal('brasileirao-Brazil-2014');
      });
      request.end(done);
    });
  });

  describe('list', function () {
    beforeEach(function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'email' : 'user1@user.com'});
      request.send({'username' : 'user1'});
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.post('/users');
      request.set('facebook-token', '1234');
      request.send({'password' : '1234'});
      request.send({'username' : 'user2'});
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'username' : 'user3'});
      request.send({'name' : 'rafael'});
      request.end(done);
    });

    it('should filter by featured', function (done) {
      var request;
      request = app.get('/users');
      request.send({'featured' : true});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body[0].should.have.property('slug').be.equal('user');
      });
      request.end(done);
    });

    it('should filter by facebookId', function (done) {
      var request;
      request = app.get('/users');
      request.send({'facebookIds' : ['111']});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body[0].should.have.property('slug').be.equal('user2');
      });
      request.end(done);
    });

    it('should filter by email', function (done) {
      var request;
      request = app.get('/users');
      request.send({'emails' : ['user1@user.com']});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body[0].should.have.property('slug').be.equal('user1');
      });
      request.end(done);
    });

    it('should filter by username', function (done) {
      var request;
      request = app.get('/users');
      request.send({'usernames' : ['user1']});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body[0].should.have.property('slug').be.equal('user1');
      });
      request.end(done);
    });

    it('should filter by name', function (done) {
      var request;
      request = app.get('/users');
      request.send({'name' : 'rafa'});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body[0].should.have.property('slug').be.equal('user3');
      });
      request.end(done);
    });

    it('should filter by facebookId and email', function (done) {
      var request;
      request = app.get('/users');
      request.send({'facebookIds' : ['111']});
      request.send({'emails' : ['user1@user.com']});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(2);
      });
      request.end(done);
    });

    it('should filter local ranking', function (done) {
      var request;
      request = app.get('/users');
      request.set('auth-token', auth.token(user));
      request.send({'localRanking' : true});
      request.expect(200);
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request;
      request = app.get('/users');
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
    beforeEach('create a user', function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'email' : 'user1@user.com'});
      request.send({'username' : 'user1'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user1');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show my account searching by me', function (done) {
        var request;
        request = app.get('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('verified').be.equal(false);
        });
        request.end(done);
      });

      it('should show', function (done) {
        var request;
        request = app.get('/users/user1');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('slug').be.equal('user1');
          response.body.should.have.property('verified').be.equal(false);
          response.body.should.have.property('featured').be.equal(false);
        });
        request.end(done);
      });
    });
  });

  describe('update', function () {
    beforeEach('create a user', function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'email' : 'user1@user.com'});
      request.send({'username' : 'user1'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/me');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/user1');
        request.set('auth-token', auth.token(user));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should update', function (done) {
        var request;
        request = app.put('/users/me');
        request.set('auth-token', auth.token(user));
        request.send({'password' : '1234'});
        request.send({'email' : 'user2@user.com'});
        request.send({'username' : 'user2'});
        request.send({'apnsToken' : 'user2'});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('slug').be.equal('user2');
          response.body.should.have.property('username').be.equal('user2');
          response.body.should.have.property('email').be.equal('user2@user.com');
          response.body.should.have.property('verified').be.equal(false);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('slug').be.equal('user2');
          response.body.should.have.property('username').be.equal('user2');
          response.body.should.have.property('email').be.equal('user2@user.com');
          response.body.should.have.property('verified').be.equal(false);
        });
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    beforeEach('create a user', function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'email' : 'user1@user.com'});
      request.send({'username' : 'user1'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/me');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/user1');
        request.set('auth-token', auth.token(user));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should remove', function (done) {
        var request;
        request = app.del('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(204);
        request.end(done);
      });
    });
  });

  describe('activate inactive account', function () {
    beforeEach(function (done) {
      var request;
      request = app.del('/users/me');
      request.set('auth-token', auth.token(user));
      request.expect(204);
      request.end(done);
    });

    it('should reactivate', function (done) {
      var request;
      request = app.post('/users');
      request.set('facebook-token', '1235');
      request.send({'password' : '1234'});
      request.expect(201);
      request.end(done);
    });
  });

  describe('login', function () {
    describe('anonymous user', function () {
      beforeEach(function (done) {
        var request;
        request = app.post('/users');
        request.send({'password' : '1234'});
        request.end(done);
      });

      describe('with invalid password', function () {
        it('should raise error', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.send({'password' : 'invalid'});
          request.expect(403);
          request.end(done);
        });
      });

      describe('with valid password', function () {
        it('should login', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.send({'password' : '1234'});
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('token');
          });
          request.end(done);
        });
      });
    });

    describe('facebook user', function () {
      beforeEach(function (done) {
        var request;
        request = app.post('/users');
        request.set('facebook-token', '1234');
        request.send({'password' : '1234'});
        request.end(done);
      });

      describe('with invalid facebook token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.set('facebook-token', 'invalid');
          request.expect(403);
          request.end(done);
        });
      });

      describe('with valid facebook token', function () {
        it('should login', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.set('facebook-token', '1234');
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('token');
          });
          request.end(done);
        });
      });
    });

    describe('registred user', function () {
      beforeEach(function (done) {
        var request;
        request = app.post('/users');
        request.set('facebook-token', '1234');
        request.send({'password' : '1234'});
        request.send({'email' : 'user1@user.com'});
        request.send({'name' : 'user1'});
        request.send({'username' : 'user1'});
        request.send({'password' : '1234'});
        request.end(done);
      });

      describe('with invalid password', function () {
        it('should raise error', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.send({'email' : 'user1@user.com'});
          request.send({'password' : 'invalid'});
          request.expect(403);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.send({'email' : 'invalid'});
          request.send({'password' : '1234'});
          request.expect(403);
          request.end(done);
        });
      });

      describe('with invalid id and password', function () {
        it('should raise error', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.send({'email' : 'invalid'});
          request.send({'password' : 'invalid'});
          request.expect(403);
          request.end(done);
        });
      });

      describe('with valid id and password', function () {
        it('should login', function (done) {
          var request;
          request = app.get('/users/me/auth');
          request.send({'email' : 'user1@user.com'});
          request.send({'password' : '1234'});
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('token');
          });
          request.end(done);
        });
      });
    });
  });

  describe('recharge', function () {
    beforeEach('remove user funds', function (done) {
      User.update({'_id' : user._id}, {'$set' : {'funds' : 10}}, done);
    });

    beforeEach('create a user', function (done) {
      var request;
      request = app.post('/users');
      request.send({'password' : '1234'});
      request.send({'email' : 'user1@user.com'});
      request.send({'username' : 'user1'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user/recharge');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/user1/recharge');
        request.set('auth-token', auth.token(user));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/invalid/recharge');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should recharge', function (done) {
        var request;
        request = app.post('/users/user/recharge');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('funds').be.equal(100);
          response.body.should.have.property('stake').be.equal(0);
        });
        request.end(done);
      });
    });
  });

  describe('password recovery', function () {
    describe('with invalid email', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/users/me/forgot-password');
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid email', function () {
      it('should send password recovery', function (done) {
        var request;
        request = app.get('/users/me/forgot-password');
        request.send({'email' : 'admin@user.com'});
        request.expect(200);
        request.end(done);
      });
    });
  });
});