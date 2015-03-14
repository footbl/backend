/*globals describe, before, after, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
Season, User, Group;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));

Season = require('../models/season');
User = require('../models/user');
Group = require('../models/group');

nconf.defaults(require('../config'));

describe('group', function () {
  var user, invitedUser;

  before(Season.remove.bind(Season));
  before(User.remove.bind(User));

  before(function (done) {
    var season;
    season = new Season({
      'finishAt'  : new Date(),
      'createdAt' : new Date()
    });
    season.save(done);
  });

  before(function (done) {
    user = new User();
    user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    user.country = 'Brazil';
    user.save(done);
  });

  before(function (done) {
    invitedUser = new User();
    invitedUser.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    invitedUser.country = 'Brazil';
    invitedUser.save(done);
  });

  describe('create', function () {
    describe('without name', function () {
      before(Group.remove.bind(Group));

      it('should raise error', function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('name').be.equal('required');
        });
        request.end(done);
      });
    });

    describe('with name', function () {
      before(Group.remove.bind(Group));

      it('should create', function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'test'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('name').be.equal('test');
          response.body.should.have.property('code');
          response.body.should.have.property('members').be.instanceOf(Array);
          response.body.should.have.property('members').lengthOf(1);
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    before(Group.remove.bind(Group));

    before(function (done) {
      var group;
      group = new Group({
        'name'    : 'test',
        'code'    : '6wzji',
        'owner'   : user,
        'members' : [{'user' : user}]
      });
      group.save(done);
    });

    before(function (done) {
      var group;
      group = new Group({
        'name'     : 'test',
        'code'     : '7wzji',
        'owner'    : user,
        'featured' : true
      });
      group.save(done);
    });

    describe('filter by featured', function () {
      it('should list one group', function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'featured' : true});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('filter by code', function () {
      it('should list one group', function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'code' : '7wzji'});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('without filter', function () {
      it('should list one group', function (done) {
        var request;
        request = app.get('/groups');
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

  describe('get', function () {
    var group;

    before(Group.remove.bind(Group));

    before(function (done) {
      group = new Group({
        'name'    : 'test',
        'code'    : '6wzji',
        'owner'   : user,
        'members' : [{'user' : user}]
      });
      group.save(done);
    });

    describe('without id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/1234');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid id', function () {
      it('should get', function (done) {
        var request;
        request = app.get('/groups/' + group._id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('name').be.equal('test');
          response.body.should.have.property('code');
          response.body.should.have.property('members').be.instanceOf(Array);
          response.body.should.have.property('members').lengthOf(1);
        });
        request.end(done);
      });
    });
  });

  describe('update', function () {
    var group;

    before(Group.remove.bind(Group));

    before(function (done) {
      group = new Group({
        'name'    : 'test',
        'code'    : '6wzji',
        'owner'   : user,
        'members' : [{'user' : user}]
      });
      group.save(done);
    });

    it('should update', function (done) {
      var request;
      request = app.put('/groups/' + group._id);
      request.set('auth-token', auth.token(user));
      request.send({'name' : 'test'});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('name').be.equal('test');
        response.body.should.have.property('code');
        response.body.should.have.property('members').be.instanceOf(Array);
        response.body.should.have.property('members').lengthOf(1);
      });
      request.end(done);
    });

    after(function (done) {
      var request;
      request = app.get('/groups/' + group._id);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('name').be.equal('test');
        response.body.should.have.property('code');
        response.body.should.have.property('members').be.instanceOf(Array);
        response.body.should.have.property('members').lengthOf(1);
      });
      request.end(done);
    });
  });

  describe('delete', function () {
    var group;

    before(Group.remove.bind(Group));

    before(function (done) {
      group = new Group({
        'name'    : 'test',
        'code'    : '6wzji',
        'owner'   : user,
        'members' : [{'user' : user}]
      });
      group.save(done);
    });

    it('should remove', function (done) {
      var request;
      request = app.del('/groups/' + group._id);
      request.set('auth-token', auth.token(user));
      request.expect(204);
      request.end(done);
    });

    after(function (done) {
      var request;
      request = app.get('/groups/' + group._id);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });
  });

  describe('invite', function () {
    describe('registered user', function () {
      var group;

      before(Group.remove.bind(Group));

      before(function (done) {
        group = new Group({
          'name'    : 'test',
          'code'    : '6wzji',
          'members' : [{'user' : user, 'owner' : true}]
        });
        group.save(done);
      });

      it('should invite', function (done) {
        var request;
        request = app.post('/groups/' + group._id + '/invite');
        request.set('auth-token', auth.token(user));
        request.send({'user' : invitedUser._id});
        request.expect(200);
        request.end(done);
      });
    });

    describe('facebook user', function () {
      var group;

      before(Group.remove.bind(Group));

      before(function (done) {
        group = new Group({
          'name'    : 'test',
          'code'    : '6wzji',
          'members' : [{'user' : user, 'owner' : true}]
        });
        group.save(done);
      });

      nock('https://graph.facebook.com').get('/me?access_token=1234').times(1).reply(200, {id : '1234'});

      it('should invite', function (done) {
        var request;
        request = app.post('/groups/' + group._id + '/invite');
        request.set('auth-token', auth.token(user));
        request.send({'user' : '1234'});
        request.expect(200);
        request.end(done);
      });

      after(function (done) {
        var request;
        request = app.put('/users/' + invitedUser._id);
        request.set('facebook-token', '1234');
        request.set('auth-token', auth.token(invitedUser));
        request.expect(200);
        request.end(done);
      });
    });
  });

  describe('leave', function () {
    var group;

    before(Group.remove.bind(Group));

    before(function (done) {
      group = new Group({
        'name'    : 'test',
        'code'    : '6wzji',
        'members' : [{'user' : user, 'owner' : true}, {'user' : invitedUser}]
      });
      group.save(done);
    });

    it('should invite', function (done) {
      var request;
      request = app.del('/groups/' + group._id + '/leave');
      request.set('auth-token', auth.token(invitedUser));
      request.expect(200);
      request.end(done);
    });
  });
});
