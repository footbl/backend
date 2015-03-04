/*globals describe, before, after, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
    User, Group, Message;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));
User = require('../models/user');
Group = require('../models/group');
Message = require('../models/message');

describe('message', function () {
  var user, group;

  before(User.remove.bind(User));

  before(function (done) {
    user = new User();
    user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    user.country = 'Brazil';
    user.funds = 110;
    user.save(done);
  });

  before(function (done) {
    group = new Group({
      'name'    : 'test',
      'code'    : '6wzji',
      'owner'   : user,
      'members' : [{'user' : user}]
    });
    group.save(done);
  });

  describe('create', function () {
    it('should create', function (done) {
      var request;
      request = app.post('/groups/' + group._id + '/messages');
      request.set('auth-token', auth.token(user));
      request.send({'message' : 'test'});
      request.expect(201);
      request.expect(function (response) {
        response.body.should.have.property('message').be.equal('test');
      });
      request.end(done);
    });
  });

  describe('list', function () {
    before(Message.remove.bind(Message));

    before(function (done) {
      var message;
      message = new Message({
        'group'   : group,
        'user'    : user,
        'message' : 'test'
      });
      message.save(done);
    });

    before(function (done) {
      var message;
      message = new Message({
        'group'   : group,
        'user'    : user,
        'message' : 'test',
        'seenBy'  : [user]
      });
      message.save(done);
    });

    describe('filter unread messages', function () {
      it('should not list seen messages', function (done) {
        var request;
        request = app.get('/groups/' + group._id + '/messages');
        request.set('auth-token', auth.token(user));
        request.send({'unreadMessages' : true});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });
    });

    describe('without filter', function () {
      it('should list one message', function (done) {
        var request;
        request = app.get('/groups/' + group._id + '/messages');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(2);
        });
        request.end(done);
      });
    });
  });
});