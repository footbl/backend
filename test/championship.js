/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
    User, Championship,
    user;

supertest = require('supertest');
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
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'name' : 'brasileirão'});
            request.send({'country' : 'brasil'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2014});
            request.expect(401);
            request.end(done);
        });

        it('should raise error without name', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2014});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without edition', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'country' : 'brasil'});
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2014});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error with invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'country' : 'brasil'});
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2014});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name and edition', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil'});
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without name and country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without name and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil'});
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without edition and country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without edition and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'country' : 'brasil'});
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name, edition and country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without name, edition and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil'});
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name, country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without edition, country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name, edition, country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should create without type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'country' : 'brasil'});
            request.send({'edition' : 2014});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão');
                response.body.should.have.property('slug').be.equal('brasileirao-brasil-2014');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2014);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            request.end(done);
        });

        it('should create', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'country' : 'brasil'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão');
                response.body.should.have.property('slug').be.equal('brasileirao-brasil-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            request.end(done);
        });

        describe('with a created championship', function () {
            before(function (done) {
                Championship.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'name' : 'brasileirão'});
                request.send({'country' : 'brasil'});
                request.send({'type' : 'national league'});
                request.send({'edition' : 2015});
                request.end(done);
            });

            it('should raise error with repeated slug', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'name' : 'brasileirão'});
                request.send({'country' : 'brasil'});
                request.send({'type' : 'national league'});
                request.send({'edition' : 2015});
                request.expect(409);
                request.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.send({'country' : 'brasil'});
            request.send({'edition' : 2014});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should list', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
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
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'page' : 1});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(0);
            });
            request.end(done);
        });
    });

    describe('details', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.send({'country' : 'brasil'});
            request.send({'edition' : 2014});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should return', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão');
                response.body.should.have.property('slug').be.equal('brasileirao-brasil-2014');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('country').be.equal('brasil');
                response.body.should.have.property('edition').be.equal(2014);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            request.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.send({'country' : 'brasil'});
            request.send({'edition' : 2014});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(401);
            request.end(done);
        });

        it('should raise error without name', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without edition', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error with invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name and edition', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without name and country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without name and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without edition and country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without edition and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name, edition and country', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'national league'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without name, edition and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name, country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'invalid'});
            request.send({'edition' : 2015});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without edition, country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error without name, edition, country and invalid type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'type' : 'invalid'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('required');
                response.body.should.have.property('edition').be.equal('required');
                response.body.should.have.property('country').be.equal('required');
                response.body.should.have.property('type').be.equal('enum');
            });
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'edition' : 2015});
            request.expect(404);
            request.end(done);
        });

        it('should update without type', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'edition' : 2015});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão1');
                response.body.should.have.property('slug').be.equal('brasileirao1-brasil1-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('country').be.equal('brasil1');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            request.end(done);
        });

        it('should update', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao1-brasil1-2015');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão1'});
            request.send({'country' : 'brasil1'});
            request.send({'type' : 'national league'});
            request.send({'edition' : 2015});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão1');
                response.body.should.have.property('slug').be.equal('brasileirao1-brasil1-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            request.end(done);
        });

        after(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao1-brasil1-2015');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('name').be.equal('brasileirão1');
                response.body.should.have.property('country').be.equal('brasil1');
                response.body.should.have.property('slug').be.equal('brasileirao1-brasil1-2015');
                response.body.should.have.property('type').be.equal('national league');
                response.body.should.have.property('edition').be.equal(2015);
                response.body.should.have.property('rounds').be.equal(1);
                response.body.should.have.property('currentRound').be.equal(1);
            });
            request.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Championship.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'name' : 'brasileirão'});
            request.send({'type' : 'national league'});
            request.send({'country' : 'brasil'});
            request.send({'edition' : 2014});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/championships/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should delete', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(204);
            request.end(done);
        });

        after(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });
    });
});