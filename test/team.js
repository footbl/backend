/*globals describe, before, it, after*/
require('should');
var request, app, auth,
    User, Team,
    user;

request = require('supertest');
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
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'name' : 'test'});
            req = req.send({'picture' : 'http://test.com'});
            req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'picture' : 'http://test.com'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without picture', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('picture').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name and picture', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('picture').be.equal('required');
            });
            req.end(done);
        });

        it('should create', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test'});
            req = req.send({'picture' : 'http://test.com'});
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('test');
                response.body.should.have.property('slug').be.equal('test');
                response.body.should.have.property('picture').be.equal('http://test.com');
            });
            req.end(done);
        });

        describe('with a created team', function () {
            before(function (done) {
                Team.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/teams');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'name' : 'test'});
                req = req.send({'picture' : 'http://test.com'});
                req.end(done);
            });

            it('should raise error with repeated slug', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/teams');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'name' : 'test'});
                req = req.send({'picture' : 'http://test.com'});
                req.expect(409);
                req.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test'});
            req = req.send({'picture' : 'http://test.com'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should list', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (team) {
                    team.should.have.property('slug');
                    team.should.have.property('name');
                    team.should.have.property('picture');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams');
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
            Team.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test'});
            req = req.send({'picture' : 'http://test.com'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams/test');
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
            req = req.get('/teams/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('test');
                response.body.should.have.property('name').be.equal('test');
                response.body.should.have.property('picture').be.equal('http://test.com');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test'});
            req = req.send({'picture' : 'http://test.com'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'name' : 'test1'});
            req = req.send({'picture' : 'http://test1.com'});
            req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'picture' : 'http://test1.com'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without picture', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test1'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('picture').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name and picture', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('picture').be.equal('required');
            });
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test1'});
            req = req.send({'picture' : 'http://test1.com'});
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('test1');
                response.body.should.have.property('slug').be.equal('test1');
                response.body.should.have.property('picture').be.equal('http://test1.com');
            });
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams/test1');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('test1');
                response.body.should.have.property('name').be.equal('test1');
                response.body.should.have.property('picture').be.equal('http://test1.com');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/teams');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'test'});
            req = req.send({'picture' : 'http://test.com'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/teams/test');
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
            req = req.del('/teams/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(204);
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/teams/test');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });
    });
});