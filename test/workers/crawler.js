/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, Championship, Match, Team, Bet, Group, GroupMember, crawler,
user, slug;

supertest = require('supertest');
app = require('../../index.js');
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
Team = require('../../models/team');
Bet = require('../../models/bet');
Group = require('../../models/group');
GroupMember = require('../../models/group-member');
crawler = require('../../workers/crawler');

describe('crawler', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Team.remove.bind(Team));
  before(Bet.remove.bind(Bet));
  before(Match.remove.bind(Match));
  before(Group.remove.bind(Group));
  before(GroupMember.remove.bind(GroupMember));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
    user.save(done);
  });

  it('should populate database', crawler);

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/championships/Serie-A-Brazil-2014');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(200);
    request.expect(function (response) {
      response.body.should.have.property('rounds').be.equal(38);
      response.body.should.have.property('currentRound').be.equal(14);
    });
    request.end(done);
  });

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/championships/Serie-A-Brazil-2014/matches/round-12-Atletico-PR-vs-Fluminense');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(200);
    request.expect(function (response) {
      response.body.should.have.property('guest').with.property('name').be.equal('Fluminense');
      response.body.should.have.property('guest').with.property('slug').be.equal('Fluminense');
      response.body.should.have.property('host').with.property('name').be.equal('Atlético PR');
      response.body.should.have.property('host').with.property('slug').be.equal('Atletico-PR');
      response.body.should.have.property('round').be.equal(12);
      response.body.should.have.property('elapsed').be.equal(null);
      response.body.should.have.property('date');
      response.body.should.have.property('finished').be.equal(true);
      response.body.should.have.property('result').with.property('guest').be.equal(3);
      response.body.should.have.property('result').with.property('host').be.equal(0);
    });
    request.end(done);
  });

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/championships/Serie-A-Brazil-2014/matches/round-13-Fluminense-vs-Goias');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(200);
    request.expect(function (response) {
      response.body.should.have.property('guest').with.property('name').be.equal('Goiás');
      response.body.should.have.property('guest').with.property('slug').be.equal('Goias');
      response.body.should.have.property('host').with.property('name').be.equal('Fluminense');
      response.body.should.have.property('host').with.property('slug').be.equal('Fluminense');
      response.body.should.have.property('round').be.equal(13);
      response.body.should.have.property('elapsed').be.equal(70);
      response.body.should.have.property('date');
      response.body.should.have.property('finished').be.equal(false);
      response.body.should.have.property('result').with.property('guest').be.equal(0);
      response.body.should.have.property('result').with.property('host').be.equal(2);
    });
    request.end(done);
  });

  after(function (done) {
    var request, credentials;
    credentials = auth.credentials();
    request = supertest(app);
    request = request.get('/championships/Serie-A-Brazil-2014/matches/round-14-Atletico-MG-vs-Palmeiras');
    request.set('auth-signature', credentials.signature);
    request.set('auth-timestamp', credentials.timestamp);
    request.set('auth-transactionId', credentials.transactionId);
    request.set('auth-token', auth.token(user));
    request.expect(200);
    request.expect(function (response) {
      response.body.should.have.property('guest').with.property('name').be.equal('Palmeiras');
      response.body.should.have.property('guest').with.property('slug').be.equal('Palmeiras');
      response.body.should.have.property('host').with.property('name').be.equal('Atlético MG');
      response.body.should.have.property('host').with.property('slug').be.equal('Atletico-MG');
      response.body.should.have.property('round').be.equal(14);
      response.body.should.have.property('elapsed').be.equal(null);
      response.body.should.have.property('date');
      response.body.should.have.property('finished').be.equal(false);
      response.body.should.have.property('result').with.property('guest').be.equal(0);
      response.body.should.have.property('result').with.property('host').be.equal(0);
    });
    request.end(done);
  });
});