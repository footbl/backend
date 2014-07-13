/*globals describe, before, it, after*/
require('should');
var request, app, auth, nock,
User, Championship, Team, Match, Bet,
user, otherUser;

request = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
nock = require('nock');
User = require('../models/user');
Championship = require('../models/championship');
Team = require('../models/team');
Match = require('../models/match');
Bet = require('../models/bet');

nock('https://graph.facebook.com').get('/me?access_token=1234').times(Infinity).reply(200, {'id': '111'});
nock('https://graph.facebook.com').get('/me?access_token=invalid').times(Infinity).reply(404, {});

describe('user controller', function () {
    'use strict';

    describe('create', function () {
        before(function (done) {
            User.remove(done);
        });

        it('should raise error without password', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('password').be.equal('required');
            });
            req.end(done);
        });

        it('should create', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234'});
            req.expect(201);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('me');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            req.end(done);
        });

        describe('with registered email', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req = req.send({'email' : 'test@test.com'});
                req.end(done);
            });

            it('should raise error with repeated email', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req = req.send({'email' : 'test@test.com'});
                req.expect(409);
                req.end(done);
            });
        });

        describe('with registered username', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req = req.send({'username' : 'test'});
                req.end(done);
            });

            it('should raise error with repeated username', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req = req.send({'username' : 'test'});
                req.expect(409);
                req.end(done);
            });
        });

        describe('with registered facebookId', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('facebook-token', '1234');
                req = req.send({'password' : '1234'});
                req.end(done);
            });

            it('should raise error with repeated facebookId', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('facebook-token', '1234');
                req = req.send({'password' : '1234'});
                req.expect(409);
                req.end(done);
            });
        });

        describe('with registered name', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req = req.send({'name' : 'test'});
                req.end(done);
            });

            it('should raise error with repeated name', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req = req.send({'name' : 'test'});
                req.expect(409);
                req.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234'});
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234'});
            req = req.send({'email' : 'user1@user.com'});
            req = req.send({'name' : 'user1'});
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('facebook-token', '1234');
            req = req.send({'password' : '1234'});
            req = req.send({'name' : 'user2'});
            req.end(done);
        })

        before(function (done) {
            var featured;
            featured = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user', 'featured' : true});
            featured.save(done);
        });

        it('should filter by featured', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'featured' : true});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user');
            });
            req.end(done);
        });

        it('should filter by facebookId', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'facebookIds' : ['111']});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user2');
            });
            req.end(done);
        });

        it('should filter by email', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'emails' : ['user1@user.com']});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user1');
            });
            req.end(done);
        });

        it('should filter by facebookId and email', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'facebookIds' : ['111']});
            req = req.send({'emails' : ['user1@user.com']});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(2);
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
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
        var user;

        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            user = new User({'password' : '1234', 'type' : 'admin'});
            user.save(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234'});
            req = req.send({'email' : 'user1@user.com'});
            req = req.send({'name' : 'user1'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user1');
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
            req = req.get('/users/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should show my account searching by me', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/me');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            req.end(done);
        });

        it('should show', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/user1');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('user1');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var user;

        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            user = new User({'password' : '1234', 'type' : 'admin'});
            user.save(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234'});
            req = req.send({'email' : 'user1@user.com'});
            req = req.send({'name' : 'user1'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/me');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with other user token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/user1');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(405);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/me');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'password' : '1234'});
            req = req.send({'email' : 'user2@user.com'});
            req = req.send({'name' : 'user2'});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('user2');
                response.body.should.have.property('name').be.equal('user2');
                response.body.should.have.property('email').be.equal('user2@user.com');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/me');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('user2');
                response.body.should.have.property('name').be.equal('user2');
                response.body.should.have.property('email').be.equal('user2@user.com');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var user;

        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            user = new User({'password' : '1234', 'type' : 'admin'});
            user.save(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234'});
            req = req.send({'email' : 'user1@user.com'});
            req = req.send({'name' : 'user1'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/me');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with other user token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/user1');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(405);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/users/invalid');
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
            req = req.del('/users/me');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(204);
            req.end(done);
        });
    });

    describe('login', function () {
        describe('anonymous user', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req.end(done);
            });

            it('should raise error with invalid password', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : 'invalid'});
                req.expect(403);
                req.end(done);
            });

            it('should login with valid password', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'password' : '1234'});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('token');
                });
                req.end(done);
            });
        });

        describe('facebook user', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('facebook-token', '1234');
                req = req.send({'password' : '1234'});
                req.end(done);
            });

            it('should raise error with invalid facebook token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('facebook-token', 'invalid');
                req.expect(403);
                req.end(done);
            });

            it('should login with valid facebook token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('facebook-token', '1234');
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('token');
                });
                req.end(done);
            });
        });

        describe('registred user', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('facebook-token', '1234');
                req = req.send({'password' : '1234'});
                req = req.send({'email' : 'user1@user.com'});
                req = req.send({'name' : 'user1'});
                req = req.send({'password' : '1234'});
                req.end(done);
            });

            it('should raise error with invalid password', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'email' : 'user1@user.com'});
                req = req.send({'password' : 'invalid'});
                req.expect(403);
                req.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'email' : 'invalid'});
                req = req.send({'password' : '1234'});
                req.expect(403);
                req.end(done);
            });

            it('should raise error with invalid id and password', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'email' : 'invalid'});
                req = req.send({'password' : 'invalid'});
                req.expect(403);
                req.end(done);
            });

            it('should login with valid id and password', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/auth');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({'email' : 'user1@user.com'});
                req = req.send({'password' : '1234'});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('token');
                });
                req.end(done);
            });
        });
    });

    describe('recharge', function () {
        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            Team.remove(done);
        });

        before(function (done) {
            Bet.remove(done);
        });

        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
            user.save(done);
        });

        before(function (done) {
            otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
            otherUser.save(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'edition' : 2014});
            req.end(done);
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
            req = req.send({'name' : 'fluminense'});
            req = req.send({'picture' : 'http://pictures.com/fluminense.png'});
            req.end(done);
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
            req = req.send({'name' : 'botafogo'});
            req = req.send({'picture' : 'http://pictures.com/botafogo.png'});
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/recharge');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with other user token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/recharge');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req.expect(405);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/invalid/recharge');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should recharge', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/user/recharge');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('funds').be.equal(100);
                response.body.should.have.property('stake').be.equal(0);
            });
            req.end(done);
        });
    });
});