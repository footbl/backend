/*globals describe, before, it, after*/
require('should');
var request, app, auth,
    User, Championship, Match, Team,
    user;

request  = require('supertest');
app      = require('../index.js');
auth     = require('../lib/auth');

User         = require('../models/user');
Championship = require('../models/championship');
Match        = require('../models/match');
Team         = require('../models/team');

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

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/teams');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'fluminense'});
        req = req.send({'picture' : 'http://pictures.com/fluminense.png'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/teams');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'botafogo'});
        req = req.send({'picture' : 'http://pictures.com/botafogo.png'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/teams');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'vasco'});
        req = req.send({'picture' : 'http://pictures.com/vasco.png'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/teams');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'flamengo'});
        req = req.send({'picture' : 'http://pictures.com/flamengo.png'});
        req.end(done);
    });

    describe('create', function () {
        before(function (done) {
            Match.remove(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/invalid/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(404);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest and host', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'fluminense'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'round' : '1'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('date').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, host and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'fluminense'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, host and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'round' : '1'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host, round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, host, round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should create', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            //req.expect(201);
            req.expect(function (response) {
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
                response.body.should.have.property('score').with.property('guest').be.equal(0);
                response.body.should.have.property('score').with.property('host').be.equal(0);
            });
            req.end(done);
        });

        describe('with a created match', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'guest' : 'botafogo'});
                req = req.send({'host' : 'fluminense'});
                req = req.send({'round' : '1'});
                req = req.send({'date' : new Date(2014, 10, 10)});
                req.end(done);
            });

            it('should raise error with repeated slug', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'guest' : 'botafogo'});
                req = req.send({'host' : 'fluminense'});
                req = req.send({'round' : '1'});
                req = req.send({'date' : new Date(2014, 10, 10)});
                req.expect(409);
                req.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches');
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
            req = req.get('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
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
                    match.should.have.property('score').with.property('guest');
                    match.should.have.property('score').with.property('host');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches');
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
            Match.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
            req = req.get('/championships/brasileirao-brasil-2014/matches/invalid');
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
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
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
                response.body.should.have.property('score').with.property('guest').be.equal(0);
                response.body.should.have.property('score').with.property('host').be.equal(0);
            });
            req.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/invalid/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(404);
            req.end(done);
        });

        it('should raise error without guest', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest and host', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
            });
            req.expect(400);
            req.end(done);
        });

        it('should raise error without guest and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'flamengo'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'round' : '2'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, host and round', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'host' : 'flamengo'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, host and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'round' : '2'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without host, round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error without guest, host, round and date', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('guest').be.equal('required');
                response.body.should.have.property('host').be.equal('required');
                response.body.should.have.property('round').be.equal('required');
                response.body.should.have.property('date').be.equal('required');
            });
            req.end(done);
        });

        it('should update', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'vasco'});
            req = req.send({'host' : 'flamengo'});
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 9)});
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('round-2-vasco-vs-flamengo');
                response.body.should.have.property('guest').with.property('name').be.equal('vasco');
                response.body.should.have.property('guest').with.property('slug').be.equal('vasco');
                response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/vasco.png');
                response.body.should.have.property('host').with.property('name').be.equal('flamengo');
                response.body.should.have.property('host').with.property('slug').be.equal('flamengo');
                response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/flamengo.png');
                response.body.should.have.property('round').be.equal(2);
                response.body.should.have.property('date');
                response.body.should.have.property('finished').be.equal(false);
                response.body.should.have.property('score').with.property('guest').be.equal(0);
                response.body.should.have.property('score').with.property('host').be.equal(0);
            });
            req.end(done);
        });

        after(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-2-vasco-vs-flamengo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('slug').be.equal('round-2-vasco-vs-flamengo');
                response.body.should.have.property('guest').with.property('name').be.equal('vasco');
                response.body.should.have.property('guest').with.property('slug').be.equal('vasco');
                response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/vasco.png');
                response.body.should.have.property('host').with.property('name').be.equal('flamengo');
                response.body.should.have.property('host').with.property('slug').be.equal('flamengo');
                response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/flamengo.png');
                response.body.should.have.property('round').be.equal(2);
                response.body.should.have.property('date');
                response.body.should.have.property('finished').be.equal(false);
                response.body.should.have.property('score').with.property('guest').be.equal(0);
                response.body.should.have.property('score').with.property('host').be.equal(0);
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        before(function (done) {
            Match.remove(done);
        });

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'guest' : 'botafogo'});
            req = req.send({'host' : 'fluminense'});
            req = req.send({'round' : '1'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
            req = req.del('/championships/brasileirao-brasil-2014/matches/invalid');
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
            req = req.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });
    });

    describe('match championship', function () {
        describe('with one unfinished match in the first round', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'guest' : 'botafogo'});
                req = req.send({'host' : 'fluminense'});
                req = req.send({'round' : '1'});
                req = req.send({'date' : new Date(2014, 10, 10)});
                req.end(done);
            });

            it('it should return championship rounds equal to 1 and currentRound equal to 1', function (done) {
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
                    response.body.should.have.property('rounds').be.equal(1);
                    response.body.should.have.property('currentRound').be.equal(1);
                });
                req.end(done);
            });

            describe('and one unfinished match in the second round', function () {
                before(function (done) {
                    var req, credentials;
                    credentials = auth.credentials();
                    req = request(app);
                    req = req.post('/championships/brasileirao-brasil-2014/matches');
                    req = req.set('auth-signature', credentials.signature);
                    req = req.set('auth-timestamp', credentials.timestamp);
                    req = req.set('auth-transactionId', credentials.transactionId);
                    req = req.set('auth-token', auth.token(user));
                    req = req.send({'guest' : 'vasco'});
                    req = req.send({'host' : 'flamengo'});
                    req = req.send({'round' : '2'});
                    req = req.send({'date' : new Date(2014, 10, 10)});
                    req.end(done);
                });

                it('it should return championship rounds equal to 2 and currentRound equal to 1', function (done) {
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
                        response.body.should.have.property('rounds').be.equal(2);
                        response.body.should.have.property('currentRound').be.equal(1);
                    });
                    req.end(done);
                });
            });
        });

        describe('with one finished match in the first round', function () {
            before(function (done) {
                Match.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'guest' : 'botafogo'});
                req = req.send({'host' : 'fluminense'});
                req = req.send({'round' : 1});
                req = req.send({'finished' : true});
                req = req.send({'date' : new Date(2014, 10, 10)});
                req.end(done);
            });

            it('it should return championship rounds equal to 1 and currentRound equal to 1', function (done) {
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
                    response.body.should.have.property('rounds').be.equal(1);
                    response.body.should.have.property('currentRound').be.equal(1);
                });
                req.end(done);
            });

            describe('and one unfinished match in the second round', function () {
                before(function (done) {
                    var req, credentials;
                    credentials = auth.credentials();
                    req = request(app);
                    req = req.post('/championships/brasileirao-brasil-2014/matches');
                    req = req.set('auth-signature', credentials.signature);
                    req = req.set('auth-timestamp', credentials.timestamp);
                    req = req.set('auth-transactionId', credentials.transactionId);
                    req = req.set('auth-token', auth.token(user));
                    req = req.send({'guest' : 'vasco'});
                    req = req.send({'host' : 'flamengo'});
                    req = req.send({'round' : 2});
                    req = req.send({'date' : new Date(2014, 10, 10)});
                    req.end(done);
                });

                it('it should return championship rounds equal to 2 and currentRound equal to 2', function (done) {
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
                        response.body.should.have.property('rounds').be.equal(2);
                        response.body.should.have.property('currentRound').be.equal(2);
                    });
                    req.end(done);
                });
            });
        });
    });
});