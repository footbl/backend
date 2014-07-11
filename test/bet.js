/*globals describe, before, it, after*/
require('should');
var request, app, auth,
User, Championship, Match, Team, Bet,
user;

request = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');
Bet = require('../models/bet');

describe('bet controller', function () {
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
        user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
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

    describe('create', function () {
        before(function (done) {
            Bet.remove(done);
        });

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
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req = req.send({'finished' : true});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/invalid/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.expect(404);
            req.end(done);
        });

        it('should raise error without bid', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'result' : 'draw'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('bid').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error with invalid result', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('result').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without bid and invalid result', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'result' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('bid').be.equal('required');
                response.body.should.have.property('result').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error with finished match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-2-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.expect(400);
            req.end(done);
        });

        describe('with valid result and bid', function () {
            it('should create', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'bid' : 50});
                req = req.send({'result' : 'draw'});
                req.expect(201);
                req.expect(function (response) {
                    response.body.should.have.property('bid').be.equal(50);
                    response.body.should.have.property('result').be.equal('draw');
                    response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                    response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                    response.body.should.have.property('match').with.property('round').be.equal(1);
                    response.body.should.have.property('match').with.property('date');
                    response.body.should.have.property('match').with.property('finished').be.equal(false);
                    response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                    response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                    response.body.should.have.property('user').with.property('slug').be.equal('user');
                });
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
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('pot').with.property('draw').be.equal(50);
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('stake').be.equal(50);
                    response.body.should.have.property('funds').be.equal(50);
                });
                req.end(done);
            });
        });

        describe('with a created bet', function () {
            before(function (done) {
                Bet.remove(done);
            });

            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'bid' : 50});
                req = req.send({'result' : 'draw'});
                req.end(done);
            });

            it('should raise error with repeated bet', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'bid' : 50});
                req = req.send({'result' : 'draw'});
                req.expect(409);
                req.end(done);
            });
        });
    });

    describe('list', function () {
        before(function (done) {
            Bet.remove(done);
        });

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

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/invalid/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should list', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.should.have.lengthOf(1);
                response.body.every(function (bet) {
                    bet.should.have.property('bid');
                    bet.should.have.property('result');
                    bet.should.have.property('match').with.property('slug');
                    bet.should.have.property('match').with.property('guest').with.property('name');
                    bet.should.have.property('match').with.property('guest').with.property('slug');
                    bet.should.have.property('match').with.property('guest').with.property('picture');
                    bet.should.have.property('match').with.property('host').with.property('name');
                    bet.should.have.property('match').with.property('host').with.property('slug');
                    bet.should.have.property('match').with.property('host').with.property('picture');
                    bet.should.have.property('match').with.property('round');
                    bet.should.have.property('match').with.property('date');
                    bet.should.have.property('match').with.property('finished');
                    bet.should.have.property('match').with.property('score').with.property('guest');
                    bet.should.have.property('match').with.property('score').with.property('host');
                    bet.should.have.property('user').with.property('slug');
                });
            });
            req.end(done);
        });

        it('should return empty in second page', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
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
            Bet.remove(done);
        });

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

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/invalid/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
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
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('bid').be.equal(50);
                response.body.should.have.property('result').be.equal('draw');
                response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                response.body.should.have.property('match').with.property('round').be.equal(1);
                response.body.should.have.property('match').with.property('date');
                response.body.should.have.property('match').with.property('finished').be.equal(false);
                response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                response.body.should.have.property('user').with.property('slug').be.equal('user');
            });
            req.end(done);
        });

        it('should return mine', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('bid').be.equal(50);
                response.body.should.have.property('result').be.equal('draw');
                response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                response.body.should.have.property('match').with.property('round').be.equal(1);
                response.body.should.have.property('match').with.property('date');
                response.body.should.have.property('match').with.property('finished').be.equal(false);
                response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                response.body.should.have.property('user').with.property('slug').be.equal('user');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        before(function (done) {
            Bet.remove(done);
        });

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

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 40});
            req = req.send({'result' : 'host'});
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/invalid/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 40});
            req = req.send({'result' : 'host'});
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 40});
            req = req.send({'result' : 'host'});
            req.expect(404);
            req.end(done);
        });

        it('should raise error without bid', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'result' : 'host'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('bid').be.equal('required');
            });
            req.end(done);
        });

        it('should raise error with invalid result', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 40});
            req = req.send({'result' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('result').be.equal('enum');
            });
            req.end(done);
        });

        it('should raise error without bid and invalid result', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'result' : 'invalid'});
            req.expect(400);
            req.expect(function (response) {
                response.body.should.have.property('bid').be.equal('required');
                response.body.should.have.property('result').be.equal('enum');
            });
            req.end(done);
        });

        describe('with finished match', function () {
            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'guest' : 'botafogo'});
                req = req.send({'host' : 'fluminense'});
                req = req.send({'round' : '1'});
                req = req.send({'date' : new Date(2014, 10, 10)});
                req = req.send({'finished' : true});
                req.end(done);
            });

            it('should raise error', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'bid' : 40});
                req = req.send({'result' : 'host'});
                req.expect(400);
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
        });

        describe('updating by slug', function () {
            it('should update', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'bid' : 40});
                req = req.send({'result' : 'host'});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('bid').be.equal(40);
                    response.body.should.have.property('result').be.equal('host');
                    response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                    response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                    response.body.should.have.property('match').with.property('round').be.equal(1);
                    response.body.should.have.property('match').with.property('date');
                    response.body.should.have.property('match').with.property('finished').be.equal(false);
                    response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                    response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                    response.body.should.have.property('user').with.property('slug').be.equal('user');
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('bid').be.equal(40);
                    response.body.should.have.property('result').be.equal('host');
                    response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                    response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                    response.body.should.have.property('match').with.property('round').be.equal(1);
                    response.body.should.have.property('match').with.property('date');
                    response.body.should.have.property('match').with.property('finished').be.equal(false);
                    response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                    response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                    response.body.should.have.property('user').with.property('slug').be.equal('user');
                });
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
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('pot').with.property('draw').be.equal(0);
                    response.body.should.have.property('pot').with.property('guest').be.equal(0);
                    response.body.should.have.property('pot').with.property('host').be.equal(40);
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('stake').be.equal(40);
                    response.body.should.have.property('funds').be.equal(60);
                });
                req.end(done);
            });
        });

        describe('updating by mine', function () {
            it('should update', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'bid' : 30});
                req = req.send({'result' : 'guest'});
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('bid').be.equal(30);
                    response.body.should.have.property('result').be.equal('guest');
                    response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                    response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                    response.body.should.have.property('match').with.property('round').be.equal(1);
                    response.body.should.have.property('match').with.property('date');
                    response.body.should.have.property('match').with.property('finished').be.equal(false);
                    response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                    response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                    response.body.should.have.property('user').with.property('slug').be.equal('user');
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('bid').be.equal(30);
                    response.body.should.have.property('result').be.equal('guest');
                    response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('slug').be.equal('botafogo');
                    response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
                    response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('slug').be.equal('fluminense');
                    response.body.should.have.property('match').with.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
                    response.body.should.have.property('match').with.property('round').be.equal(1);
                    response.body.should.have.property('match').with.property('date');
                    response.body.should.have.property('match').with.property('finished').be.equal(false);
                    response.body.should.have.property('match').with.property('score').with.property('guest').be.equal(0);
                    response.body.should.have.property('match').with.property('score').with.property('host').be.equal(0);
                    response.body.should.have.property('user').with.property('slug').be.equal('user');
                });
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
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('pot').with.property('draw').be.equal(0);
                    response.body.should.have.property('pot').with.property('guest').be.equal(30);
                    response.body.should.have.property('pot').with.property('host').be.equal(0);
                });
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.get('/users/me');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('stake').be.equal(30);
                    response.body.should.have.property('funds').be.equal(70);
                });
                req.end(done);
            });
        });
    });

    describe('delete', function () {
        before(function (done) {
            Bet.remove(done);
        });

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

        before(function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req = req.send({'bid' : 50});
            req = req.send({'result' : 'draw'});
            req.end(done);
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
            req = req.send({'round' : '2'});
            req = req.send({'date' : new Date(2014, 10, 10)});
            req = req.send({'finished' : true});
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid match', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/brasileirao-brasil-2014/matches/invalid/bets/user');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req, credentials;
            credentials = auth.credentials();
            req = request(app);
            req = req.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
            req = req.set('auth-signature', credentials.signature);
            req = req.set('auth-timestamp', credentials.timestamp);
            req = req.set('auth-transactionId', credentials.transactionId);
            req = req.set('auth-token', auth.token(user));
            req.expect(404);
            req.end(done);
        });

        describe('with finished match', function () {
            before(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req = req.send({'guest' : 'botafogo'});
                req = req.send({'host' : 'fluminense'});
                req = req.send({'round' : '1'});
                req = req.send({'date' : new Date(2014, 10, 10)});
                req = req.send({'finished' : true});
                req.end(done);
            });

            it('should raise error', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(400);
                req.end(done);
            });

            after(function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
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
        });

        describe('with valid token', function () {
            it('should delete', function (done) {
                var req, credentials;
                credentials = auth.credentials();
                req = request(app);
                req = req.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
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
                req = req.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/user');
                req = req.set('auth-signature', credentials.signature);
                req = req.set('auth-timestamp', credentials.timestamp);
                req = req.set('auth-transactionId', credentials.transactionId);
                req = req.set('auth-token', auth.token(user));
                req.expect(404);
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
                req.expect(200);
                req.expect(function (response) {
                    response.body.should.have.property('pot').with.property('draw').be.equal(0);
                    response.body.should.have.property('pot').with.property('guest').be.equal(0);
                    response.body.should.have.property('pot').with.property('host').be.equal(0);
                });
                req.end(done);
            });
        });
    });
});