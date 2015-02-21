/*globals describe, before, beforeEach, afterEach, it*/
'use strict';

var supertest, app, auth,
User, Group, GroupMember,
user, otherUser;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Group = require('../../models/group');
GroupMember = require('../../models/group-member');

describe('group controller', function () {
  before(User.remove.bind(User));

  before(function (done) {
    user = new User({'password' : '1234', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  beforeEach('remove groups', Group.remove.bind(Group));

  beforeEach('remove members', GroupMember.remove.bind(GroupMember));

  describe('create', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/groups');
        request.send({'name' : 'college buddies'});
        request.expect(401);
        request.end(done);
      });
    });

    describe('without name', function () {
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

    describe('with valid credentials and name', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('name').be.equal('college buddies');
        });
        request.end(done);
      });
    });
  });

  describe('list', function () {
    describe('without token', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/groups');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with one featured group', function () {
      beforeEach(function (done) {
        new Group({
          'name'       : 'macmagazine',
          'slug'       : new Date().getTime().toString(36).substring(3),
          'freeToEdit' : false,
          'owner'      : user._id,
          'featured'   : true
        }).save(done);
      });

      it('should list featured groups', function (done) {
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

    describe('with one group', function () {
      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.end(done);
      });

      it('should list one in first page', function (done) {
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

      it('should return empty in second page', function (done) {
        var request;
        request = app.get('/groups');
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

    beforeEach(function (done) {
      var request;
      request = app.post('/groups');
      request.set('auth-token', auth.token(user));
      request.send({'name' : 'college buddies'});
      request.end(done);
    });

    beforeEach(function (done) {
      var request;
      request = app.get('/groups');
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/' + id);
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/groups/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should show', function (done) {
        var request;
        request = app.get('/groups/' + id);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('name').be.equal('college buddies');
          response.body.should.have.property('slug');
        });
        request.end(done);
      });
    });
  });

  describe('update', function () {
    describe('free to edit', function () {
      var id;

      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : true});
        request.end(done);
      });

      beforeEach(function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body[0].slug;
        });
        request.end(done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.send({'name' : 'edited college buddies'});
          request.expect(401);
          request.end(done);
        });
      });

      describe('without name', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(400);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('required');
          });
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/groups/invalid');
          request.set('auth-token', auth.token(user));
          request.send({'name' : 'edited again college buddies'});
          request.expect(404);
          request.end(done);
        });
      });

      describe('with valid credentials and name', function () {
        it('should update ', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.send({'name' : 'edited college buddies'});
          request.send({'freeToEdit' : false});
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('edited college buddies');
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('edited college buddies');
            response.body.should.have.property('freeToEdit').be.equal(false);
          });
          request.end(done);
        });
      });

      describe('with other user valid credentials and name', function () {
        it('should not change free to edit with user token', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.set('auth-token', auth.token(otherUser));
          request.send({'name' : 'edited college buddies'});
          request.send({'freeToEdit' : false});
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('edited college buddies');
            response.body.should.have.property('freeToEdit').be.equal(true);
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('edited college buddies');
            response.body.should.have.property('freeToEdit').be.equal(true);
          });
          request.end(done);
        });
      });
    });

    describe('not free to edit', function () {
      var id;

      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : false});
        request.end(done);
      });

      beforeEach(function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body[0].slug;
        });
        request.end(done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.send({'name' : 'edited college buddies'});
          request.expect(401);
          request.end(done);
        });
      });

      describe('without name', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(400);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('required');
          });
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.set('auth-token', auth.token(otherUser));
          request.send({'name' : 'edited again college buddies'});
          request.send({'freeToEdit' : false});
          request.expect(405);
          request.end(done);
        });
      });

      describe('with valid credentials and name', function () {
        it('should update', function (done) {
          var request;
          request = app.put('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.send({'name' : 'edited college buddies'});
          request.send({'freeToEdit' : false});
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('edited college buddies');
            response.body.should.have.property('freeToEdit').be.equal(false);
          });
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.expect(function (response) {
            response.body.should.have.property('name').be.equal('edited college buddies');
            response.body.should.have.property('freeToEdit').be.equal(false);
          });
          request.end(done);
        });
      });
    });
  });

  describe('restart', function () {
    describe('free to edit', function () {
      var id;

      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : true});
        request.end(done);
      });

      beforeEach(function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body[0].slug;
        });
        request.end(done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + id + '/restart');
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/invalid/restart');
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should restart', function (done) {
          var request;
          request = app.post('/groups/' + id + '/restart');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.end(done);
        });
      });

      describe('with other user valid credentials', function () {
        it('should restart', function (done) {
          var request;
          request = app.post('/groups/' + id + '/restart');
          request.set('auth-token', auth.token(otherUser));
          request.expect(200);
          request.end(done);
        });
      });
    });

    describe('not free to edit', function () {
      var id;

      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : false});
        request.end(done);
      });

      beforeEach(function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body[0].slug;
        });
        request.end(done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + id + '/restart');
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/invalid/restart');
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.post('/groups/' + id + '/restart');
          request.set('auth-token', auth.token(otherUser));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should restart', function (done) {
          var request;
          request = app.post('/groups/' + id + '/restart');
          request.set('auth-token', auth.token(user));
          request.expect(200);
          request.end(done);
        });
      });
    });
  });

  describe('delete', function () {
    describe('free to edit', function () {
      var id;

      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : true});
        request.end(done);
      });

      beforeEach(function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body[0].slug;
        });
        request.end(done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + id);
          request.send({'name' : 'edited college buddies'});
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/invalid');
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should remove', function (done) {
          var request;
          request = app.del('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(204);
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with other user valid credentials', function () {
        it('should remove', function (done) {
          var request;
          request = app.del('/groups/' + id);
          request.set('auth-token', auth.token(otherUser));
          request.expect(204);
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });
    });

    describe('not free to edit', function () {
      var id;

      beforeEach(function (done) {
        var request;
        request = app.post('/groups');
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'college buddies'});
        request.send({'freeToEdit' : false});
        request.end(done);
      });

      beforeEach(function (done) {
        var request;
        request = app.get('/groups');
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body[0].slug;
        });
        request.end(done);
      });

      describe('without token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + id);
          request.expect(401);
          request.end(done);
        });
      });

      describe('with invalid id', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/invalid');
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });

      describe('with other user token', function () {
        it('should raise error', function (done) {
          var request;
          request = app.del('/groups/' + id);
          request.set('auth-token', auth.token(otherUser));
          request.expect(405);
          request.end(done);
        });
      });

      describe('with valid credentials', function () {
        it('should remove', function (done) {
          var request;
          request = app.del('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(204);
          request.end(done);
        });

        afterEach(function (done) {
          var request;
          request = app.get('/groups/' + id);
          request.set('auth-token', auth.token(user));
          request.expect(404);
          request.end(done);
        });
      });
    });
  });
});