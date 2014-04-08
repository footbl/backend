var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match,
    user, otherUser, friendUser, guest, host, championship, otherChampionship, match, otherMatch, otherMatchSameChampionship;

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
        otherUser = new User({'password' : '1234', 'type' : 'admin'});
        otherUser.save(done);
    });

    before(function (done) {
        friendUser = new User({'password' : '1234', 'type' : 'admin'});
        friendUser.save(done);
    });

    before(function (done) {
        user.starred.push(friendUser._id);
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
            req = req.expect(404);
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
            req = req.post('/championships/' + championship._id + '/matches/' + otherMatchSameChampionship._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 70});
            req = req.expect(500);
            req.end(done);
        });

        after(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('pot').with.property('draw').be.equal(50);
            });
            req.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.send({date : new Date(), result : 'draw', bid : 70});
            req.end(done);
        });

        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(friendUser)});
            req = req.send({date : new Date(), result : 'draw', bid : 70});
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
                response.body.should.be.instanceOf(Array).with.lengthOf(3);
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

        it('should filter friends comments', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({filterByFriends : true});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(1);
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

        it('should filter unknown person comments', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({filterByFriends : false});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(2);
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

    describe('list user bets', function () {
        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + otherChampionship._id + '/matches/' + otherMatch._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 10});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/users/' + user._id + '/bets');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list only championship matches with filter', function (done) {
            var req = request(app);
            req = req.get('/users/' + user._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : championship._id});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
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

        it('should list all bets without filter', function (done) {
            var req = request(app);
            req = req.get('/users/' + user._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(2);
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
