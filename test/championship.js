/*globals describe, before, it, after*/
require('should');
var request, app, auth,
    User, Championship,
    user;

request = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');

describe('championship controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    describe('create', function () {
        before(function (done) {
            Championship.remove(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2014});
            req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2014});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without edition', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2014});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error with invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2014});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name and edition', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name and country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without edition and country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without edition and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name, edition and country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name, edition and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name, country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without edition, country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name, edition, country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should create without type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'edition' : 2014});
            req.expect(201);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão');
                response.body.should.have.property('slug').be.equal('brasileirao-brasil-2014');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2014);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            req.end(done);
        });

        it('should create', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(201);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão');
                response.body.should.have.property('slug').be.equal('brasileirao-brasil-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            req.end(done);
        });

        describe('with a created championship', function () {
            before(function (done) {
                Championship.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'name' : 'brasileirão'});
                req = req.send({'country' : 'brasil'});
                req = req.send({'type' : 'national league'});
                req = req.send({'edition' : 2015});
                req.end(done);
            });

            it('should raise error with repeated slug', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'name' : 'brasileirão'});
                req = req.send({'country' : 'brasil'});
                req = req.send({'type' : 'national league'});
                req = req.send({'edition' : 2015});
                req.expect(409);
                req.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'edition' : 2014});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should list', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (championship) {
                    championship.should.have.property('name');
                    championship.should.have.property('slug');
                    championship.should.have.property('type');
                    championship.should.have.property('edition');
                    championship.should.have.property('rounds');
                    championship.should.have.property('currentRound');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'page' : 1});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(0);
            });
            req.end(done);
        });
    });

    describe('details', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'edition' : 2014});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão');
                response.body.should.have.property('slug').be.equal('brasileirao-brasil-2014');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('country').be.equal('brasil');
                response.body.should.have.property('edition').be.equal(2014);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            req.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'edition' : 2014});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without edition', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error with invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name and edition', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name and country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without edition and country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without edition and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name, edition and country', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'national league'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without name, edition and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name, country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'invalid'});
            req = req.send({'edition' : 2015});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without edition, country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without name, edition, country and invalid type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'type' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'edition' : 2015});
            req.expect(404);
            req.end(done);
        });

        it('should update without type', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'edition' : 2015});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão1');
                response.body.should.have.property('slug').be.equal('brasileirao1-brasil1-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('country').be.equal('brasil1');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao1-brasil1-2015');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão1'});
            req = req.send({'country' : 'brasil1'});
            req = req.send({'type' : 'national league'});
            req = req.send({'edition' : 2015});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão1');
                response.body.should.have.property('slug').be.equal('brasileirao1-brasil1-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao1-brasil1-2015');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão1');
                response.body.should.have.property('country').be.equal('brasil1');
                response.body.should.have.property('slug').be.equal('brasileirao1-brasil1-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'name' : 'brasileirão'});
            req = req.send({'type' : 'national league'});
            req = req.send({'country' : 'brasil'});
            req = req.send({'edition' : 2014});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(204);
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });
    });
});