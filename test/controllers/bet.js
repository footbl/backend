/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Championship, Match, Team, Bet,
user, otherUser, guestBetter, hostBetter, drawBetter, championship, guestTeam, hostTeam, match;

supertest = require('supertest');
app = require('../../index.js');
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
Team = require('../../models/team');
Bet = require('../../models/bet');

describe('bet controller', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Team.remove.bind(Team));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    guestBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'guest-better'});
    guestBetter.save(done);
  });

  before(function (done) {
    hostBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'host-better'});
    hostBetter.save(done);
  });

  before(function (done) {
    drawBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'draw-better'});
    drawBetter.save(done);
  });

  before(function (done) {
    otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  before(function (done) {
    championship = new Championship({
      'name'    : 'brasileirão',
      'slug'    : 'brasileirao-brasil-2014',
      'type'    : 'national league',
      'country' : 'brasil',
      'edition' : 2014
    });
    championship.save(done);
  });

  before(function (done) {
    hostTeam = new Team({
      'name'    : 'fluminense',
      'slug'    : 'fluminense',
      'picture' : 'http://pictures.com/fluminense.png'
    });
    hostTeam.save(done);
  });

  before(function (done) {
    guestTeam = new Team({
      'name'    : 'botafogo',
      'slug'    : 'botafogo',
      'picture' : 'http://pictures.com/botafogo.png'
    });
    guestTeam.save(done);
  });

  describe('create', function () {
    before(Bet.remove.bind(Bet));
    before(Match.remove.bind(Match));

    before(function (done) {
      new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      }).save(done);
    });

    before(function (done) {
      new Match({
        'round'        : 2,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-2-fluminense-vs-botafogo',
        'finished'     : true
      }).save(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid championship', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid match', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/invalid/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error without bid', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'result' : 'draw'});
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('bid').be.equal('required');
      });
      request.end(done);
    });

    it('should raise error with invalid result', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'invalid'});
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('result').be.equal('enum');
      });
      request.end(done);
    });

    it('should raise error without bid and invalid result', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'result' : 'invalid'});
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('bid').be.equal('required');
        response.body.should.have.property('result').be.equal('enum');
      });
      request.end(done);
    });

    it('should raise error with finished match', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-2-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.expect(400);
      request.end(done);
    });

    describe('with valid result and bid', function () {
      before(Match.remove.bind(Match));

      before(function (done) {
        new Match({
          'round'        : 1,
          'date'         : new Date(2014, 10, 10),
          'guest'        : guestTeam._id,
          'host'         : hostTeam._id,
          'championship' : championship._id,
          'slug'         : 'round-1-fluminense-vs-botafogo'
        }).save(done);
      });

      before(function (done) {
        new Match({
          'round'        : 2,
          'date'         : new Date(2014, 10, 10),
          'guest'        : guestTeam._id,
          'host'         : hostTeam._id,
          'championship' : championship._id,
          'slug'         : 'round-2-fluminense-vs-botafogo',
          'finished'     : true
        }).save(done);
      });

      it('should create', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(201);
        request.expect(function (response) {
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
          response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
          response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
          response.body.should.have.property('user').with.property('slug').be.equal('user');
        });
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
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('pot').with.property('draw').be.equal(50);
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(50);
          response.body.should.have.property('funds').be.equal(50);
        });
        request.end(done);
      });
    });

    describe('with a created bet', function () {
      before(Bet.remove.bind(Bet));
      before(Match.remove.bind(Match));

      before(function (done) {
        new Match({
          'round'        : 1,
          'date'         : new Date(2014, 10, 10),
          'guest'        : guestTeam._id,
          'host'         : hostTeam._id,
          'championship' : championship._id,
          'slug'         : 'round-1-fluminense-vs-botafogo'
        }).save(done);
      });

      before(function (done) {
        new Match({
          'round'        : 2,
          'date'         : new Date(2014, 10, 10),
          'guest'        : guestTeam._id,
          'host'         : hostTeam._id,
          'championship' : championship._id,
          'slug'         : 'round-2-fluminense-vs-botafogo',
          'finished'     : true
        }).save(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.end(done);
      });

      it('should raise error with repeated bet', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(409);
        request.end(done);
      });
    });

    describe('without insufficient funds', function () {
      before(Bet.remove.bind(Bet));
      before(Match.remove.bind(Match));

      before(function (done) {
        new Match({
          'round'        : 1,
          'date'         : new Date(2014, 10, 10),
          'guest'        : guestTeam._id,
          'host'         : hostTeam._id,
          'championship' : championship._id,
          'slug'         : 'round-1-fluminense-vs-botafogo'
        }).save(done);
      });

      before(function (done) {
        new Match({
          'round'        : 2,
          'date'         : new Date(2014, 10, 10),
          'guest'        : guestTeam._id,
          'host'         : hostTeam._id,
          'championship' : championship._id,
          'slug'         : 'round-2-fluminense-vs-botafogo',
          'finished'     : true
        }).save(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 70});
        request.send({'result' : 'draw'});
        request.end(done);
      });

      it('should raise error', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/championships/brasileirao-brasil-2014/matches/round-2-fluminense-vs-botafogo/bets');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.end(done);
      });
    });
  });

  describe('list', function () {
    before(Bet.remove.bind(Bet));
    before(Match.remove.bind(Match));

    before(function (done) {
      new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      }).save(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
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
      request = request.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid match', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/championships/brasileirao-brasil-2014/matches/invalid/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/invalid/bets');
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
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
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
          bet.should.have.property('match').with.property('result').with.property('guest');
          bet.should.have.property('match').with.property('result').with.property('host');
          bet.should.have.property('user').with.property('slug');
        });
      });
      request.end(done);
    });

    it('should list user bets', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
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
          bet.should.have.property('match').with.property('result').with.property('guest');
          bet.should.have.property('match').with.property('result').with.property('host');
          bet.should.have.property('user').with.property('slug');
        });
      });
      request.end(done);
    });

    it('should list mine bets', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
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
          bet.should.have.property('match').with.property('result').with.property('guest');
          bet.should.have.property('match').with.property('result').with.property('host');
          bet.should.have.property('user').with.property('slug');
        });
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
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
    before(Bet.remove.bind(Bet));
    before(Match.remove.bind(Match));

    before(function (done) {
      new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      }).save(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
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
      request = request.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid match', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/championships/brasileirao-brasil-2014/matches/invalid/bets/round-1-fluminense-vs-botafogo-user');
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
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
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
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
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
        response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
        response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
        response.body.should.have.property('user').with.property('slug').be.equal('user');
      });
      request.end(done);
    });

    it('should return mine', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
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
        response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
        response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
        response.body.should.have.property('user').with.property('slug').be.equal('user');
      });
      request.end(done);
    });
  });

  describe('update', function () {
    before(Bet.remove.bind(Bet));
    before(Match.remove.bind(Match));

    before(function (done) {
      match = new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      });
      match.save(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.expect(401);
      request.end(done);
    });

    it('should raise error with other user token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(otherUser));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.expect(405);
      request.end(done);
    });

    it('should raise error with invalid championship', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 40});
      request.send({'result' : 'host'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid match', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/invalid/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 40});
      request.send({'result' : 'host'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 40});
      request.send({'result' : 'host'});
      request.expect(404);
      request.end(done);
    });

    it('should raise error without bid', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'result' : 'host'});
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('bid').be.equal('required');
      });
      request.end(done);
    });

    it('should raise error with invalid result', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 40});
      request.send({'result' : 'invalid'});
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('result').be.equal('enum');
      });
      request.end(done);
    });

    it('should raise error without bid and invalid result', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'result' : 'invalid'});
      request.expect(400);
      request.expect(function (response) {
        response.body.should.have.property('bid').be.equal('required');
        response.body.should.have.property('result').be.equal('enum');
      });
      request.end(done);
    });

    describe('with finished match', function () {
      before(function (done) {
        match.finished = true;
        match.save(done);
      });

      it('should raise error', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 40});
        request.send({'result' : 'host'});
        request.expect(400);
        request.end(done);
      });

      after(function (done) {
        match.finished = false;
        match.save(done);
      });
    });

    describe('updating by slug', function () {
      it('should update', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 40});
        request.send({'result' : 'host'});
        request.expect(200);
        request.expect(function (response) {
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
          response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
          response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
          response.body.should.have.property('user').with.property('slug').be.equal('user');
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
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
          response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
          response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
          response.body.should.have.property('user').with.property('slug').be.equal('user');
        });
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
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('pot').with.property('draw').be.equal(0);
          response.body.should.have.property('pot').with.property('guest').be.equal(0);
          response.body.should.have.property('pot').with.property('host').be.equal(40);
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(40);
          response.body.should.have.property('funds').be.equal(60);
        });
        request.end(done);
      });
    });

    describe('updating by mine', function () {
      it('should update', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 30});
        request.send({'result' : 'guest'});
        request.expect(200);
        request.expect(function (response) {
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
          response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
          response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
          response.body.should.have.property('user').with.property('slug').be.equal('user');
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
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
          response.body.should.have.property('match').with.property('result').with.property('guest').be.equal(0);
          response.body.should.have.property('match').with.property('result').with.property('host').be.equal(0);
          response.body.should.have.property('user').with.property('slug').be.equal('user');
        });
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
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('pot').with.property('draw').be.equal(0);
          response.body.should.have.property('pot').with.property('guest').be.equal(30);
          response.body.should.have.property('pot').with.property('host').be.equal(0);
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(30);
          response.body.should.have.property('funds').be.equal(70);
        });
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    before(Bet.remove.bind(Bet));
    before(Match.remove.bind(Match));

    before(function (done) {
      match = new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      });
      match.save(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with other user token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(otherUser));
      request.expect(405);
      request.end(done);
    });

    it('should raise error with invalid championship', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid match', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/championships/brasileirao-brasil-2014/matches/invalid/bets/round-1-fluminense-vs-botafogo-user');
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
      request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    describe('with finished match', function () {
      before(function (done) {
        match.finished = true;
        match.save(done);
      });

      it('should raise error', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.end(done);
      });

      after(function (done) {
        match.finished = false;
        match.save(done);
      });
    });

    describe('with valid token', function () {
      it('should delete', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
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
        request = request.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(404);
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
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('pot').with.property('draw').be.equal(0);
          response.body.should.have.property('pot').with.property('guest').be.equal(0);
          response.body.should.have.property('pot').with.property('host').be.equal(0);
        });
        request.end(done);
      });
    });
  });

  describe('bet rewards', function () {
    before(Bet.remove.bind(Bet));
    before(Match.remove.bind(Match));

    before(function (done) {
      match = new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      });
      match.save(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(drawBetter));
      request.send({'bid' : 20});
      request.send({'result' : 'draw'});
      request.end(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(guestBetter));
      request.send({'bid' : 30});
      request.send({'result' : 'guest'});
      request.end(done);
    });

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(hostBetter));
      request.send({'bid' : 40});
      request.send({'result' : 'host'});
      request.end(done);
    });

    describe('draw result', function () {
      before(function (done) {
        match.finished = true;
        match.result = {'guest' : 1, 'host' : 1};
        match.save(done);
      });

      it('should reward draw better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(drawBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(170);
        });
        request.end(done);
      });

      it('should not reward guest better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(guestBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(70);
        });
        request.end(done);
      });

      it('should not reward host better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(hostBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(60);
        });
        request.end(done);
      });
    });

    describe('guest result', function () {
      before(function (done) {
        match.finished = true;
        match.result = {'guest' : 2, 'host' : 1};
        match.save(done);
      });

      it('should not reward draw better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(drawBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(80);
        });
        request.end(done);
      });

      it('should reward guest better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(guestBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(160);
        });
        request.end(done);
      });

      it('should not reward host better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(hostBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(60);
        });
        request.end(done);
      });
    });

    describe('host result', function () {
      before(function (done) {
        match.finished = true;
        match.result = {'guest' : 1, 'host' : 2};
        match.save(done);
      });

      it('should not reward draw better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(drawBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(80);
        });
        request.end(done);
      });

      it('should not reward guest better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(guestBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(70);
        });
        request.end(done);
      });

      it('should reward host better', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(hostBetter));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(150);
        });
        request.end(done);
      });
    });
  });
});