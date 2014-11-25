/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Championship, Match, Team, Bet, ranking, previousRanking, userHistory,
user, otherUser, guestBetter, hostBetter, drawBetter, championship, guestTeam, hostTeam, match;

supertest = require('supertest');
app = require('../../index.js');
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
Team = require('../../models/team');
Bet = require('../../models/bet');
ranking = require('../../workers/world-ranking');
previousRanking = require('../../workers/world-previous-ranking');
userHistory = require('../../workers/user-history');

describe('world ranking', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Team.remove.bind(Team));
  before(Bet.remove.bind(Bet));
  before(Match.remove.bind(Match));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
    user.save(done);
  });

  before(function (done) {
    guestBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'guest-better', 'email' : 'guest-better@footbl.co'});
    guestBetter.save(done);
  });

  before(function (done) {
    hostBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'host-better', 'email' : 'other-better@footbl.co'});
    hostBetter.save(done);
  });

  before(function (done) {
    drawBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'draw-better', 'email' : 'draw-better@footbl.co'});
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

  before(function (done) {
    match.finished = true;
    match.result = {'guest' : 1, 'host' : 2};
    match.save(done);
  });

  it('should sort', ranking);

  it('should update previous ranking', previousRanking);

  it('should update history', userHistory);

  it('should not duplicate history', userHistory);

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/users/host-better');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(function (response) {
      response.body.history.should.have.lengthOf(1);
      response.body.history[0].should.have.property('funds').be.equal(150);
      response.body.should.have.property('ranking').be.equal(1);
      response.body.should.have.property('previousRanking').be.equal(1);
    });
    request.end(done);
  });

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/users/draw-better');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(function (response) {
      response.body.history.should.have.lengthOf(1);
      response.body.history[0].should.have.property('funds').be.equal(80);
      response.body.should.have.property('ranking').be.equal(2);
      response.body.should.have.property('previousRanking').be.equal(2);
    });
    request.end(done);
  });

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/users/guest-better');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(function (response) {
      response.body.history.should.have.lengthOf(1);
      response.body.history[0].should.have.property('funds').be.equal(70);
      response.body.should.have.property('ranking').be.equal(3);
      response.body.should.have.property('previousRanking').be.equal(3);
    });
    request.end(done);
  });
});