/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf, crypto,
    User, Team, Championship, Match, Wallet, Group, Comment,
    user, otherUser;

require('should');

request  = require('supertest');
app      = require('../index.js');
mongoose = require('mongoose');
nconf    = require('nconf');
crypto   = require('crypto');
auth     = require('../lib/auth');

User         = require('../models/user');
Team         = require('../models/team');
Championship = require('../models/championship');
Match        = require('../models/match');
Wallet       = require('../models/wallet');
Group        = require('../models/group');
Comment      = require('../models/comment');

describe('user controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        Team.remove(done);
    });

    before(function (done) {
        Championship.remove(done);
    });

    before(function (done) {
        Match.remove(done);
    });

    before(function (done) {
        Wallet.remove(done);
    });

    before(function (done) {
        Group.remove(done);
    });

    before(function (done) {
        Comment.remove(done);
    });

    before(function (done) {
        user = new User({'password' : crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex'), 'type' : 'admin'});
        user.save(done);
    });

    before(function (done) {
        otherUser = new User({'password' : crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex'), 'type' : 'admin'});
        otherUser.save(done);
    });

    describe('create', function () {
        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without timestamp', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without signature', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users');
                req = req.set('auth-signature', auth.credentials().signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });
        });

        it('should raise error without password', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(500);
            req = req.expect(function (response) {
                response.body[0].should.be.equal('password is required');
            });
            req.end(done);
        });

        it('should create with valid credentials and password', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({password : '1234'});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
            });
            req.end(done);
        });
    });

    describe('search', function () {
        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.expect(401);
            req.end(done);
        });

        it('should list with valid credentials', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (user) {
                    user.should.have.property('_id');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
            });
            req.end(done);
        });
    });

    describe('signin', function () {
        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/session');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without timestamp', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/session');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without signature', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/session');
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me/session');
                req = req.set('auth-signature', auth.credentials().signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });
        });

        it('should signin with valid credentials', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/me/session');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'password' : '1234', '_id' : user._id});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('token');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/' + user._id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({username : 'test', password : '1234'});
            req = req.expect(401);
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
            req = req.send({password : '1234', username : 'test'});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error without password', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/' + user._id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({username : 'test'});
            req = req.expect(500);
            req = req.expect(function (response) {
                response.body[0].should.be.equal('password is required');
            });
            req.end(done);
        });

        it('should update username', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/' + user._id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({username : 'test', password : '1234'});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('username').be.equal('test');
            });
            req.end(done);
        });
    });

    describe('starred', function () {
        describe('create', function () {
            it('should raise error without token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users/' + user._id + '/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.send({user : otherUser._id});
                req = req.expect(401);
                req.end(done);
            });

            it('should create', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users/' + user._id + '/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({user : otherUser._id});
                req = req.expect(201);
                req.end(done);
            });

            it('should raise error with repeated starred', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/users/' + user._id + '/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({user : otherUser._id});
                req = req.expect(500);
                req = req.expect(function (response) {
                    response.body[0].should.be.equal('duplicated');
                });
                req.end(done);
            });
        });

        describe('list', function () {
            it('should raise error without token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/' + user._id + '/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/invalid/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.expect(404);
                req.end(done);
            });

            it('should list with valid credentials', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/' + user._id + '/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.expect(200);
                req = req.expect(function (response) {
                    response.body.should.be.instanceOf(Array);
                    response.body.every(function (starred) {
                        starred.should.have.property('_id');
                    });
                });
                req.end(done);
            });
        });

        describe('delete', function () {
            var id;

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/' + user._id + '/starred');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.expect(200);
                req = req.expect(function (response) {
                    id = response.body[0]._id;
                });
                req.end(done);
            });

            it('should raise error without token', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.del('/users/' + user._id + '/starred/' + id);
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error with invalid id', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.del('/users/' + user._id + '/starred/invalid');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.expect(404);
                req.end(done);
            });

            it('should delete', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.del('/users/' + user._id + '/starred/' + id);
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.expect(200);
                req.end(done);
            });
        });
    });
});
