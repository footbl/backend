/*globals describe, before, it*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
Season, User, Championship, Match;

supertest = require('supertest');
auth = require('auth');
nock = require('nock');
nconf = require('nconf');
crypto = require('crypto');
app = supertest(require('../index.js'));

Season = require('../models/season');
User = require('../models/user');
Championship = require('../models/championship');
Match = require('../models/match');

nconf.defaults(require('../config'));

describe('match', function () {
  var user, championship;

  before(Season.remove.bind(Season));
  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));

  before(function (done) {
    var season;
    season = new Season({
      'finishAt'  : new Date(),
      'createdAt' : new Date()
    });
    season.save(done);
  });

  before(function (done) {
    user = new User();
    user.password = crypto.createHash('sha1').update('1234' + nconf.get('PASSWORD_SALT')).digest('hex');
    user.country = 'Brazil';
    user.save(done);
  });

  before(function (done) {
    championship = new Championship({
      'name'    : 'brasileirão',
      'type'    : 'national league',
      'country' : 'Brazil'
    });
    championship.save(done);
  });

  describe('list', function () {
    before(Match.remove.bind(Match));

    before(function (done) {
      var match;
      match = new Match({
        'round'        : 1,
        'date'         : new Date(),
        'guest'        : {'name' : 'botafogo', 'picture' : 'http://pictures.com/botafogo.png'},
        'host'         : {'name' : 'fluminense', 'picture' : 'http://pictures.com/fluminense.png'},
        'championship' : championship._id
      });
      match.save(done);
    });

    it('should list one championship', function (done) {
      var request;
      request = app.get('/championships/' + championship._id + '/matches');
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
      });
      request.end(done);
    });
  });

  describe('get', function () {
    var match;

    before(Match.remove.bind(Match));

    before(function (done) {
      match = new Match({
        'round'        : 1,
        'date'         : new Date(),
        'guest'        : {'name' : 'botafogo', 'picture' : 'http://pictures.com/botafogo.png'},
        'host'         : {'name' : 'fluminense', 'picture' : 'http://pictures.com/fluminense.png'},
        'championship' : championship._id
      });
      match.save(done);
    });

    it('should list one championship', function (done) {
      var request;
      request = app.get('/championships/' + championship._id + '/matches/' + match._id);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
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
