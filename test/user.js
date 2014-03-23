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

function createUser (done) {
    request(app).post('/users').send(auth.credentials()).send({'password' : 'random password'}).expect(201).end(done);
}

describe('user controller', function () {
    'use strict';

    var token;

    beforeEach(function (done) {
        var _id;

        request(app).post('/users').send(auth.credentials()).send({'password' : '1234'}).expect(function (response) {
            _id = response.body._id;
        }).end(function () {
            request(app).get('/users/me/session').send(auth.credentials()).send({
                'password' : '1234',
                '_id'      : _id
            }).expect(200).expect(function (response) {
                token = response.body.token;
            }).end(done);
        });
    });

    describe('search', function () {
        beforeEach(createUser);
        beforeEach(createUser);
        beforeEach(createUser);
        beforeEach(createUser);

        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var data  = auth.credentials();
                data.transactionId = null;
                request(app).get('/users').send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data  = auth.credentials();
                data.timestamp = null;
                request(app).get('/users').send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error without signature', function (done) {
                var data  = auth.credentials();
                data.signature = null;
                request(app).get('/users').send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).get('/users').send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error with invalid token', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).get('/users').send(data).send({token : 'invalid'}).expect(401).end(done);
            });
        });

        describe('without filter', function () {
            it('should return 4 user', function (done) {
                request(app).get('/users').send(auth.credentials()).send({token : token}).expect(200).expect(function (response) {
                    response.body.should.be.instanceOf(Array).and.have.lengthOf(5);
                }).end(done);
            });
        });

        describe('filter by ids', function () {
            var ids;

            beforeEach(function (done) {
                request(app).get('/users').send(auth.credentials()).send({token : token}).expect(function (response) {
                    ids = [response.body[0]._id];
                }).end(done);
            });

            it('should return 1 user', function (done) {
                request(app).get('/users').send(auth.credentials()).send({token : token}).send({ids : ids}).expect(200).expect(function (response) {
                    response.body.should.be.instanceOf(Array).and.have.lengthOf(1);
                }).end(done);
            });
        });
    });

    describe('details', function () {
        var id;

        beforeEach(createUser);

        beforeEach(function (done) {
            request(app).get('/users').send(auth.credentials()).send({token : token}).expect(function (response) {
                id = response.body[0]._id;
            }).end(done);
        });

        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var data  = auth.credentials();
                data.transactionId = null;
                request(app).get('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data  = auth.credentials();
                data.timestamp = null;
                request(app).get('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error without signature', function (done) {
                var data  = auth.credentials();
                data.signature = null;
                request(app).get('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).get('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error with invalid token', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).get('/users/' + id).send(data).send({token : 'invalid'}).expect(401).end(done);
            });
        });

        it('should raise error with invalid user id', function (done) {
            request(app).get('/users/invalid').send(auth.credentials()).send({token : token}).expect(404).end(done);
        });

        it('should return', function (done) {
            request(app).get('/users/' + id).send(auth.credentials()).send({token : token}).expect(200).expect(function (response) {
                response.body.should.have.property('_id');
            }).end(done);
        });
    });

    describe('update', function () {
        var id;

        beforeEach(createUser);

        beforeEach(function (done) {
            request(app).get('/users').send(auth.credentials()).send({token : token}).expect(function (response) {
                id = response.body[0]._id;
            }).end(done);
        });

        describe('with invalid credentials', function () {
            it('should raise error without transactionId', function (done) {
                var data  = auth.credentials();
                data.transactionId = null;
                request(app).put('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error without timestamp', function (done) {
                var data  = auth.credentials();
                data.timestamp = null;
                request(app).put('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error without signature', function (done) {
                var data  = auth.credentials();
                data.signature = null;
                request(app).put('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error with invalid signature', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).put('/users/' + id).send(data).send({token : token}).expect(401).end(done);
            });

            it('should raise error with invalid token', function (done) {
                var data  = auth.credentials();
                data.signature = auth.credentials().signature;
                request(app).put('/users/' + id).send(data).send({token : 'invalid'}).expect(401).end(done);
            });
        });

        it('should raise error with invalid user id', function (done) {
            request(app).put('/users/invalid').send(auth.credentials()).send({token : token}).expect(404).end(done);
        });

        it('should raise error without password', function (done) {
            request(app).put('/users/' + id).send(auth.credentials()).send({token : token}).expect(500).end(done);
        });

        it('should update', function (done) {
            request(app).put('/users/' + id).send(auth.credentials()).send({token : token}).send({password : '11223344'}).expect(200).expect(function (response) {
                response.body.should.have.property('_id');
            }).end(done);
        });
    });
});
