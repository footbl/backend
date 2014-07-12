/*globals describe, before, it, after*/
require('should');
var request, app, auth,
User, Featured,
user, otherUser, featuredUser, otherFeaturedUser;

request = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Featured = require('../models/featured');

describe('featured controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        user = new User({'password' : '1234', 'slug' : 'user'});
        user.save(done);
    });

    before(function (done) {
        otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
        otherUser.save(done);
    });

    before(function (done) {
        featuredUser = new User({'password' : '1234', 'slug' : 'featured-user'});
        featuredUser.save(done);
    });

    before(function (done) {
        otherFeaturedUser = new User({'password' : '1234', 'slug' : 'other-featured-user'});
        otherFeaturedUser.save(done);
    });

    describe('create', function () {
        before(function (done) {
            Featured.remove(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'featured' : 'featured-user'});
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/invalid/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.expect(404);
            req.end(done);
        });

        it('should raise error without user', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('featured').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error with other user token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(featuredUser));
            req.expect(405);
            req.end(done);
        });

        it('should create with user', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.expect(201);
            req.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            req.end(done);
        });

        it('should create by me slug', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/me/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'other-featured-user'});
            req.expect(201);
            req.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            req.end(done);
        });

        describe('with featured created', function () {
            before(function (done) {
                Featured.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users/user/featured');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'featured' : 'featured-user'});
                req.end(done);
            });

            it('should raise error with repeated user', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users/user/featured');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'featured' : 'featured-user'});
                req.expect(409);
                req.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/invalid/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should list', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('featured');
                    championship.should.have.property('slug');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'page' : 1});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(0);
            });
            req.end(done);
        });
    });

    describe('list fans', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/featured-user/fans');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/invalid/fans');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should list', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/featured-user/fans');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('featured');
                    championship.should.have.property('slug');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/featured-user/fans');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
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
            Featured.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/invalid/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user/featured/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should show', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.end(done);
        });

        it('should raise without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'featured' : 'other-featured-user'});
            req.expect(401);
            req.end(done);
        });

        it('should raise with other user token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req = req.send({'featured' : 'other-featured-user'});
            req.expect(405);
            req.end(done);
        });

        it('should raise with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/invalid/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'other-featured-user'});
            req.expect(404);
            req.end(done);
        });

        it('should raise with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/user/featured/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'other-featured-user'});
            req.expect(404);
            req.end(done);
        });

        it('should raise without user', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(400);
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'other-featured-user'});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/featured');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'featured' : 'featured-user'});
            req.end(done);
        });

        it('should raise without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise with other user token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req.expect(405);
            req.end(done);
        });

        it('should raise with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/invalid/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/user/featured/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should remove', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/user/featured/featured-user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(204);
            req.end(done);
        });
    });
});