/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match, Wallet, Group, Comment,
    user, otherUser, guest, host, championship, wallet, otherWallet;

require('should');

request      = require('supertest');
app          = require('../index.js');
mongoose     = require('mongoose');
nconf        = require('nconf');
auth         = require('../lib/auth');

User         = require('../models/user');
Team         = require('../models/team');
Championship = require('../models/championship');
Match        = require('../models/match');
Wallet       = require('../models/wallet');
Group        = require('../models/group');
Comment      = require('../models/comment');

describe('match controller', function () {
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
        otherUser = new User({'password' : '12345', 'type' : 'admin'});
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

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({guest : guest._id, host : host._id, date : new Date(), round : 1});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/invalid/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date(), round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({host : host._id, date : new Date(), round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without host', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, date : new Date(), round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, date, championship, guest, host and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date(), round : 1});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('host');
                response.body.should.have.property('round');
                response.body.should.have.property('date');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
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
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (match) {
                    match.should.have.property('_id');
                    match.should.have.property('championship');
                    match.should.have.property('guest');
                    match.should.have.property('host');
                    match.should.have.property('round');
                    match.should.have.property('date');
                    match.should.have.property('result');
                    match.should.have.property('finished');
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
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
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
            req = req.get('/championships/' + championship._id + '/matches/' + id);
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
            req = req.get('/championships/' + championship._id + '/matches/invalid');
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
            req = req.get('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('host');
                response.body.should.have.property('round');
                response.body.should.have.property('date');
                response.body.should.have.property('result');
                response.body.should.have.property('finished');
            });
            req.end(done);
        });
    });

    describe('finish', function () {
        var id;

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date(), round : 1});
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + id + '/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req.end(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + id + '/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req = req.send({date : new Date(), result : 'host', bid : 50});
            req.end(done);
        });

        it('should finish match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id + '/finish');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('finished').be.equal(true);
            });
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/wallets/' + wallet._id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('funds').be.equal(150);
                response.body.should.have.property('stake').be.equal(0);
                response.body.should.have.property('toReturn').be.equal(0);
            });
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/wallets/' + otherWallet._id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(otherUser));
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('funds').be.equal(50);
                response.body.should.have.property('stake').be.equal(0);
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
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
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
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({guest : guest._id, host : host._id, date : new Date(), round : 1});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({host : host._id, date : new Date(), round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without host', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, date : new Date(), round : 1});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date(), result : {guest : 0, host : 1}, round : 1});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('host');
                response.body.should.have.property('round');
                response.body.should.have.property('date');
                response.body.should.have.property('result');
                response.body.should.have.property('finished');
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
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
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
            req = req.del('/championships/' + championship._id + '/matches/' + id);
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
            req = req.del('/championships/' + championship._id + '/matches/invalid');
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
            req = req.del('/championships/' + championship._id + '/matches/' + id);
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.expect(200);
            req.end(done);
        });
    });
});
