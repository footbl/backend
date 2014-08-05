/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
    User, Team,
    user;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Team = require('../models/team');

describe('team controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    describe('create', function () {
        before(function (done) {
            Team.remove(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'name' : 'test'});
            request.send({'picture' : 'http://test.com'});
            request.expect(401);
            request.end(done);
        });

        it('should raise error without name', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'picture' : 'http://test.com'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without valid picture', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test'});
            request.send({'picture' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('picture').be.equal('regexp');
            });
            request.end(done);
        });

        it('should raise error without name and valid picture', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'picture' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('picture').be.equal('regexp');
            });
            request.end(done);
        });

        it('should create', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test'});
            request.send({'picture' : 'http://test.com'});
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('test');
                response.body.should.have.property('slug').be.equal('test');
                response.body.should.have.property('picture').be.equal('http://test.com');
            });
            request.end(done);
        });

        describe('with a created team', function () {
            before(function (done) {
                Team.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/teams');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'name' : 'test'});
                request.send({'picture' : 'http://test.com'});
                request.end(done);
            });

            it('should raise error with repeated slug', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/teams');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'name' : 'test'});
                request.send({'picture' : 'http://test.com'});
                request.expect(409);
                request.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test'});
            request.send({'picture' : 'http://test.com'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should list', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (team) {
                    team.should.have.property('slug');
                    team.should.have.property('name');
                    team.should.have.property('picture');
                });
            });
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams');
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
            Team.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test'});
            request.send({'picture' : 'http://test.com'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams/test');
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
            request = request.get('/teams/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should return', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('test');
                response.body.should.have.property('name').be.equal('test');
                response.body.should.have.property('picture').be.equal('http://test.com');
            });
            request.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test'});
            request.send({'picture' : 'http://test.com'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'name' : 'test1'});
            request.send({'picture' : 'http://test1.com'});
            request.expect(401);
            request.end(done);
        });

        it('should raise error without name', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'picture' : 'http://test1.com'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without valid picture', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test1'});
            request.send({'picture' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('picture').be.equal('regexp');
            });
            request.end(done);
        });

        it('should raise error without name and valid picture', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'picture' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('picture').be.equal('regexp');
            });
            request.end(done);
        });

        it('should update', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test1'});
            request.send({'picture' : 'http://test1.com'});
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('test1');
                response.body.should.have.property('slug').be.equal('test1');
                response.body.should.have.property('picture').be.equal('http://test1.com');
            });
            request.end(done);
        });

        after(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams/test1');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('test1');
                response.body.should.have.property('name').be.equal('test1');
                response.body.should.have.property('picture').be.equal('http://test1.com');
            });
            request.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/teams');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'test'});
            request.send({'picture' : 'http://test.com'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/teams/test');
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
            request = request.del('/teams/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should delete', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(204);
            request.end(done);
        });

        after(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/teams/test');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });
    });
});