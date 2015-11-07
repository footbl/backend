/*globals describe, before, it*/
'use strict';
require('should');
describe('message', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var Message = require('../models/message');

  before(User.remove.bind(User));

  before(function (done) {
    var user = new User();
    user._id = '563decb2a6269cb39236de97';
    user.email = 'u0@footbl.co';
    user.username = 'u0';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de98';
    user.email = 'u1@footbl.co';
    user.username = 'u1';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de99';
    user.email = 'u2@footbl.co';
    user.username = 'u2';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('create', function () {
    beforeEach(Message.remove.bind(Message));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.post('/messages').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      it('should create', function (done) {
        app.post('/messages').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
          'message'   : 'teste',
          'room'      : '563df3d01727b04df7eb4387',
          'visibleTo' : ['563decb7a6269cb39236de98']
        }).expect(201).end(done)
      });
    });
  });

  describe('list', function () {
    before(Message.remove.bind(Message));

    before(function (done) {
      var message = new Message();
      message._id = '563d72882cb3e53efe2827fc';
      message.user = '563decb2a6269cb39236de97';
      message.room = '563df3d01727b04df7eb4387';
      message.visibleTo = ['563decb2a6269cb39236de97', '563decb2a6269cb39236de98'];
      message.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/messages').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with visible user', function () {
        it('should list one message', function (done) {
          app.get('/messages').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(1)
          }).end(done)
        });
      });

      describe('without visible user', function () {
        it('should list zero messages', function (done) {
          app.get('/messages').set('authorization', 'Basic ' + new Buffer('u2@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(0)
          }).end(done)
        });
      });
    });
  });

  describe('mark all as read', function () {
    before(Message.remove.bind(Message));

    before(function (done) {
      var message = new Message();
      message._id = '563d72882cb3e53efe2827fc';
      message.user = '563decb2a6269cb39236de97';
      message.room = '563df3d01727b04df7eb4387';
      message.visibleTo = ['563decb2a6269cb39236de97', '563decb2a6269cb39236de98'];
      message.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/messages/all/mark-as-read').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/messages/all/mark-as-read').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).end(done)
      });
    });
  });
});
