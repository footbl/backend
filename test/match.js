/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
    User, Championship, Match, Team,
    user;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');

describe('match controller', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        Championship.remove(done);
    });

    before(function (done) {
        Team.remove(done);
    });

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
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

    before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/teams');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'fluminense'});
        request.send({'picture' : 'http://pictures.com/fluminense.png'});
        request.end(done);
    });

    before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/teams');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'botafogo'});
        request.send({'picture' : 'http://pictures.com/botafogo.png'});
        request.end(done);
    });

    before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/teams');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'vasco'});
        request.send({'picture' : 'http://pictures.com/vasco.png'});
        request.end(done);
    });

    before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/teams');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'name' : 'flamengo'});
        request.send({'picture' : 'http://pictures.com/flamengo.png'});
        request.end(done);
    });

    describe('create', function () {
        before(function (done) {
            Match.remove(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/invalid/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(404);
            request.end(done);
        });

        it('should raise error without guest', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest and host', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest and round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'fluminense'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host and round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'round' : '1'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('date').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, host and round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'fluminense'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, host and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'round' : '1'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host, round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, host, round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should create', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.expect(201);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                response.body.should.have.property('guest').with.property('name').be.equal('botafogo');
                response.body.should.have.property('guest').with.property('slug').be.equal('botafogo');
                response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                response.body.should.have.property('host').with.property('name').be.equal('fluminense');
                response.body.should.have.property('host').with.property('slug').be.equal('fluminense');
                response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                response.body.should.have.property('round').be.equal(1);
                response.body.should.have.property('date');
                response.body.should.have.property('finished').be.equal(false);
                response.body.should.have.property('result').with.property('guest').be.equal(0);
                response.body.should.have.property('result').with.property('host').be.equal(0);
            });
            request.end(done);
        });

        describe('with a created match', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships/brasileirao-brasil-2014/matches');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'guest' : 'botafogo'});
                request.send({'host' : 'fluminense'});
                request.send({'round' : '1'});
                request.send({'date' : new Date(2014, 10, 10)});
                request.end(done);
            });

            it('should raise error with repeated slug', function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships/brasileirao-brasil-2014/matches');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'guest' : 'botafogo'});
                request.send({'host' : 'fluminense'});
                request.send({'round' : '1'});
                request.send({'date' : new Date(2014, 10, 10)});
                request.expect(409);
                request.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/invalid/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should list', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (match) {
                    match.should.have.property('slug');
                    match.should.have.property('guest').with.property('name');
                    match.should.have.property('guest').with.property('slug');
                    match.should.have.property('guest').with.property('picture');
                    match.should.have.property('host').with.property('name');
                    match.should.have.property('host').with.property('slug');
                    match.should.have.property('host').with.property('picture');
                    match.should.have.property('round');
                    match.should.have.property('date');
                    match.should.have.property('finished');
                    match.should.have.property('result').with.property('guest');
                    match.should.have.property('result').with.property('host');
                });
            });
            request.end(done);
        });

        it('should return empty in second page', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014/matches');
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
            Match.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014/matches/invalid');
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
            request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                response.body.should.have.property('guest').with.property('name').be.equal('botafogo');
                response.body.should.have.property('guest').with.property('slug').be.equal('botafogo');
                response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                response.body.should.have.property('host').with.property('name').be.equal('fluminense');
                response.body.should.have.property('host').with.property('slug').be.equal('fluminense');
                response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                response.body.should.have.property('round').be.equal(1);
                response.body.should.have.property('date');
                response.body.should.have.property('finished').be.equal(false);
                response.body.should.have.property('result').with.property('guest').be.equal(0);
                response.body.should.have.property('result').with.property('host').be.equal(0);
            });
            request.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.send({'guest' : 'vasco'});
            request.send({'host' : 'flamengo'});
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(401);
            request.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/invalid/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'host' : 'flamengo'});
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(404);
            request.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/invalid');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'host' : 'flamengo'});
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(404);
            request.end(done);
        });

        it('should raise error without guest', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'flamengo'});
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'host' : 'flamengo'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'host' : 'flamengo'});
            request.send({'round' : '2'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest and host', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            request.expect(400);
            request.end(done);
        });

        it('should raise error without guest and round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'flamengo'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'flamengo'});
            request.send({'round' : '2'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host and round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'round' : '2'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.send({'host' : 'flamengo'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, host and round', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'host' : 'flamengo'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, host and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'round' : '2'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without host, round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'vasco'});
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should raise error without guest, host, round and date', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(400);
            request.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            request.end(done);
        });

        it('should update', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'flamengo'});
            request.send({'host' : 'vasco'});
            request.send({'round' : '2'});
            request.send({'date' : new Date(2014, 10, 9)});
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('round-2-vasco-vs-flamengo');
                //@TODO MONGOOSE BUG
                //response.body.should.have.property('guest').with.property('name').be.equal('flamengo');
                //response.body.should.have.property('guest').with.property('slug').be.equal('flamengo');
                //response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/flamengo.png');
                //response.body.should.have.property('host').with.property('name').be.equal('vasco');
                //response.body.should.have.property('host').with.property('slug').be.equal('vasco');
                //response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/vasco.png');
                response.body.should.have.property('round').be.equal(2);
                response.body.should.have.property('date');
                response.body.should.have.property('finished').be.equal(false);
                response.body.should.have.property('result').with.property('guest').be.equal(0);
                response.body.should.have.property('result').with.property('host').be.equal(0);
            });
            request.end(done);
        });

        after(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.get('/championships/brasileirao-brasil-2014/matches/round-2-vasco-vs-flamengo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
                response.body.should.have.property('slug').be.equal('round-2-vasco-vs-flamengo');
                response.body.should.have.property('guest').with.property('name').be.equal('flamengo');
                response.body.should.have.property('guest').with.property('slug').be.equal('flamengo');
                response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/flamengo.png');
                response.body.should.have.property('host').with.property('name').be.equal('vasco');
                response.body.should.have.property('host').with.property('slug').be.equal('vasco');
                response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/vasco.png');
                response.body.should.have.property('round').be.equal(2);
                response.body.should.have.property('date');
                response.body.should.have.property('finished').be.equal(false);
                response.body.should.have.property('result').with.property('guest').be.equal(0);
                response.body.should.have.property('result').with.property('host').be.equal(0);
            });
            request.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.post('/championships/brasileirao-brasil-2014/matches');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.send({'guest' : 'botafogo'});
            request.send({'host' : 'fluminense'});
            request.send({'round' : '1'});
            request.send({'date' : new Date(2014, 10, 10)});
            request.end(done);
        });

        it('should raise error without token', function (done) {
            var request, credentials;
            credentials = auth.credentials();
            request = supertest(app);
            request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
            request = request.del('/championships/brasileirao-brasil-2014/matches/invalid');
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
            request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
            request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            request.set('auth-signature', credentials.signature);
            request.set('auth-timestamp', credentials.timestamp);
            request.set('auth-transactionId', credentials.transactionId);
            request.set('auth-token', auth.token(user));
            request.expect(404);
            request.end(done);
        });
    });

    describe('match championship', function () {
        describe('with one unfinished match in the first round', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships/brasileirao-brasil-2014/matches');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'guest' : 'botafogo'});
                request.send({'host' : 'fluminense'});
                request.send({'round' : '1'});
                request.send({'date' : new Date(2014, 10, 10)});
                request.end(done);
            });

            it('it should return championship rounds equal to 1 and currentRound equal to 1', function (done) {
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
                    response.body.should.have.property('rounds').be.equal(1);
                    response.body.should.have.property('currentRound').be.equal(1);
                });
                request.end(done);
            });

            describe('and one unfinished match in the second round', function () {
                before(function (done) {
                    var request, credentials;
                    credentials = auth.credentials();
                    request = supertest(app);
                    request = request.post('/championships/brasileirao-brasil-2014/matches');
                    request.set('auth-signature', credentials.signature);
                    request.set('auth-timestamp', credentials.timestamp);
                    request.set('auth-transactionId', credentials.transactionId);
                    request.set('auth-token', auth.token(user));
                    request.send({'guest' : 'vasco'});
                    request.send({'host' : 'flamengo'});
                    request.send({'round' : '2'});
                    request.send({'date' : new Date(2014, 10, 10)});
                    request.end(done);
                });

                it('it should return championship rounds equal to 2 and currentRound equal to 1', function (done) {
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
                        response.body.should.have.property('rounds').be.equal(2);
                        response.body.should.have.property('currentRound').be.equal(1);
                    });
                    request.end(done);
                });
            });
        });

        describe('with one finished match in the first round', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships/brasileirao-brasil-2014/matches');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'guest' : 'botafogo'});
                request.send({'host' : 'fluminense'});
                request.send({'round' : 1});
                request.send({'finished' : true});
                request.send({'date' : new Date(2014, 10, 10)});
                request.end(done);
            });

            it('it should return championship rounds equal to 1 and currentRound equal to 1', function (done) {
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
                    response.body.should.have.property('rounds').be.equal(1);
                    response.body.should.have.property('currentRound').be.equal(1);
                });
                request.end(done);
            });

            describe('and one unfinished match in the second round', function () {
                before(function (done) {
                    var request, credentials;
                    credentials = auth.credentials();
                    request = supertest(app);
                    request = request.post('/championships/brasileirao-brasil-2014/matches');
                    request.set('auth-signature', credentials.signature);
                    request.set('auth-timestamp', credentials.timestamp);
                    request.set('auth-transactionId', credentials.transactionId);
                    request.set('auth-token', auth.token(user));
                    request.send({'guest' : 'vasco'});
                    request.send({'host' : 'flamengo'});
                    request.send({'round' : 2});
                    request.send({'date' : new Date(2014, 10, 10)});
                    request.end(done);
                });

                it('it should return championship rounds equal to 2 and currentRound equal to 2', function (done) {
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
                        response.body.should.have.property('rounds').be.equal(2);
                        response.body.should.have.property('currentRound').be.equal(2);
                    });
                    request.end(done);
                });
            });
        });

        describe('with one finished match in the first and second round', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships/brasileirao-brasil-2014/matches');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'guest' : 'botafogo'});
                request.send({'host' : 'fluminense'});
                request.send({'round' : 1});
                request.send({'finished' : true});
                request.send({'date' : new Date(2014, 10, 10)});
                request.end(done);
            });

            before(function (done) {
                var request, credentials;
                credentials = auth.credentials();
                request = supertest(app);
                request = request.post('/championships/brasileirao-brasil-2014/matches');
                request.set('auth-signature', credentials.signature);
                request.set('auth-timestamp', credentials.timestamp);
                request.set('auth-transactionId', credentials.transactionId);
                request.set('auth-token', auth.token(user));
                request.send({'guest' : 'vasco'});
                request.send({'host' : 'flamengo'});
                request.send({'round' : 2});
                request.send({'date' : new Date(2014, 10, 10)});
                request.end(done);
            });

            it('it should return championship rounds equal to 2 and currentRound equal to 2', function (done) {
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
                    response.body.should.have.property('rounds').be.equal(2);
                    response.body.should.have.property('currentRound').be.equal(2);
                });
                request.end(done);
            });
        });
    });
});