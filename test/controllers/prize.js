/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Championship, Team, Match, Bet, Entry,
user, championship, guestTeam, hostTeam;

supertest = require('supertest');
app = require('../../index.js');
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Team = require('../../models/team');
Match = require('../../models/match');
Bet = require('../../models/bet');
Entry = require('../../models/entry');

describe('prize controller', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Entry.remove.bind(Entry));
  before(Championship.remove.bind(Championship));
  before(Team.remove.bind(Team));
  before(Bet.remove.bind(Bet));
  before(Match.remove.bind(Match));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user', 'facebookId' : '111'});
    user.save(done);
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
    request.send({'result' : 'guest'});
    request.end(done);
  });

  before(function (done) {
    Match.update({'slug' : 'round-1-fluminense-vs-botafogo'}, { '$set' : {
      'finsihed' : true
    }}, done);
  });

  before(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/users/me/auth');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('facebook-token', '1234');
    request.expect(200);
    request.end(done);
  });

  describe('list', function () {
    it('should list', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/prizes');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });

    it('should list searching by me', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/prizes');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });
  });

  describe('details', function () {
    var id;

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/prizes');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    it('should show', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/prizes/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('slug');
        response.body.should.have.property('value');
        response.body.should.have.property('type');
      });
      request.end(done);
    });
  });

  describe('mark as read', function () {
    var id;

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/prizes');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        id = response.body[0].slug;
      });
      request.end(done);
    });

    it('should mark as read', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.put('/users/me/prizes/' + id + '/mark-as-read');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
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
        response.body.should.have.property('funds').be.equal(51);
      });
      request.end(done);
    });

    after(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/prizes');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.send({'unreadMessages' : true});
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(0);
      });
      request.end(done);
    });
  });
});