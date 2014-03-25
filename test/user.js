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
                var data  = auth.credentials();
                data.transactionId = null;
                request(app).post('/users').send(data).expect(401).end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data  = auth.credentials();
                data.timestamp = null;
                request(app).post('/users').send(data).expect(401).end(done);
            });

            it('should raise error without signature', function (done) {
                var data  = auth.credentials();
                data.signature = null;
                request(app).post('/users').send(data).expect(401).end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).post('/users').send(data).expect(401).end(done);
            });
        });

        it('should raise error without password', function (done) {
            request(app).post('/users').send(auth.credentials()).expect(500).end(done);
        });

        it('should create with valid credentials and password', function (done) {
            request(app).post('/users').send(auth.credentials()).send({password : 'random password'}).expect(201).expect(function (response) {
                response.body.should.have.property('_id');
            }).end(done);
        });
    });

    describe('search', function () {
        describe('without filter', function () {
            it('should return all users', function (done) {
                request(app).get('/users').send(auth.credentials()).send({token : auth.token(user)}).expect(200).expect(function (response) {
                    response.body.should.be.instanceOf(Array);
                }).end(done);
            });
        });

        describe('filter by ids', function () {
            it('should return the filtered user', function (done) {
                request(app).get('/users').send(auth.credentials()).send({token : auth.token(user)}).send({ids : [user._id]}).expect(200).expect(function (response) {
                    response.body.should.be.instanceOf(Array).and.have.lengthOf(1);
                }).end(done);
            });
        });
    });

    describe('details', function () {
        it('should raise error with invalid user id', function (done) {
            request(app).get('/users/invalid').send(auth.credentials()).send({token : auth.token(user)}).expect(404).end(done);
        });

        it('should return', function (done) {
            request(app).get('/users/' + user._id).send(auth.credentials()).send({token : auth.token(user)}).expect(200).expect(function (response) {
                response.body.should.have.property('_id');
            }).end(done);
        });
    });

    describe('signin', function () {
        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var data  = auth.credentials();
                data.transactionId = null;
                request(app).get('/users/me/session').send(data).expect(401).end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data  = auth.credentials();
                data.timestamp = null;
                request(app).get('/users/me/session').send(data).expect(401).end(done);
            });

            it('should raise error without signature', function (done) {
                var data  = auth.credentials();
                data.signature = null;
                request(app).get('/users/me/session').send(data).expect(401).end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).get('/users/me/session').send(data).expect(401).end(done);
            });
        });

        it('should signin with valid credentials', function (done) {
            request(app).get('/users/me/session').send(auth.credentials()).send({'password' : '1234', '_id' : user._id}).expect(200).expect(function (response) {
                response.body.should.have.property('token');
            }).end(done);
        });
    });

    describe('update', function () {
        it('should raise error with invalid user id', function (done) {
            request(app).put('/users/invalid').send(auth.credentials()).send({token : auth.token(user)}).expect(404).end(done);
        });

        it('should raise error without password', function (done) {
            request(app).put('/users/' + user._id).send(auth.credentials()).send({token : auth.token(user)}).expect(500).end(done);
        });

        it('should update username', function (done) {
            request(app).put('/users/' + user._id).send(auth.credentials()).send({token : auth.token(user)}).send({password : '1234', username : 'test'}).expect(200).expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('username').be.equal('test');
            }).end(done);
        });
    });
});
