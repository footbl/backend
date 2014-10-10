/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Championship, Match, Team,
user, championship, guestTeam, hostTeam;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');

describe('championship controller', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Team.remove.bind(Team));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin'});
    user.save(done);
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

  describe('list championships', function () {
    before(Championship.remove.bind(Championship));

    before(function (done) {
      new Championship({
        'name'    : 'brasileirão',
        'slug'    : 'brasileirao-brasil-2014',
        'type'    : 'national league',
        'country' : 'brasil',
        'edition' : 2014
      }).save(done);
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

  describe('championship details', function () {
    before(Championship.remove.bind(Championship));

    before(function (done) {
      new Championship({
        'name'    : 'brasileirão',
        'slug'    : 'brasileirao-brasil-2014',
        'type'    : 'national league',
        'country' : 'brasil',
        'edition' : 2014
      }).save(done);
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
      });
      request.end(done);
    });
  });

  describe('list matches', function () {
    before(Championship.remove.bind(Championship));
    before(Match.remove.bind(Match));

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
      new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      }).save(done);
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

  describe('match details', function () {
    before(Championship.remove.bind(Championship));
    before(Match.remove.bind(Match));

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
      new Match({
        'round'        : 1,
        'date'         : new Date(2014, 10, 10),
        'guest'        : guestTeam._id,
        'host'         : hostTeam._id,
        'championship' : championship._id,
        'slug'         : 'round-1-fluminense-vs-botafogo'
      }).save(done);
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
});