/*globals describe, before, it*/
'use strict';

var supertest, app, auth,
User, Championship, Match,
user, championship, match, now;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
now = new Date();

describe('championship controller', function () {
  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Match.remove.bind(Match));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
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
    match = new Match({
      'round'        : 1,
      'date'         : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      'guest'        : {
        'name'    : 'botafogo',
        'slug'    : 'botafogo',
        'picture' : 'http://pictures.com/botafogo.png'
      },
      'host'         : {
        'name'    : 'fluminense',
        'picture' : 'http://pictures.com/fluminense.png'
      },
      'championship' : championship._id,
      'slug'         : 'round-1-fluminense-vs-botafogo'
    });
    match.save(done);
  });

  describe('list championships', function () {
    it('should list', function (done) {
      var request;
      request = app.get('/championships');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request;
      request = app.get('/championships');
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
    it('should raise error with invalid id', function (done) {
      var request;
      request = app.get('/championships/invalid');
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should return', function (done) {
      var request;
      request = app.get('/championships/brasileirao-brasil-2014');
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
    it('should raise error with invalid championship', function (done) {
      var request;
      request = app.get('/championships/invalid/matches');
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should list', function (done) {
      var request;
      request = app.get('/championships/brasileirao-brasil-2014/matches');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request;
      request = app.get('/championships/brasileirao-brasil-2014/matches');
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
    it('should raise error with invalid championship', function (done) {
      var request;
      request = app.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo');
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should raise error with invalid id', function (done) {
      var request;
      request = app.get('/championships/brasileirao-brasil-2014/matches/invalid');
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should return', function (done) {
      var request;
      request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('slug').be.equal('round-1-fluminense-vs-botafogo');
        response.body.should.have.property('guest').with.property('name').be.equal('botafogo');
        response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
        response.body.should.have.property('host').with.property('name').be.equal('fluminense');
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