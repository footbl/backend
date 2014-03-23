var request, app, mongoose, auth, nconf;

require('should');

request  = require('supertest');
app      = require('../index.js');
mongoose = require('mongoose');
nconf    = require('nconf');
auth     = require('../lib/auth');

beforeEach(function (done) {
    mongoose.connect(nconf.get('mongo-uri'), function () {
        mongoose.connection.db.dropDatabase(done);
    });
});

describe('session controller', function () {
    'use strict';

    describe('signup', function () {
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

    describe('signin', function () {
        var _id, password;

        password = '1234';

        beforeEach(function (done) {
            request(app).post('/users').send(auth.credentials()).send({'password' : password}).expect(function (response) {
                _id = response.body._id
            }).end(done);
        });

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

        it('should signin valid credentials', function (done) {
            request(app).get('/users/me/session').send(auth.credentials()).send({
                'password' : password,
                '_id'      : _id
            }).expect(200).expect(function (response) {
                response.body.should.have.property('token');
            }).end(done);
        });
    });
});
