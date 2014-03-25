var request, app, mongoose, auth, nconf, User, user;

require('should');

request  = require('supertest');
app      = require('../index.js');
mongoose = require('mongoose');
nconf    = require('nconf');
auth     = require('../lib/auth');
User     = require('../models/user');

describe('user controller', function () {
    'use strict';

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    describe('create', function () {
        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.transactionId = null;

                req = req.post('/users');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.timestamp = null;

                req = req.post('/users');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without signature', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.signature = null;

                req = req.post('/users');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.signature = auth.credentials().signature;

                req = req.post('/users');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });
        });

        it('should raise error without password', function (done) {
            var req = request(app);
            req = req.post('/users');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials and password', function (done) {
            var req = request(app);
            req = req.post('/users');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({password : '1234'});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
            });
            req.end(done);
        });
    });

    describe('search', function () {
        it('should list with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/users');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (team) {
                    team.should.have.property('_id');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/users');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error with invalid user id', function (done) {
            var req = request(app);
            req = req.get('/users/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/users/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
            });
            req.end(done);
        });
    });

    describe('signin', function () {
        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.transactionId = null;

                req = req.get('/users/me/session');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.timestamp = null;

                req = req.get('/users/me/session');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error without signature', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.signature = null;

                req = req.get('/users/me/session');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data = auth.credentials();
                var req  = request(app);
                data.signature = auth.credentials().signature;

                req = req.get('/users/me/session');
                req = req.send(data);
                req = req.expect(401);
                req.end(done);
            });
        });

        it('should signin with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/users/me/session');
            req = req.send(auth.credentials());
            req = req.send({'password' : '1234', '_id' : user._id});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('token');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/users');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/users/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({password : '1234', username : 'test'});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error without password', function (done) {
            var req = request(app);
            req = req.put('/users/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({username : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should update username', function (done) {
            var req = request(app);
            req = req.put('/users/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({username : 'test', password : '1234'});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('username').be.equal('test');
            });
            req.end(done);
        });
    });
});
