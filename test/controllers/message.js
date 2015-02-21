/*globals describe, before, beforeEach, afterEach, it*/
'use strict';

var supertest, app, auth,
User, Group, GroupMember, Message,
user, group;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Group = require('../../models/group');
GroupMember = require('../../models/group-member');
Message = require('../../models/message');

describe('message controller', function () {
  before(User.remove.bind(User));
  before(Group.remove.bind(Group));

  before(function (done) {
    user = new User({'password' : '1234', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    group = new Group({
      'name'       : 'group',
      'slug'       : new Date().getTime().toString(36).substring(3),
      'freeToEdit' : false,
      'owner'      : user._id
    });
    group.save(done);
  });

  before(function (done) {
    new GroupMember({
      'slug'         : user.slug,
      'group'        : group._id,
      'user'         : user._id,
      'initialFunds' : 100
    }).save(done);
  });

  beforeEach('remove messages', Message.remove.bind(Message));

  beforeEach('reset group info', function (done) {
    User.update({'_id' : group._id}, {'$set' : {'freeToEdit' : false}}, done);
  });

  describe('create', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/groups/' + group.slug + '/messages');
        request.send({'message' : 'fala galera'});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid group id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/groups/invalid/messages');
        request.set('auth-token', auth.token(user));
        request.send({'message' : 'fala galera'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('without message', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/groups/' + group.slug + '/messages');
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('message').be.equal('required');
        });
        request.end(done);
      });
    });

    describe('with valid credentials and message', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/groups/' + group.slug + '/messages');
        request.set('auth-token', auth.token(user));
        request.send({'message' : 'fala galera'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('message');
          response.body.should.have.property('user');
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid group id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/invalid/messages');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one message created', function () {
      beforeEach('create message', function (done) {
        var request;
        request = app.post('/groups/' + group.slug + '/messages');
        request.set('auth-token', auth.token(user));
        request.send({'message' : 'fala galera'});
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages');
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
        request = app.get('/groups/' + group.slug + '/messages');
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

    beforeEach('create message', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/messages');
      request.set('auth-token', auth.token(user));
      request.send({'message' : 'fala galera'});
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/groups/' + group.slug + '/messages');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages/' + id);
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid group id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/invalid/messages/1234');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages/' + id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('user').with.property('slug').be.equal('user');
          response.body.should.have.property('message');
        });
        request.end(done);
      });
    });
  });

  describe('mark as read', function () {
    var id;

    beforeEach('create message', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/messages');
      request.set('auth-token', auth.token(user));
      request.send({'message' : 'fala galera'});
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/groups/' + group.slug + '/messages');
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
        request = app.put('/groups/' + group.slug + '/messages/' + id + '/mark-as-read');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should mark as read', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/messages/' + id + '/mark-as-read');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages');
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

  describe('mark all as read', function () {
    beforeEach('create message', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/messages');
      request.set('auth-token', auth.token(user));
      request.send({'message' : 'fala galera 1'});
      request.end(done);
    });

    beforeEach('create message', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/messages');
      request.set('auth-token', auth.token(user));
      request.send({'message' : 'fala galera 2'});
      request.end(done);
    });

    beforeEach('create message', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/messages');
      request.set('auth-token', auth.token(user));
      request.send({'message' : 'fala galera 3'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/messages/all/mark-as-read');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should mark all as read', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/messages/all/mark-as-read');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/messages');
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