/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match, Wallet, Group, Comment,
    user;

require('should');

request  = require('supertest');
app      = require('../index.js');
mongoose = require('mongoose');
nconf    = require('nconf');
auth     = require('../lib/auth');

User         = require('../models/user');
Team         = require('../models/team');
Championship = require('../models/championship');
Match        = require('../models/match');
Wallet       = require('../models/wallet');
Group        = require('../models/group');
Comment      = require('../models/comment');

describe('championship controller', function () {
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
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({name : 'test'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(500);
            req = req.expect(function (response) {
                response.body[0].should.be.equal('name is required');
            });
            req.end(done);
        });

        it('should create with valid credentials and name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({name : 'test'});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('name');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.expect(401);
            req.end(done);
        });

        it('should list valid credentials', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (championship) {
                    championship.should.have.property('_id');
                    championship.should.have.property('name');
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
            req = req.get('/championships');
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
            req = req.get('/championships/' + id);
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
            req = req.get('/championships/invalid');
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
            req = req.get('/championships/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('name');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships');
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
            req = req.put('/championships/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({name : 'test1'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(500);
            req = req.expect(function (response) {
                response.body[0].should.be.equal('name is required');
            });
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({name : 'test1'});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({name : 'test1'});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('name').be.equal('test1');
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
            req = req.get('/championships');
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
            req = req.del('/championships/' + id);
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
            req = req.del('/championships/invalid');
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
            req = req.del('/championships/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req.end(done);
        });
    });
});
