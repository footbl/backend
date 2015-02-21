/*globals describe, before, beforeEach, afterEach, it*/
'use strict';

var supertest, app, auth,
User, CreditRequest,
user, otherUser, anotherUser;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
CreditRequest = require('../../models/credit-request');

describe('credit request controller', function () {
  before(User.remove.bind(User));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  before(function (done) {
    anotherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'anoother-user'});
    anotherUser.save(done);
  });

  beforeEach('remove credit requests', CreditRequest.remove.bind(CreditRequest));

  beforeEach('reset user funds', function (done) {
    User.update({'_id' : user._id}, {'$set' : {
      'funds' : 100,
      'stake' : 0
    }}, done);
  });

  beforeEach('reset other user funds', function (done) {
    User.update({'_id' : otherUser._id}, {'$set' : {
      'funds' : 100,
      'stake' : 0
    }}, done);
  });

  describe('create', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/users/credit-requested-user/credit-requests');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with valid user', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users/other-user/credit-requests');
        request.set('auth-token', auth.token(user));
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('creditedUser');
          response.body.should.have.property('chargedUser');
        });
        request.end(done);
      });
    });

    describe('without valid user', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/users/invalid/credit-requests');
        request.set('auth-token', auth.token(user));
        request.expect(201);
        request.end(done);
      });
    });
  });

  describe('list', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/other-user/credit-requests');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/credit-requests');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one request created', function () {
      beforeEach('create request', function (done) {
        var request;
        request = app.post('/users/other-user/credit-requests');
        request.set('auth-token', auth.token(user));
        request.end(done);
      });

      it('should list my credit requests', function (done) {
        var request;
        request = app.get('/users/me/credit-requests');
        request.set('auth-token', auth.token(otherUser));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/other-user/credit-requests');
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
        request = app.get('/users/other-user/credit-requests');
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

  describe('list request credits', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/user/requested-credits');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/requested-credits');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one request created', function () {
      beforeEach('create request', function (done) {
        var request;
        request = app.post('/users/other-user/credit-requests');
        request.set('auth-token', auth.token(user));
        request.end(done);
      });

      it('should list my requested credits', function (done) {
        var request;
        request = app.get('/users/me/requested-credits');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/user/requested-credits');
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
        request = app.get('/users/user/requested-credits');
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

    beforeEach('create request', function (done) {
      var request;
      request = app.post('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/other-user/credit-requests/' + id);
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/invalid/credit-requests/' + id);
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/users/other-user/credit-requests/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/users/other-user/credit-requests/' + id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('creditedUser');
          response.body.should.have.property('chargedUser');
        });
        request.end(done);
      });
    });
  });

  describe('approve', function () {
    var id;

    beforeEach('create request', function (done) {
      var request;
      request = app.post('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    beforeEach('create another request', function (done) {
      var request;
      request = app.post('/users/another-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('with sufficient funds', function () {
      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.expect(401);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(user));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with invalid user id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/invalid/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/invalid/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(404);
          request.end(done);
        });
      });

      describe('requester with less than 100 of funds + stake', function () {
        beforeEach('remove user funds', function (done) {
          User.update({'_id' : user._id}, {'$set' : {
            'funds' : 10,
            'stake' : 0
          }}, done);
        });

        it('should approve', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('payed');
            response.body.should.have.property('creditedUser');
            response.body.should.have.property('chargedUser');
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/users/user');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('funds').be.equal(100);
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/users/other-user');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('funds').be.equal(10);
          });
          request.end(done);
        });
      });

      describe('requester with more than 100 of funds + stake', function () {
        beforeEach('remove user funds', function (done) {
          User.update({'_id' : user._id}, {'$set' : {
            'funds' : 110,
            'stake' : 0
          }}, done);
        });

        it('should approve', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('payed');
            response.body.should.have.property('creditedUser');
            response.body.should.have.property('chargedUser');
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/users/user');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('funds').be.equal(110);
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/users/other-user');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('funds').be.equal(100);
          });
          request.end(done);
        });
      });
    });

    describe('without sufficient funds', function () {
      beforeEach('remove user funds', function (done) {
        User.update({'_id' : otherUser._id}, {'$set' : {
          'funds' : 10,
          'stake' : 0
        }}, done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.expect(401);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(user));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with invalid user id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/invalid/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/invalid/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(404);
          request.end(done);
        });
      });

      describe('requester with less than 100 of funds + stake', function () {
        beforeEach('remove user funds', function (done) {
          User.update({'_id' : user._id}, {'$set' : {
            'funds' : 10,
            'stake' : 0
          }}, done);
        });

        it('should raise error', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(400);
          request.expect(function (response) {
            response.body.should.have.property('value').be.equal('insufficient funds');
          });
          request.end(done);
        });
      });

      describe('requester with more than 100 of funds + stake', function () {
        it('should approve', function (done) {
          var request;
          request = app.put('/users/other-user/credit-requests/' + id + '/approve');
          request.set('auth-token', auth.token(otherUser));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('payed');
            response.body.should.have.property('creditedUser');
            response.body.should.have.property('chargedUser');
          });
          request.end(done);
        });
      });
    });
  });

  describe('mark as read', function () {
    var id;

    beforeEach('create request', function (done) {
      var request;
      request = app.post('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/other-user/credit-requests/' + id + '/mark-as-read');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/invalid/credit-requests/' + id + '/mark-as-read');
        request.set('auth-token', auth.token(otherUser));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/users/other-user/credit-requests/invalid/mark-as-read');
        request.set('auth-token', auth.token(otherUser));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should mark as read', function (done) {
        var request;
        request = app.put('/users/other-user/credit-requests/' + id + '/mark-as-read');
        request.set('auth-token', auth.token(otherUser));
        request.expect(200);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/other-user/credit-requests');
        request.set('auth-token', auth.token(otherUser));
        request.send({'unreadMessages' : true});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(0);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/user/requested-credits');
        request.set('auth-token', auth.token(otherUser));
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

  describe('delete', function () {
    var id;

    beforeEach('create request', function (done) {
      var request;
      request = app.post('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/users/other-user/credit-requests');
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/other-user/credit-requests/' + id);
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/other-user/credit-requests/' + id);
        request.set('auth-token', auth.token(user));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/invalid/credit-requests/' + id);
        request.set('auth-token', auth.token(otherUser));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/users/other-user/credit-requests/invalid');
        request.set('auth-token', auth.token(otherUser));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should remove', function (done) {
        var request;
        request = app.del('/users/other-user/credit-requests/' + id);
        request.set('auth-token', auth.token(otherUser));
        request.expect(204);
        request.end(done);
      });
    });
  });
});