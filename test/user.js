/*globals describe, before, it, after*/
require('should');
var supertest, app, auth, nock,
User, Championship, Team, Match, Bet,
user, otherUser;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
nock = require('nock');
User = require('../models/user');
Championship = require('../models/championship');
Team = require('../models/team');
Match = require('../models/match');
Bet = require('../models/bet');

nock('https://graph.facebook.com').get('/me?access_token=1234').times(Infinity).reply(200, {'id' : '111'});
nock('https://graph.facebook.com').get('/me?access_token=invalid').times(Infinity).reply(404, {});
nock('https://mandrillapp.com').post('/api/1.0/messages/send.json').times(Infinity).reply(200, {});
nock('http://freegeoip.net').get('/json/127.0.0.1').times(Infinity).reply(200, {'country_name' : 'Brazil'});

describe('user controller', function () {
    'use strict';

    describe('create', function () {
        before(function (done) {
            User.remove(done);
        });

        it('should raise error without password', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('password').be.equal('required');
            });
            request.end(done);
        });

        it('should create', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'password' : '1234'});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('me');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            request.end(done);
        });

        describe('with registered email', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'email' : 'test@test.com'});
                request.end(done);
            });

            it('should raise error with repeated email', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'email' : 'test@test.com'});
                request.expect(409);
                request.end(done);
            });
        });

        describe('with registered username', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'username' : 'test'});
                request.end(done);
            });

            it('should raise error with repeated username', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'username' : 'test'});
                request.expect(409);
                request.end(done);
            });
        });

        describe('with registered facebookId', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('facebook-token', '1234');
                request.send({'password' : '1234'});
                request.end(done);
            });

            it('should raise error with repeated facebookId', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('facebook-token', '1234');
                request.send({'password' : '1234'});
                request.expect(409);
                request.end(done);
            });
        });

        describe('with registered username', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'username' : 'test'});
                request.end(done);
            });

            it('should raise error with repeated username', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.send({'username' : 'test'});
                request.expect(409);
                request.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'password' : '1234'});
            request.end(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'password' : '1234'});
            request.send({'email' : 'user1@user.com'});
            request.send({'username' : 'user1'});
            request.end(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('facebook-token', '1234');
            request.send({'password' : '1234'});
            request.send({'username' : 'user2'});
            request.end(done);
        });

        before(function (done) {
            var featured;
            featured = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user', 'featured' : true});
            featured.save(done);
        });

        it('should filter by featured', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'featured' : true});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user');
            });
            request.end(done);
        });

        it('should filter by facebookId', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'facebookIds' : ['111']});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user2');
            });
            request.end(done);
        });

        it('should filter by email', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'emails' : ['user1@user.com']});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user1');
            });
            request.end(done);
        });

        it('should filter by username', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'usernames' : ['user1']});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body[0].should.have.property('slug').be.equal('user1');
            });
            request.end(done);
        });

        it('should filter by facebookId and email', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'facebookIds' : ['111']});
            request.send({'emails' : ['user1@user.com']});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(2);
            });
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
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
        var user;

        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            user = new User({'password' : '1234', 'type' : 'admin'});
            user.save(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'password' : '1234'});
            request.send({'email' : 'user1@user.com'});
            request.send({'username' : 'user1'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user1');
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
            request = request.get('/users/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should show my account searching by me', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/me');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            request.end(done);
        });

        it('should show', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/user1');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('user1');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            request.end(done);
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
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'password' : '1234'});
            request.send({'email' : 'user1@user.com'});
            request.send({'username' : 'user1'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/me');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with other user token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/user1');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(405);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should update', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/users/me');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'password' : '1234'});
            request.send({'email' : 'user2@user.com'});
            request.send({'username' : 'user2'});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('user2');
                response.body.should.have.property('username').be.equal('user2');
                response.body.should.have.property('email').be.equal('user2@user.com');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            request.end(done);
        });

        after(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/me');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('user2');
                response.body.should.have.property('username').be.equal('user2');
                response.body.should.have.property('email').be.equal('user2@user.com');
                response.body.should.have.property('verified').be.equal(false);
                response.body.should.have.property('featured').be.equal(false);
            });
            request.end(done);
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
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'password' : '1234'});
            request.send({'email' : 'user1@user.com'});
            request.send({'username' : 'user1'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/me');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with other user token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/user1');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(405);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/users/invalid');
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
            request = request.del('/users/me');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(204);
            request.end(done);
        });
    });

    describe('login', function () {
        describe('anonymous user', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.end(done);
            });

            it('should raise error with invalid password', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : 'invalid'});
                request.expect(403);
                request.end(done);
            });

            it('should login with valid password', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'password' : '1234'});
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('token');
                });
                request.end(done);
            });
        });

        describe('facebook user', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('facebook-token', '1234');
                request.send({'password' : '1234'});
                request.end(done);
            });

            it('should raise error with invalid facebook token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('facebook-token', 'invalid');
                request.expect(403);
                request.end(done);
            });

            it('should login with valid facebook token', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('facebook-token', '1234');
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('token');
                });
                request.end(done);
            });
        });

        describe('registred user', function () {
            before(function (done) {
                User.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/users');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('facebook-token', '1234');
                request.send({'password' : '1234'});
                request.send({'email' : 'user1@user.com'});
                request.send({'name' : 'user1'});
                request.send({'password' : '1234'});
                request.end(done);
            });

            it('should raise error with invalid password', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'email' : 'user1@user.com'});
                request.send({'password' : 'invalid'});
                request.expect(403);
                request.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'email' : 'invalid'});
                request.send({'password' : '1234'});
                request.expect(403);
                request.end(done);
            });

            it('should raise error with invalid id and password', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'email' : 'invalid'});
                request.send({'password' : 'invalid'});
                request.expect(403);
                request.end(done);
            });

            it('should login with valid id and password', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.get('/users/me/auth');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.send({'email' : 'user1@user.com'});
                request.send({'password' : '1234'});
                request.expect(200);
                request.expect(function (response) {
                    response.body.should.have.property('token');
                });
                request.end(done);
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
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.send({'country' : 'brasil'});
            request.send({'edition' : 2014});
            request.end(done);
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
            request.send({'name' : 'fluminense'});
            request.send({'picture' : 'http://pictures.com/fluminense.png'});
            request.end(done);
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
            request.send({'name' : 'botafogo'});
            request.send({'picture' : 'http://pictures.com/botafogo.png'});
            request.end(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.end(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'bid' : 50});
            request.send({'result' : 'draw'});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/recharge');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with other user token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/recharge');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(otherUser));
            request.expect(405);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/invalid/recharge');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should recharge', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/users/user/recharge');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('funds').be.equal(100);
                response.body.should.have.property('stake').be.equal(0);
            });
            request.end(done);
        });
    });

    describe('password recovery', function () {
        var user;

        before(function (done) {
            User.remove(done);
        });

        before(function (done) {
            user = new User({'password' : '1234', 'type' : 'admin', 'email' : 'user1@user.com'});
            user.save(done);
        });

        it('should raise error with invalid email', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/me/forgot-password');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should send', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/users/me/forgot-password');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'email' : 'user1@user.com'});
            request.expect(200);
            request.end(done);
        });
    });
});