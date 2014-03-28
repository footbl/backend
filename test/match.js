var request, app, mongoose, auth, nconf,
    User, Team, Championship,
    user, otherUser, guest, host, championship;

require('should');

request      = require('supertest');
app          = require('../index.js');
mongoose     = require('mongoose');
nconf        = require('nconf');
auth         = require('../lib/auth');
User         = require('../models/user');
Team         = require('../models/team');
Championship = require('../models/championship');

before(function (done) {
    mongoose.connect(nconf.get('MONGOHQ_URL'), function () {
        mongoose.connection.db.dropDatabase(done);
    });
});

describe('match controller', function () {
    'use strict';

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    before(function (done) {
        otherUser = new User({'password' : '12345', 'type' : 'admin'});
        otherUser.save(done);
    });

    before(function (done) {
        guest = new Team({'name' : 'guest', 'picture' : 'guest_picture'});
        guest.save(done);
    });

    before(function (done) {
        host = new Team({'name' : 'host', 'picture' : 'visitor_picture'});
        host.save(done);
    });

    before(function (done) {
        championship = new Championship({'name' : 'championship'});
        championship.save(done);
    });

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req = request(app);
            req = req.post('/championships/invalid/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({host : host._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without host', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, date, championship, guest, host', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('host');
                response.body.should.have.property('date');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (team) {
                    team.should.have.property('_id');
                    team.should.have.property('championship');
                    team.should.have.property('guest');
                    team.should.have.property('host');
                    team.should.have.property('date');
                    team.should.have.property('result');
                    team.should.have.property('finished');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('host');
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
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), result : 'draw', bid : 50});
            req.end(done);
        });

        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.send({date : new Date(), result : 'host', bid : 50});
            req.end(done);
        });

        after(function (done) {
            var req = request(app);
            req = req.get('/users/' + user._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body[0].should.have.property('reward').be.equal(100);
            });
            req.end(done);
        });

        after(function (done) {
            var req = request(app);
            req = req.get('/users/' + otherUser._id + '/bets');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body[0].should.have.property('reward').be.equal(0);
            });
            req.end(done);
        });

        it('should finish match', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id + '/finish');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('finished').be.equal(true);
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({host : host._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without host', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date(), result : {guest : 0, host : 1}});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('host');
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
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, host : host._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req.end(done);
        });
    });
});
