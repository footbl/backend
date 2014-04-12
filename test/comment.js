/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match,
    user, otherUser, friendUser, guest, host, championship, match;

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
    'use strict';

    mongoose.connect(nconf.get('MONGOHQ_URL'), function () {
        mongoose.connection.db.dropDatabase(done);
    });
});

describe('comment controller', function () {
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
        match = new Match({'guest' : guest._id, 'host' : host._id, 'date' : new Date(), 'championship' : championship._id, round : 1});
        match.save(done);
    });

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), message : 'good match!'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/invalid/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), message : 'good match!'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({message : 'good match!'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without message', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, date and message', function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), message : 'good match!'});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('message');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.send({date : new Date(), message : 'good match!'});
            req.end(done);
        });

        before(function (done) {
            var req = request(app);
            req = req.post('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(friendUser)});
            req = req.send({date : new Date(), message : 'good match!'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list without filter', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(3);
                response.body.every(function (comment) {
                    comment.should.have.property('_id');
                    comment.should.have.property('date');
                    comment.should.have.property('message');
                    comment.should.have.property('user');
                });
            });
            req.end(done);
        });

        it('should filter friends comments', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({filterByFriends : true});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(1);
                response.body.every(function (team) {
                    team.should.have.property('_id');
                    team.should.have.property('date');
                    team.should.have.property('message');
                    team.should.have.property('user');
                });
            });
            req.end(done);
        });

        it('should filter unknown person comments', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({filterByFriends : false});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(2);
                response.body.every(function (team) {
                    team.should.have.property('_id');
                    team.should.have.property('date');
                    team.should.have.property('message');
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
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
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
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('message');
                response.body.should.have.property('user');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
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
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.send({date : new Date(), message : 'good match edited!'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({message : 'good match edited!'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without message', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date()});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/comments/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), message : 'good match edited!'});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({date : new Date(), message : 'good match edited!'});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('date');
                response.body.should.have.property('message').be.equal('good match edited!');
                response.body.should.have.property('user');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/championships/' + championship._id + '/matches/' + match._id + '/comments');
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
            req = req.del('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + match._id + '/comments/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req = request(app);
            req = req.del('/championships/' + championship._id + '/matches/' + match._id + '/comments/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req.end(done);
        });
    });
});
