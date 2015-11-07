/*globals describe, before, it*/
'use strict';
require('should');
describe('prize', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var Prize = require('../models/prize');

  before(User.remove.bind(User));

  before(function (done) {
    var user = new User();
    user._id = '563decb2a6269cb39236de97';
    user.funds = 100;
    user.email = 'u0@footbl.co';
    user.username = 'u0';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de98';
    user.funds = 100;
    user.email = 'u1@footbl.co';
    user.username = 'u1';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('list', function () {
    before(Prize.remove.bind(Prize));

    before(function (done) {
      var prize = new Prize();
      prize._id = '563d72882cb3e53efe2827fc';
      prize.user = '563decb2a6269cb39236de97';
      prize.value = 10;
      prize.type = 'daily';
      prize.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/prizes').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      it('should list one prize', function (done) {
        app.get('/prizes').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1)
        }).end(done)
      });
    });
  });

  describe('get', function () {
    before(Prize.remove.bind(Prize));

    before(function (done) {
      var prize = new Prize();
      prize._id = '563d72882cb3e53efe2827fc';
      prize.user = '563decb2a6269cb39236de97';
      prize.value = 10;
      prize.type = 'daily';
      prize.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/prizes/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.get('/prizes/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.get('/prizes/invalid').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should return', function (done) {
            app.get('/prizes/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
              response.body.should.have.property('value').be.equal(10);
              response.body.should.have.property('type').be.equal('daily');
            }).end(done);
          });
        });
      });
    });
  });

  describe('mark as read', function () {
    before(Prize.remove.bind(Prize));

    before(function (done) {
      var prize = new Prize();
      prize._id = '563d72882cb3e53efe2827fc';
      prize.user = '563decb2a6269cb39236de97';
      prize.value = 10;
      prize.type = 'daily';
      prize.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/prizes/563d72882cb3e53efe2827fc/mark-as-read').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.put('/prizes/563d72882cb3e53efe2827fc/mark-as-read').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.put('/prizes/invalid/mark-as-read').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should mark as read', function (done) {
            app.put('/prizes/563d72882cb3e53efe2827fc/mark-as-read').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).end(done);
          });

          after(function (done) {
            app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
              response.body.should.have.property('funds').be.equal(110);
            }).end(done);
          });
        });
      });
    });
  });
});
