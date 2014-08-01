/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Featured,
user, otherUser, featuredUser, otherFeaturedUser;

supertest = require('supertest');
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
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'featured' : 'featured-user'});
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/invalid/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.expect(404);
            request.end(done);
        });

        it('should raise error without user', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('featured').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error with other user token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(featuredUser));
            request.expect(405);
            request.end(done);
        });

        it('should create with user', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            request.end(done);
        });

        it('should create by me slug', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/me/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'other-featured-user'});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            request.end(done);
        });

        describe('with featured created', function () {
            before(function (done) {
                Featured.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users/user/featured');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'featured' : 'featured-user'});
                request.end(done);
            });

            it('should raise error with repeated user', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users/user/featured');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'featured' : 'featured-user'});
                request.expect(409);
                request.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/invalid/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should list', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('featured');
                    championship.should.have.property('slug');
                });
            });
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
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

    describe('list fans', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/featured-user/fans');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/invalid/fans');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should list', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/featured-user/fans');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('featured');
                    championship.should.have.property('slug');
                });
            });
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/featured-user/fans');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
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

    describe('details', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/invalid/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user/featured/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should show', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            request.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.end(done);
        });

        it('should raise without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'featured' : 'other-featured-user'});
            request.expect(401);
            request.end(done);
        });

        it('should raise with other user token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(otherUser));
            request.send({'featured' : 'other-featured-user'});
            request.expect(405);
            request.end(done);
        });

        it('should raise with invalid user id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/invalid/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'other-featured-user'});
            request.expect(404);
            request.end(done);
        });

        it('should raise with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/user/featured/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'other-featured-user'});
            request.expect(404);
            request.end(done);
        });

        it('should raise without user', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(400);
            request.end(done);
        });

        it('should update', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'other-featured-user'});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('featured');
                response.body.should.have.property('slug');
            });
            request.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Featured.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/featured');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'featured' : 'featured-user'});
            request.end(done);
        });

        it('should raise without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise with other user token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(otherUser));
            request.expect(405);
            request.end(done);
        });

        it('should raise with invalid user id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/invalid/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should raise with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/user/featured/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should remove', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/user/featured/featured-user');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(204);
            request.end(done);
        });
    });
});