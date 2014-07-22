/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf,
User, Team, Championship, Match, Wallet, Group, Comment, CreditRequest,
user, otherUser, guest, host, championship, wallet, otherWallet, match;

require('should');

request       = require('supertest');
app           = require('../index.js');
mongoose      = require('mongoose');
nconf         = require('nconf');
auth          = require('../lib/auth');

User          = require('../models/user');
Team          = require('../models/team');
Championship  = require('../models/championship');
Match         = require('../models/match');
Wallet        = require('../models/wallet');
Group         = require('../models/group');
Comment       = require('../models/comment');
CreditRequest = require('../models/credit-request');

describe('comment controller', function () {
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

    before(function (done) {
        otherUser = new User({'password' : '1234', 'type' : 'admin'});
        otherUser.save(done);
    });

    before(function (done) {
        guest = new Team({'name' : 'guest', 'picture' : 'http://guest_picture.com'});
        guest.save(done);
    });

    before(function (done) {
        host = new Team({'name' : 'host', 'picture' : 'http://visitor_picture.com'});
        host.save(done);
    });

    before(function (done) {
        championship = new Championship({'name' : 'championship'});
        championship.save(done);
    });

    before(function (done) {
        wallet = new Wallet({user : user._id, championship : championship._id});
        wallet.save(done);
    });

    before(function (done) {
        otherWallet = new Wallet({user : otherUser._id, championship : championship._id});
        otherWallet.save(done);
    });

    before(function (done) {
        match = new Match({'guest' : guest._id, 'host' : host._id, 'date' : new Date(), 'championship' : championship._id, round : 1});
        match.save(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({date : new Date(), result : 'draw', bid : 50});
        req.end(done);
    });

    describe('create', function () {
        before(function (done) {
            CreditRequest.remove(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/' + user._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({value: 10, creditor : otherUser._id});
            req = req.expect(401);
            req.end(done);
        });

        it('should create', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/' + user._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({value: 10, creditor : otherUser._id});
            req = req.expect(201);
            req.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            CreditRequest.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/' + user._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({value: 10, creditor : otherUser._id});
            req = req.expect(201);
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/' + user._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.expect(401);
            req.end(done);
        });

        it('should list', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/' + user._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(1);
            });
            req.end(done);
        });

        it('should list for requestes user', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/' + otherUser._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(1);
            });
            req.end(done);
        });
    });

    describe('pay', function () {
        var id;

        before(function (done) {
            CreditRequest.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/users/' + user._id + '/credit-requests');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({value: 10, creditor : otherUser._id});
            req = req.expect(201);
            req = req.expect(function (response) {
                id = response.body._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/' + user._id + '/credit-requests/' + id + '/pay');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.expect(401);
            req.end(done);
        });

        it('should pay', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/users/' + user._id + '/credit-requests/' + id + '/pay');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req = req.expect(200);
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/users/' + user._id + '/wallets/' + wallet._id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('funds').be.equal(100);
                response.body.should.have.property('stake');
            });
            req.end(done);
        });
    });
});
