var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match, Wallet,
    user, guest, host, championship, otherChampionship, match, otherMatch, otherMatchSameChampionship;

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

before(function (done) {
    mongoose.connect(nconf.get('MONGOHQ_URL'), function () {
        mongoose.connection.db.dropDatabase(done);
    });
});

describe('wallet controller', function () {
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

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.post('/wallets');
            req = req.send(auth.credentials());
            req = req.send({championship : championship._id});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without championship', function (done) {
            var req = request(app);
            req = req.post('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials and championship', function (done) {
            var req = request(app);
            req = req.post('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : championship._id});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('user');
                response.body.should.have.property('active');
                response.body.should.have.property('funds');
                response.body.should.have.property('stake');
            });
            req.end(done);
        });

        it('should raise error with repeated wallet', function (done) {
            var req = request(app);
            req = req.post('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : championship._id});
            req = req.expect(500);
            req.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            var req = request(app);
            req = req.post('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : championship._id});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/wallets');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list valid credentials', function (done) {
            var req = request(app);
            req = req.get('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (team) {
                    team.should.have.property('_id');
                    team.should.have.property('championship');
                    team.should.have.property('user');
                    team.should.have.property('active');
                    team.should.have.property('funds');
                    team.should.have.property('stake');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/wallets/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/wallets/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/wallets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('user');
                response.body.should.have.property('active');
                response.body.should.have.property('funds');
                response.body.should.have.property('stake');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.put('/wallets/' + id);
            req = req.send(auth.credentials());
            req = req.send({active : false});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without active', function (done) {
            var req = request(app);
            req = req.put('/wallets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/wallets/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test1', picture : 'test1'});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/wallets/' + id);
            req = req.send({token : auth.token(user)});
            req = req.send(auth.credentials());
            req = req.send({active : false});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('user');
                response.body.should.have.property('active').be.equal(false);
                response.body.should.have.property('funds');
                response.body.should.have.property('stake');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/wallets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.del('/wallets/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.del('/wallets/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req = request(app);
            req = req.del('/wallets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req.end(done);
        });
    });
});
