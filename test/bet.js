/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match, Wallet,
    user, guest, host, championship, otherChampionship, match, otherMatch, otherMatchSameChampionship, wallet, otherWallet;

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


describe('bet', function () {
    'use strict';

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
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
        otherChampionship = new Championship({'name' : 'championship'});
        otherChampionship.save(done);
    });

    before(function (done) {
        match = new Match({'guest' : guest._id, 'host' : host._id, 'date' : new Date(), 'championship' : championship._id, round : 1});
        match.save(done);
    });

    before(function (done) {
        otherMatchSameChampionship = new Match({'guest' : guest._id, 'host' : host._id, 'date' : new Date(), 'championship' : championship._id, round : 1});
        otherMatchSameChampionship.save(done);
    });

    before(function (done) {
        otherMatch = new Match({'guest' : guest._id, 'host' : host._id, 'date' : new Date(), 'championship' : otherChampionship._id, round : 1});
        otherMatch.save(done);
    });

    before(function (done) {
        wallet = new Wallet({user : user._id, championship : championship._id});
        wallet.save(done);
    });

    before(function (done) {
        otherWallet = new Wallet({user : user._id, championship : otherChampionship._id});
        otherWallet.save(done);
    });

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/invalid/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({result : 'draw', bid : 50});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without result', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), bid : 50});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid result', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'invalid', bid : 50});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without bid', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw'});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, match, date, result and bid', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('result');
                response.body.should.have.property('bid');
            });
            req.end(done);
        });

        it('should raise error with insufficient funds', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + otherMatchSameChampionship._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 70});
            req = req.expect(500);
            req.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list valid credentials', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (bet) {
                    bet.should.have.property('_id');
                    bet.should.have.property('date');
                    bet.should.have.property('result');
                    bet.should.have.property('bid');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('result');
                response.body.should.have.property('bid');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets/');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'host', bid : 5});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({result : 'host', bid : 5});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without result', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), bid : 5});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid result', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'invalid', bid : 5});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without bid', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'host'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without bid greater than sufficient funds', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'host', bid : 110});
            req = req.expect(500);
            req.end(done);
        });

        it('should update with valid credentials, date, result and bid', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'host', bid : 5});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('result').be.equal('host');
                response.body.should.have.property('bid').be.equal(5);
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets/');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + match._id + '/bets/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req.end(done);
        });
    });
});
