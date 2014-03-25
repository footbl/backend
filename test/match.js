var request, app, mongoose, auth, nconf,
    User, Team, Championship,
    user, guest, visitor, championship;

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

    describe('create', function () {
        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, visitor : visitor._id});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req = request(app);
            req = req.post('/championships/invalid/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({visitor : visitor._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without visitor', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, date, championship, guest, visitor', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('visitor');
                response.body.should.have.property('date');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        it('should list valid credentials', function (done) {
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
                    team.should.have.property('visitor');
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
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
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
                response.body.should.have.property('visitor');
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
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
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
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, visitor : visitor._id});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({visitor : visitor._id, date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without visitor', function (done) {
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
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('guest');
                response.body.should.have.property('visitor');
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
            req = req.send({guest : guest._id, visitor : visitor._id, date : new Date()});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
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
