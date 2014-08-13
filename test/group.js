/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Group, GroupMember,
groupOwner, otherGroupOwner, groupUser, otherGroupUser, featuredGroup;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Group = require('../models/group');
GroupMember = require('../models/group-member');

describe('group controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        groupOwner = new User({'password' : '1234', 'slug' : 'group-owner'});
        groupOwner.save(done);
    });

    before(function (done) {
        otherGroupOwner = new User({'password' : '1234', 'slug' : 'other-group-owner'});
        otherGroupOwner.save(done);
    });

    before(function (done) {
        groupUser = new User({'password' : '1234', 'slug' : 'group-user'});
        groupUser.save(done);
    });

    before(function (done) {
        otherGroupUser = new User({'password' : '1234', 'slug' : 'other-group-user'});
        otherGroupUser.save(done);
    });

    describe('create', function () {
        before(function (done) {
            Group.remove(done);
        });

        before(function (done) {
            GroupMember.remove(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'name' : 'college buddies'});
            request.expect(401);
            request.end(done);
        });

        it('should raise error without name', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            request.end(done);
        });

        it('should create', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.send({'name' : 'college buddies'});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('college buddies');
            });
            request.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            Group.remove(done);
        });

        before(function (done) {
            GroupMember.remove(done);
        });

        before(function (done) {
            featuredGroup = new Group({
                'name'       : 'macmagazine',
                'slug'       : new Date().getTime().toString(36).substring(3),
                'freeToEdit' : false,
                'owner'      : groupOwner._id,
                'featured'   : true
            });
            featuredGroup.save(done);
        });

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
            request.end(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(otherGroupOwner));
            request.send({'name' : 'college buddies'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should only list user groups', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('name');
                    championship.should.have.property('slug');
                });
            });
            request.end(done);
        });

        it('should list featured groups', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.send({'featured' : true});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (group) {
                    group.should.have.property('name').be.equal('macmagazine');
                    group.should.have.property('slug');
                });
            });
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups');
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

        before(function (done) {
            Group.remove(done);
        });

        before(function (done) {
            GroupMember.remove(done);
        });

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

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups/' + slug);
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.expect(404);
            request.end(done);
        });

        it('should return', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups/' + slug);
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('College Buddies');
                response.body.should.have.property('slug');
            });
            request.end(done);
        });

        it('should return case insensitive', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/groups/' + slug);
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(groupOwner));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('College Buddies');
                response.body.should.have.property('slug');
            });
            request.end(done);
        });
    });

    describe('update', function () {
        describe('free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'name' : 'edited college buddies'});
                request.expect(401);
                request.end(done);
            });

            it('should raise error without name', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(400);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('required');
                });
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/invalid');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'name' : 'edited again college buddies'});
                request.expect(404);
                request.end(done);
            });

            it('should update with user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'name' : 'edited again college buddies'});
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited again college buddies');
                });
                request.end(done);
            });

            it('should not change free to edit with user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'name' : 'edited again college buddies'});
                request.send({'freeToEdit' : false});
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited again college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(true);
                });
                request.end(done);
            });

            it('should update with owner token and change free to edit', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.send({'name' : 'edited college buddies'});
                request.send({'freeToEdit' : false});
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                request.end(done);
            });

            after(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                request.end(done);
            });
        });

        describe('not free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'name' : 'edited college buddies'});
                request.expect(401);
                request.end(done);
            });

            it('should raise error without name', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(400);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('required');
                });
                request.end(done);
            });

            it('should raise error with user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'name' : 'edited again college buddies'});
                request.send({'freeToEdit' : false});
                request.expect(405);
                request.end(done);
            });

            it('should update with owner token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.put('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.send({'name' : 'edited college buddies'});
                request.send({'freeToEdit' : false});
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                request.end(done);
            });

            after(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                request.end(done);
            });
        });
    });

    describe('invite', function () {
        describe('free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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

            it('should raise error without token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'invite' : 'invited-user@invite.com'});
                request.expect(401);
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/invalid/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'invite' : 'invited-user@invite.com'});
                request.expect(404);
                request.end(done);
            });

            it('should invite', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.send({'invite' : 'invited-user@invite.com'});
                request.expect(200);
                request.end(done);
            });

            after(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'email' : 'invited-user@invite.com'});
                request.end(done);
            });

            after(function (done) {
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
                    response.body.should.have.lengthOf(2);
                });
                request.end(done);
            });
        });

        describe('not free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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

            it('should raise error without token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'invite' : 'invited-user2@invite.com'});
                request.expect(401);
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/invalid/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'invite' : 'invited-user2@invite.com'});
                request.expect(404);
                request.end(done);
            });

            it('should raise error with other user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'invite' : 'invited-user2@invite.com'});
                request.expect(405);
                request.end(done);
            });

            it('should invite', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/invite');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.send({'invite' : 'invited-user2@invite.com'});
                request.expect(200);
                request.end(done);
            });

            after(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'email' : 'invited-user2@invite.com'});
                request.end(done);
            });

            after(function (done) {
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
                    response.body.should.have.lengthOf(2);
                });
                request.end(done);
            });
        });
    });

    describe('restart', function () {
        describe('free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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

            it('should raise error without token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.expect(401);
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/invalid/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.expect(404);
                request.end(done);
            });

            it('should restart', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(200);
                request.end(done);
            });
        });

        describe('not free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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

            it('should raise error without token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.expect(401);
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/invalid/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.expect(404);
                request.end(done);
            });

            it('should raise error with other user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.expect(405);
                request.end(done);
            });

            it('should invite', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/groups/' + slug + '/restart');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(200);
                request.end(done);
            });
        });
    });

    describe('delete', function () {
        describe('free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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
                request = request.del('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'name' : 'edited college buddies'});
                request.expect(401);
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.del('/groups/invalid');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.send({'name' : 'edited again college buddies'});
                request.expect(404);
                request.end(done);
            });

            it('should remove with user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.del('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupUser));
                request.expect(204);
                request.end(done);
            });

            after(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(404);
                request.end(done);
            });
        });

        describe('not free to edit', function () {
            var slug;

            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                GroupMember.remove(done);
            });

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
                request = request.del('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.expect(401);
                request.end(done);
            });

            it('should raise error with user token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.del('/groups/' + slug);
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
                request = request.del('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(204);
                request.end(done);
            });

            after(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/groups/' + slug);
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(groupOwner));
                request.expect(404);
                request.end(done);
            });
        });
    });
});