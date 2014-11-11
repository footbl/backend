/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Group, GroupMember,
groupOwner, groupUser, otherGroupUser, anotherGroupUser, Match;

supertest = require('supertest');
app = require('../index.js');
auth = require('auth');
User = require('../models/user');
Group = require('../models/group');
GroupMember = require('../models/group-member');
Match = require('../models/match');

describe('group controller', function () {
  'use strict';

  before(User.remove.bind(User));

  before(function (done) {
    groupOwner = new User({'password' : '1234', 'slug' : 'group-owner'});
    groupOwner.save(done);
  });

  before(function (done) {
    groupUser = new User({'password' : '1234', 'slug' : 'group-user'});
    groupUser.save(done);
  });

  before(function (done) {
    otherGroupUser = new User({'password' : '1234', 'slug' : 'other-group-user'});
    otherGroupUser.save(done);
  });

  before(function (done) {
    anotherGroupUser = new User({'password' : '1234', 'slug' : 'another-group-user'});
    anotherGroupUser.save(done);
  });

  describe('create', function () {
    describe('free to edit', function () {
      var slug;

      before(Group.remove.bind(Group));
      before(GroupMember.remove.bind(GroupMember));

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : true});
        request.expect(function (response) {
          slug = response.body.slug;
        });
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : groupUser.slug});
        request.end(done);
      });

      it('should raise error without token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(401);
        request.end(done);
      });

      it('should raise error with invalid group id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/invalid/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(404);
        request.end(done);
      });

      it('should raise error without user', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('user').be.equal('required');
        });
        request.end(done);
      });

      it('should create with owner token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('user');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });

      it('should create with user token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupUser));
        request.send({'group' : slug});
        request.send({'user' : anotherGroupUser.slug});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('user');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });

      describe('with member created', function () {
        var slug;

        before(Group.remove.bind(Group));
        before(GroupMember.remove.bind(GroupMember));

        before(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'name' : 'college buddies'});
          request.send({'freeToEdit' : true});
          request.expect(function (response) {
            slug = response.body.slug;
          });
          request.end(done);
        });

        before(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups/' + slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'group' : slug});
          request.send({'user' : groupUser.slug});
          request.end(done);
        });

        before(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups/' + slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'group' : slug});
          request.send({'user' : otherGroupUser.slug});
          request.end(done);
        });

        it('should raise error with repeated user', function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups/' + slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'group' : slug});
          request.send({'user' : otherGroupUser.slug});
          request.expect(409);
          request.end(done);
        });
      });
    });

    describe('not free to edit', function () {
      var slug;

      before(Group.remove.bind(Group));
      before(GroupMember.remove.bind(GroupMember));

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : false});
        request.expect(function (response) {
          slug = response.body.slug;
        });
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : groupUser._id});
        request.end(done);
      });

      it('should raise error without token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(401);
        request.end(done);
      });

      it('should raise error with invalid group id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/invalid/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(404);
        request.end(done);
      });

      it('should raise error without user', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('user').be.equal('required');
        });
        request.end(done);
      });

      it('should raise error with user token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupUser));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(405);
        request.end(done);
      });

      it('should create with owner token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('user');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });

      describe('with member created', function () {
        var slug;

        before(Group.remove.bind(Group));
        before(GroupMember.remove.bind(GroupMember));

        before(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'name' : 'college buddies'});
          request.send({'freeToEdit' : false});
          request.expect(function (response) {
            slug = response.body.slug;
          });
          request.end(done);
        });

        before(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups/' + slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'group' : slug});
          request.send({'user' : groupUser.slug});
          request.end(done);
        });

        before(function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups/' + slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'group' : slug});
          request.send({'user' : otherGroupUser.slug});
          request.end(done);
        });

        it('should raise error with repeated user', function (done) {
          var request, credentials;
          credentials = auth.credentials();
          request = supertest(app);
          request = request.post('/groups/' + slug + '/members');
          request.set('auth-signature', credentials.signature);
          request.set('auth-timestamp', credentials.timestamp);
          request.set('auth-transactionId', credentials.transactionId);
          request.set('auth-token', auth.token(groupOwner));
          request.send({'group' : slug});
          request.send({'user' : otherGroupUser.slug});
          request.expect(409);
          request.end(done);
        });
      });
    });
  });

  describe('list', function () {
    var slug;

    before(Group.remove.bind(Group));
    before(GroupMember.remove.bind(GroupMember));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'name' : 'college buddies'});
      request.send({'freeToEdit' : true});
      request.expect(function (response) {
        slug = response.body.slug;
      });
      request.end(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/members');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'group' : slug});
      request.send({'user' : groupUser._id});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/members');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid group id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/invalid/members');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(404);
      request.end(done);
    });

    it('should list', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/members');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body.every(function (championship) {
          championship.should.have.property('user');
          championship.should.have.property('slug');
        });
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/members');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
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
    var slug;

    before(Group.remove.bind(Group));
    before(GroupMember.remove.bind(GroupMember));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'name' : 'College Buddies'});
      request.expect(function (response) {
        slug = response.body.slug;
      });
      request.end(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/groups/' + slug + '/members');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.send({'group' : slug});
      request.send({'user' : groupUser.slug});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/members/' + groupUser.slug);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid group id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/invalid/members/' + groupUser.slug);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/members/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(404);
      request.end(done);
    });

    it('should show', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/groups/' + slug + '/members/' + groupUser.slug);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(groupOwner));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('user');
        response.body.should.have.property('slug');
      });
      request.end(done);
    });
  });

  describe('delete', function () {
    describe('free to edit', function () {
      var slug;

      before(Group.remove.bind(Group));
      before(GroupMember.remove.bind(GroupMember));

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : true});
        request.expect(function (response) {
          slug = response.body.slug;
        });
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : groupUser.slug});
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.end(done);
      });

      it('should raise without token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.expect(401);
        request.end(done);
      });

      it('should raise error with invalid group id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/invalid/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.expect(404);
        request.end(done);
      });

      it('should raise error with invalid id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/invalid');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.expect(404);
        request.end(done);
      });

      it('should remove with owner token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.expect(204);
        request.end(done);
      });

      it('should remove with user token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/' + otherGroupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupUser));
        request.expect(204);
        request.end(done);
      });
    });

    describe('not free to edit', function () {
      var slug;

      before(Group.remove.bind(Group));
      before(GroupMember.remove.bind(GroupMember));

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : false});
        request.expect(function (response) {
          slug = response.body.slug;
        });
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : groupUser.slug});
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/groups/' + slug + '/members');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.send({'group' : slug});
        request.send({'user' : otherGroupUser.slug});
        request.end(done);
      });

      it('should raise without token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.expect(401);
        request.end(done);
      });

      it('should raise error with invalid group id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/invalid/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.expect(404);
        request.end(done);
      });

      it('should raise error with invalid id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/invalid');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.expect(404);
        request.end(done);
      });

      it('should raise error with user token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupUser));
        request.expect(405);
        request.end(done);
      });

      it('should remove with owner token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/groups/' + slug + '/members/' + groupUser.slug);
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(groupOwner));
        request.expect(204);
        request.end(done);
      });
    });
  });
});