/*globals describe, before, it, after*/
require('should');
var request, app, auth,
    User, Group,
    groupOwner, otherGroupOwner, groupUser, otherGroupUser;

request  = require('supertest');
app      = require('../index.js');
auth     = require('../lib/auth');

User  = require('../models/user');
Group = require('../models/group');

describe('group controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        groupOwner = new User({'password' : '1234'});
        groupOwner.save(done);
    });

    before(function (done) {
        otherGroupOwner = new User({'password' : '1234'});
        otherGroupOwner.save(done);
    });

    before(function (done) {
        groupUser = new User({'password' : '1234'});
        groupUser.save(done);
    });

    before(function (done) {
        otherGroupUser = new User({'password' : '1234'});
        otherGroupUser.save(done);
    });

    describe('create', function () {
        before(function (done) {
            Group.remove(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'name' : 'college buddies'});
            req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            req.end(done);
        });

        it('should create', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req = req.send({'name' : 'college buddies'});
            req.expect(201);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('college buddies');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            Group.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req = req.send({'name' : 'college buddies'});
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherGroupOwner));
            req = req.send({'name' : 'college buddies'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should only list user groups', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('name');
                    championship.should.have.property('slug');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req = req.send({'page' : 1});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(0);
            });
            req.end(done);
        });
    });

    describe('details', function () {
        before(function (done) {
            Group.remove(done);
        });

        before(function (done) {
            var group;
            group = new Group({
                'name' : 'College Buddies',
                'slug' : 'abcde',
                'owner' : groupOwner._id,
                'members' : [{
                    'user' : groupOwner._id
                }]
            });
            group.save(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups/abcde');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups/abcde');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('College Buddies');
                response.body.should.have.property('slug').be.equal('abcde');
            });
            req.end(done);
        });

        it('should return case insensitive', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/groups/abcde');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('College Buddies');
                response.body.should.have.property('slug').be.equal('abcde');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        describe('free to edit', function () {
            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                var group;
                group = new Group({
                    'name' : 'College Buddies',
                    'slug' : 'abcde',
                    'owner' : groupOwner._id,
                    'freeToEdit' : true,
                    'members' : [{
                        'user' : groupOwner._id
                    }, {
                        'user' : groupUser._id
                    }]
                });
                group.save(done);
            });

            it('should raise error without token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'name' : 'edited college buddies'});
                req.expect(401);
                req.end(done);
            });

            it('should raise error without name', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupOwner));
                req.expect(400);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('required');
                });
                req.end(done);
            });

            it('should update with user token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupUser));
                req = req.send({'name' : 'edited again college buddies'});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited again college buddies');
                });
                req.end(done);
            });

            it('should not change free to edit with user token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupUser));
                req = req.send({'name' : 'edited again college buddies'});
                req = req.send({'freeToEdit' : false});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited again college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(true);
                });
                req.end(done);
            });

            it('should update with owner token and change free to edit', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupOwner));
                req = req.send({'name' : 'edited college buddies'});
                req = req.send({'freeToEdit' : false});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupOwner));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                req.end(done);
            });
        });

        describe('not free to edit', function () {
            before(function (done) {
                Group.remove(done);
            });

            before(function (done) {
                var group;
                group = new Group({
                    'name' : 'College Buddies',
                    'slug' : 'abcde',
                    'owner' : groupOwner._id,
                    'freeToEdit' : false,
                    'members' : [{
                        'user' : groupOwner._id
                    }, {
                        'user' : groupUser._id
                    }]
                });
                group.save(done);
            });

            it('should raise error without token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'name' : 'edited college buddies'});
                req.expect(401);
                req.end(done);
            });

            it('should raise error without name', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupOwner));
                req.expect(400);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('required');
                });
                req.end(done);
            });

            it('should raise error with user token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupUser));
                req = req.send({'name' : 'edited again college buddies'});
                req = req.send({'freeToEdit' : false});
                req.expect(405);
                req.end(done);
            });

            it('should update with owner token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupOwner));
                req = req.send({'name' : 'edited college buddies'});
                req = req.send({'freeToEdit' : false});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/groups/abcde');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(groupOwner));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('name').be.equal('edited college buddies');
                    response.body.should.have.property('freeToEdit').be.equal(false);
                });
                req.end(done);
            });
        });
    });

    describe('delete', function () {
        before(function (done) {
            Group.remove(done);
        });

        before(function (done) {
            var group;
            group = new Group({
                'name' : 'College Buddies',
                'slug' : 'abcde',
                'owner' : groupOwner._id,
                'freeToEdit' : true,
                'members' : [{
                    'user' : groupOwner._id
                }, {
                    'user' : groupUser._id
                }]
            });
            group.save(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/groups/abcde');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/groups/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/groups/abcde');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(204);
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(groupOwner));
            req.expect(404);
            req.end(done);
        });
    });
});