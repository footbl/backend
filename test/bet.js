var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match,
    user, guest, visitor, championship, match, otherMatch;

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

before(function (done) {
    mongoose.connect(nconf.get('MONGOHQ_URL'), function () {
        mongoose.connection.db.dropDatabase(done);
    });
});

describe('bet controller', function () {
    'use strict';

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    before(function (done) {
        guest = new Team({'name' : 'guest', 'picture' : 'guest_picture'});
        guest.save(done);
    });

    before(function (done) {
        visitor = new Team({'name' : 'visitor', 'picture' : 'visitor_picture'});
        visitor.save(done);
    });

    before(function (done) {
        championship = new Championship({'name' : 'championship'});
        championship.save(done);
    });

    before(function (done) {
        match = new Match({'guest' : guest._id, 'visitor' : visitor._id, 'date' : new Date(), 'championship' : championship._id});
        match.save(done);
    });

    before(function (done) {
        otherMatch = new Match({'guest' : guest._id, 'visitor' : visitor._id, 'date' : new Date(), 'championship' : championship._id});
        otherMatch.save(done);
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

        it('should create with valid credentials, date, result and bid', function (done) {
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

        it('should raise error with repeated bet', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with insufficient funds', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + otherMatch._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 70});
            req = req.expect(500);
            req.end(done);
        });
    });

    describe('list', function () {
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
                response.body.every(function (team) {
                    team.should.have.property('_id');
                    team.should.have.property('date');
                    team.should.have.property('result');
                    team.should.have.property('bid');
                    team.should.have.property('match');
                    team.should.have.property('user');
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
            req = req.expect(200);
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
                response.body.should.have.property('match');
                response.body.should.have.property('user');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
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
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), result : 'visitor', bid : 25});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({result : 'visitor', bid : 25});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without result', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), bid : 25});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid result', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'invalid', bid : 25});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without bid', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'visitor'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'visitor', bid : 25});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/bets/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'visitor', bid : 25});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('result').be.equal('visitor');
                response.body.should.have.property('bid').be.equal(25);
                response.body.should.have.property('match');
                response.body.should.have.property('user');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
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
