/*globals describe, before, beforeEach, afterEach, it*/
'use strict';

var supertest, app, auth,
User, Group, GroupMember,
user, otherUser, group;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Group = require('../../models/group');
GroupMember = require('../../models/group-member');

describe('group member controller', function () {
  before(User.remove.bind(User));
  before(Group.remove.bind(Group));

  before(function (done) {
    user = new User({'password' : '1234', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  before(function (done) {
    group = new Group({
      'name'       : 'buddies',
      'slug'       : new Date().getTime().toString(36).substring(3),
      'freeToEdit' : true,
      'owner'      : user._id
    });
    group.save(done);
  });

  beforeEach('remove members', GroupMember.remove.bind(GroupMember));

  beforeEach('reset group', function (done) {
    Group.update({'_id' : group._id}, {'$set' : {'freeToEdit' : true}}, done);
  });

  describe('create', function () {
    describe('free to edit', function () {
      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.send({'user' : otherUser.slug});
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid group id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/invalid/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.expect(404);
          request.end(done);
        });
      });

      describe('with member created', function () {
        beforeEach('create member', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.end(done);
        });

        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.expect(409);
          request.end(done);
        });
      });

      describe('with valid credentials and user', function () {
        it('should create', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.expect(201);
          request.expect(function (response) {
            response.body.should.have.property('user');
            response.body.should.have.property('slug');
          });
          request.end(done);
        });
      });

      describe('with other user valid credentials and user', function () {
        it('should create ', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(otherUser));
          request.send({'user' : otherUser.slug});
          request.expect(201);
          request.expect(function (response) {
            response.body.should.have.property('user');
            response.body.should.have.property('slug');
          });
          request.end(done);
        });
      });
    });

    describe('not free to edit', function () {
      beforeEach('reset group', function (done) {
        Group.update({'_id' : group._id}, {'$set' : {'freeToEdit' : false}}, done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.send({'user' : otherUser.slug});
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid group id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/invalid/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.expect(404);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(otherUser));
          request.send({'user' : otherUser.slug});
          request.expect(405);
          request.end(done);
        });
      });

      describe('with member created', function () {
        beforeEach('create member', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.end(done);
        });

        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.expect(409);
          request.end(done);
        });
      });

      describe('with valid credentials and user', function () {
        it('should create', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : otherUser.slug});
          request.expect(201);
          request.expect(function (response) {
            response.body.should.have.property('user');
            response.body.should.have.property('slug');
          });
          request.end(done);
        });
      });
    });
  });

  describe('invite', function () {
    describe('free to edit', function () {
      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.send({'user' : 'invited-user@invite.com'});
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid group id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/invalid/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : 'invited-user@invite.com'});
          request.expect(404);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should invite', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : 'invited-user@invite.com'});
          request.expect(200);
          request.end(done);
        });

        afterEach(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.post('/users');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.send({'password' : '1234'});
          request.send({'email' : 'invited-user@invite.com'});
          request.end(done);
        });

        afterEach(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.get('/groups/' + group.slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(1);
          });
          request.end(done);
        });
      });

      describe('with valid other user credentials', function () {
        it('should invite', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(otherUser));
          request.send({'user' : 'invited-user@invite.com'});
          request.expect(200);
          request.end(done);
        });

        afterEach(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.post('/users');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.send({'password' : '1234'});
          request.send({'email' : 'invited-user@invite.com'});
          request.end(done);
        });

        afterEach(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.get('/groups/' + group.slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
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

    describe('not free to edit', function () {
      beforeEach('reset group', function (done) {
        Group.update({'_id' : group._id}, {'$set' : {'freeToEdit' : false}}, done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.send({'user' : 'invited-user2@invite.com'});
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/invalid/members');
          request.set('auth-token', auth.token(otherUser));
          request.send({'user' : 'invited-user2@invite.com'});
          request.expect(404);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(otherUser));
          request.send({'user' : 'invited-user2@invite.com'});
          request.expect(405);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should invite', function (done) {
          var request;
          request = app.post('/groups/' + group.slug + '/members');
          request.set('auth-token', auth.token(user));
          request.send({'user' : 'invited-user@invite.com'});
          request.expect(200);
          request.end(done);
        });

        afterEach(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.post('/users');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.send({'password' : '1234'});
          request.send({'email' : 'invited-user@invite.com'});
          request.end(done);
        });

        afterEach(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = app.get('/groups/' + group.slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
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
  });

  describe('list', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/members');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid group id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/invalid/members');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one group member', function () {
      beforeEach('create member', function (done) {
        var request;
        request = app.post('/groups/' + group.slug + '/members');
        request.set('auth-token', auth.token(user));
        request.send({'user' : otherUser.slug});
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/members');
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
        request = app.get('/groups/' + group.slug + '/members');
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
    beforeEach('create member', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/members');
      request.set('auth-token', auth.token(user));
      request.send({'user' : otherUser.slug});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/members/' + otherUser.slug);
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid group id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/invalid/members/' + otherUser.slug);
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/members/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/members/' + otherUser.slug);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('user');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });
    });
  });

  describe('update', function () {
    beforeEach('create member', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/members');
      request.set('auth-token', auth.token(user));
      request.send({'user' : otherUser.slug});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/members/' + otherUser.slug);
        request.send({'notifications' : false});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should update', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/members/' + otherUser.slug);
        request.set('auth-token', auth.token(user));
        request.send({'notifications' : false});
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid group id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/groups/invalid/members/' + otherUser.slug);
        request.set('auth-token', auth.token(otherUser));
        request.send({'notifications' : false});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/members/invalid');
        request.set('auth-token', auth.token(otherUser));
        request.send({'notifications' : false});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should update', function (done) {
        var request;
        request = app.put('/groups/' + group.slug + '/members/' + otherUser.slug);
        request.set('auth-token', auth.token(otherUser));
        request.send({'notifications' : false});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('user');
          response.body.should.have.property('notifications').be.equal(false);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/groups/' + group.slug + '/members/' + otherUser.slug);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('notifications').be.equal(false);
        });
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    beforeEach('create member', function (done) {
      var request;
      request = app.post('/groups/' + group.slug + '/members');
      request.set('auth-token', auth.token(user));
      request.send({'user' : otherUser.slug});
      request.end(done);
    });

    describe('free to edit', function () {
      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/' + otherUser.slug);
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid group id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/invalid/members/' + otherUser.slug);
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/invalid');
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should remove', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/' + otherUser.slug);
          request.set('auth-token', auth.token(user));
          request.expect(204);
          request.end(done);
        });
      });

      describe('with valid other user credentials', function () {
        it('should remove with user token', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/' + otherUser.slug);
          request.set('auth-token', auth.token(otherUser));
          request.expect(204);
          request.end(done);
        });
      });
    });

    describe('not free to edit', function () {
      beforeEach('reset group', function (done) {
        Group.update({'_id' : group._id}, {'$set' : {'freeToEdit' : false}}, done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/' + otherUser.slug);
          request.expect(401);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should remove with user token', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/' + otherUser.slug);
          request.set('auth-token', auth.token(otherUser));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with invalid group id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/invalid/members/' + otherUser.slug);
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/invalid');
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should remove', function (done) {
          var request;
          request = app.del('/groups/' + group.slug + '/members/' + otherUser.slug);
          request.set('auth-token', auth.token(user));
          request.expect(204);
          request.end(done);
        });
      });
    });
  });
});