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

describe('team controller', function () {
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
            var req = request(app);
            req = req.post('/teams');
            req = req.send(auth.credentials());
            req = req.send({name : 'test', picture : 'test'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req = request(app);
            req = req.post('/teams');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({picture : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without picture', function (done) {
            var req = request(app);
            req = req.post('/teams');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, name, picture', function (done) {
            var req = request(app);
            req = req.post('/teams');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test', picture : 'http://test.com'});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('name');
                response.body.should.have.property('picture');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/teams');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/teams');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (team) {
                    team.should.have.property('_id');
                    team.should.have.property('name');
                    team.should.have.property('picture');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/teams');
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
            req = req.get('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/teams/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('name');
                response.body.should.have.property('picture');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/teams');
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
            req = req.put('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.send({name : 'test1', picture : 'test1'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req = request(app);
            req = req.put('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({picture : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without picture', function (done) {
            var req = request(app);
            req = req.put('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/teams/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test1', picture : 'test1'});
            req = req.expect(404);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test1', picture : 'http://test.com/1'});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('name').be.equal('test1');
                response.body.should.have.property('picture').be.equal('http://test.com/1');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/teams');
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
            req = req.del('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.del('/teams/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req = request(app);
            req = req.del('/teams/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req.end(done);
        });
    });
});
