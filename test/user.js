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

describe('user', function () {
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

  describe('create', function () {
    describe('without password', function () {
      before(User.remove.bind(User));

      it('should create', function (done) {
        var request;
        request = app.post('/users');
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('password').be.equal('required');
        });
        request.end(done);
      });
    });

    describe('with password', function () {
      before(User.remove.bind(User));

      it('should create', function (done) {
        var request;
        request = app.post('/users');
        request.send({'password' : '1234'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('_id');
          response.body.should.have.property('country').be.equal('Brazil');
          response.body.should.have.property('entries');
          response.body.entries[0].should.have.property('name').be.equal('brasileirão');
        });
        request.end(done);
      });
    });

    describe('with deactivated account', function () {
      var user;

      before(User.remove.bind(User));

      nock('https://graph.facebook.com').get('/me?access_token=1234').times(1).reply(200, {id : '1234'});

      before(function (done) {
        user = new User();
        user.password = '1234';
        user.country = 'Brazil';
        user.active = false;
        user.username = 'facebook user';
        user.facebookId = '1234';
        user.save(done);
      });

      it('should create', function (done) {
        var request;
        request = app.post('/users');
        request.set('facebook-token', '1234');
        request.send({'password' : '1234'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('_id');
          response.body.should.have.property('username').be.equal('facebook user');
          response.body.should.have.property('country').be.equal('Brazil');
          response.body.should.have.property('entries');
          response.body.entries[0].should.have.property('name').be.equal('brasileirão');
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    before(User.remove.bind(User));

    before(function (done) {
      var user;
      user = new User();
      user.password = '1234';
      user.country = 'Brazil';
      user.email = 'test1@test.com';
      user.save(done);
    });

    before(function (done) {
      var user;
      user = new User();
      user.password = '1234';
      user.country = 'Brazil';
      user.facebookId = '1234';
      user.save(done);
    });

    before(function (done) {
      var user;
      user = new User();
      user.password = '1234';
      user.country = 'Brazil';
      user.username = 'test';
      user.email = 'test2@test.com';
      user.save(done);
    });

    before(function (done) {
      var user;
      user = new User();
      user.password = '1234';
      user.country = 'Brazil';
      user.name = 'test';
      user.email = 'test3@test.com';
      user.save(done);
    });

    before(function (done) {
      var user;
      user = new User();
      user.password = '1234';
      user.country = 'Brazil';
      user.featured = true;
      user.email = 'test4@test.com';
      user.save(done);
    });

    describe('filter by facebookIds and emails', function () {
      it('should list two users', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.send({'facebookIds' : ['1234']});
        request.send({'emails' : ['test1@test.com']});
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(2);
        });
        request.end(done);
      });
    });

    describe('filter by emails', function () {
      it('should list one user', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.send({'emails' : ['test1@test.com']});
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('filter by facebookIds', function () {
      it('should list one user', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.send({'facebookIds' : ['1234']});
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('filter by usernames', function () {
      it('should list one user', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.send({'usernames' : ['test']});
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('filter by name', function () {
      it('should list one user', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.send({'name' : 'test'});
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('filter by featured', function () {
      it('should list one user', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.send({'featured' : true});
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('without filter', function () {
      it('should list five usera', function (done) {
        var request;
        request = app.get('/users');
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(5);
        });
        request.end(done);
      });
    });
  });

  describe('get', function () {
    var user;

    before(User.remove.bind(User));

    before(function (done) {
      user = new User();
      user.password = '1234';
      user.country = 'Brazil';
      user.save(done);
    });

    describe('without id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/1234');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid id', function () {
      it('should get', function (done) {
        var request;
        request = app.get('/users/' + user._id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('_id');
          response.body.should.have.property('verified').be.equal(false);
          response.body.should.have.property('country').be.equal('Brazil');
          response.body.should.have.property('entries');
          response.body.entries[0].should.have.property('name').be.equal('brasileirão');
        });
        request.end(done);
      });
    });
  });

  describe('update', function () {
    describe('facebook user', function () {
      describe('with other user token', function () {
        var user, otherUser;

        before(User.remove.bind(User));

        nock('https://graph.facebook.com').get('/me?access_token=1234').times(1).reply(200, {id : '1234'});

        before(function (done) {
          user = new User();
          user.password = '1234';
          user.country = 'Brazil';
          user.facebookId = '1234';
          user.funds = 10;
          user.save(done);
        });

        before(function (done) {
          otherUser = new User();
          otherUser.password = '1234';
          otherUser.country = 'Brazil';
          user.facebookId = '12345';
          otherUser.save(done);
        });

        it('raise error', function (done) {
          var request;
          request = app.put('/users/' + user._id);
          request.set('facebook-token', '12345');
          request.set('auth-token', auth.token(otherUser));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with valid token', function () {
        var user;

        before(User.remove.bind(User));

        nock('https://graph.facebook.com').get('/me?access_token=1234').times(1).reply(200, {id : '1234'});

        before(function (done) {
          user = new User();
          user.password = '1234';
          user.country = 'Brazil';
          user.save(done);
        });

        it('should update', function (done) {
          var request;
          request = app.put('/users/' + user._id);
          request.set('facebook-token', '1234');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.end(done);
        });
      });
    });

    describe('registered user', function () {
      describe('with other user token', function () {
        var user, otherUser;

        before(User.remove.bind(User));

        before(function (done) {
          user = new User();
          user.password = '1234';
          user.country = 'Brazil';
          user.funds = 10;
          user.save(done);
        });

        before(function (done) {
          otherUser = new User();
          otherUser.password = '1234';
          otherUser.country = 'Brazil';
          otherUser.save(done);
        });

        it('raise error', function (done) {
          var request;
          request = app.put('/users/' + user._id);
          request.set('auth-token', auth.token(otherUser));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with valid token', function () {
        var user;

        before(User.remove.bind(User));

        before(function (done) {
          user = new User();
          user.password = '1234';
          user.country = 'Brazil';
          user.save(done);
        });

        it('should update', function (done) {
          var request;
          request = app.put('/users/' + user._id);
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.end(done);
        });
      });
    });
  });

  describe('delete', function () {
    describe('with other user token', function () {
      var user, otherUser;

      before(User.remove.bind(User));

      before(function (done) {
        user = new User();
        user.password = '1234';
        user.country = 'Brazil';
        user.save(done);
      });

      before(function (done) {
        otherUser = new User();
        otherUser.password = '1234';
        otherUser.country = 'Brazil';
        otherUser.save(done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.delete('/users/' + user._id);
        request.set('auth-token', auth.token(otherUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with valid token', function () {
      var user;

      before(User.remove.bind(User));

      before(function (done) {
        user = new User();
        user.password = '1234';
        user.country = 'Brazil';
        user.save(done);
      });

      it('should deactivate', function (done) {
        var request;
        request = app.delete('/users/' + user._id);
        request.set('auth-token', auth.token(user));
        request.expect(204);
        request.end(done);
      });

      after(function (done) {
        var request;
        request = app.get('/users/' + user._id);
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });
  });

  describe('recharge', function () {
    describe('with other user token', function () {
      var user, otherUser;

      before(User.remove.bind(User));

      before(function (done) {
        user = new User();
        user.password = '1234';
        user.country = 'Brazil';
        user.funds = 10;
        user.save(done);
      });

      before(function (done) {
        otherUser = new User();
        otherUser.password = '1234';
        otherUser.country = 'Brazil';
        otherUser.save(done);
      });

      it('raise error', function (done) {
        var request;
        request = app.post('/users/' + user._id + '/recharge');
        request.set('auth-token', auth.token(otherUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with valid token', function () {
      var user;

      before(User.remove.bind(User));

      before(function (done) {
        user = new User();
        user.password = '1234';
        user.country = 'Brazil';
        user.funds = 10;
        user.save(done);
      });

      it('should recharge', function (done) {
        var request;
        request = app.post('/users/' + user._id + '/recharge');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('funds').be.equal(100);
        });
        request.end(done);
      });

      after(function (done) {
        var request;
        request = app.get('/users/' + user._id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('funds').be.equal(100);
        });
        request.end(done);
      });
    });
  });

  describe('auth', function () {
    describe('facebook user', function () {
      before(User.remove.bind(User));

      nock('https://graph.facebook.com').get('/me?access_token=1234').times(1).reply(200, {id : '1234'});

      before(function (done) {
        var user;
        user = new User();
        user.password = '1234';
        user.country = 'Brazil';
        user.facebookId = '1234';
        user.save(done);
      });

      it('should auth', function (done) {
        var request;
        request = app.get('/users/me/auth');
        request.set('facebook-token', '1234');
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('token');
          response.body.should.have.property('_id');
        });
        request.end(done);
      });
    });

    describe('registered user', function () {
      before(User.remove.bind(User));

      before(function (done) {
        var user;
        user = new User();
        user.email = 'test@test.com';
        user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
        user.country = 'Brazil';
        user.save(done);
      });

      it('should auth', function (done) {
        var request;
        request = app.get('/users/me/auth');
        request.send({'email' : 'test@test.com'});
        request.send({'password' : '1234'});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('token');
          response.body.should.have.property('_id');
        });
        request.end(done);
      });
    });

    describe('anonymous user', function () {
      before(User.remove.bind(User));

      before(function (done) {
        var user;
        user = new User();
        user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
        user.country = 'Brazil';
        user.save(done);
      });

      it('should auth', function (done) {
        var request;
        request = app.get('/users/me/auth');
        request.send({'password' : '1234'});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('token');
          response.body.should.have.property('_id');
        });
        request.end(done);
      });
    });
  });

  describe('forget password', function () {

    describe('without valid email', function () {
      before(User.remove.bind(User));

      it('should raise error work', function (done) {
        var request;
        request = app.get('/users/me/forgot-password');
        request.send({'email' : 'test@test.com'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid email', function () {
      before(User.remove.bind(User));

      nock('https://mandrillapp.com').post('/api/1.0/messages/send-template.json').times(1).reply(200, {});

      before(function (done) {
        var user;
        user = new User();
        user.email = 'test@test.com';
        user.password = '1234';
        user.country = 'Brazil';
        user.save(done);
      });

      it('should work', function (done) {
        var request;
        request = app.get('/users/me/forgot-password');
        request.send({'email' : 'test@test.com'});
        request.expect(200);
        request.end(done);
      });
    });
  });
});
