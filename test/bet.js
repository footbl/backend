/*globals describe, before, it, after*/
'use strict';
require('should');

var supertest, auth, nock, nconf, crypto, app,
Season, User, Championship, Match, Bet;

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
Bet = require('../models/bet');

nconf.defaults(require('../config'));

describe('bet', function () {
  var user, championship, match;

  before(Season.remove.bind(Season));
  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Match.remove.bind(Match));

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

  describe('create', function () {
    before(Bet.remove.bind(Bet));

    describe('with finished match', function () {
      before(function (done) {
        match.finished = true;
        match.pot.guest = 0;
        match.pot.host = 0;
        match.pot.draw = 0;
        match.save(done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.post('/users/' + user._id + '/bets');
        request.set('auth-token', auth.token(user));
        request.send({'match' : match._id});
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('match').be.equal('match already started');
        });
        request.end(done);
      });
    });

    describe('with unfinished match', function () {
      before(function (done) {
        match.finished = false;
        match.pot.guest = 0;
        match.pot.host = 0;
        match.pot.draw = 0;
        match.save(done);
      });

      describe('with insufficient funds', function () {
        before(function (done) {
          user.funds = 10;
          user.stake = 0;
          user.save(done);
        });

        it('should raise error', function (done) {
          var request;
          request = app.post('/users/' + user._id + '/bets');
          request.set('auth-token', auth.token(user));
          request.send({'match' : match._id});
          request.send({'bid' : 50});
          request.send({'result' : 'draw'});
          request.expect(400);
          request.expect(function (response) {
            response.body.should.have.property('bid').be.equal('insufficient funds');
          });
          request.end(done);
        });
      });

      describe('with sufficient funds', function () {
        before(function (done) {
          user.funds = 100;
          user.stake = 0;
          user.save(done);
        });

        describe('without match', function () {
          it('raise error', function (done) {
            var request;
            request = app.post('/users/' + user._id + '/bets');
            request.set('auth-token', auth.token(user));
            request.send({'bid' : 50});
            request.send({'result' : 'draw'});
            request.expect(400);
            request.expect(function (response) {
              response.body.should.have.property('match').be.equal('required');
            });
            request.end(done);
          });
        });

        describe('without bid', function () {
          it('raise error', function (done) {
            var request;
            request = app.post('/users/' + user._id + '/bets');
            request.set('auth-token', auth.token(user));
            request.send({'match' : match._id});
            request.send({'result' : 'draw'});
            request.expect(400);
            request.expect(function (response) {
              response.body.should.have.property('bid').be.equal('required');
            });
            request.end(done);
          });
        });

        describe('without result', function () {
          it('raise error', function (done) {
            var request;
            request = app.post('/users/' + user._id + '/bets');
            request.set('auth-token', auth.token(user));
            request.send({'match' : match._id});
            request.send({'bid' : 50});
            request.expect(400);
            request.expect(function (response) {
              response.body.should.have.property('result').be.equal('required');
            });
            request.end(done);
          });
        });

        describe('with valid bid, match and result', function () {
          it('should create', function (done) {
            var request;
            request = app.post('/users/' + user._id + '/bets');
            request.set('auth-token', auth.token(user));
            request.send({'match' : match._id});
            request.send({'bid' : 50});
            request.send({'result' : 'draw'});
            request.expect(201);
            request.expect(function (response) {
              response.body.should.have.property('match').with.property('round').be.equal(1);
              response.body.should.have.property('bid').be.equal(50);
              response.body.should.have.property('result').be.equal('draw');
            });
            request.end(done);
          });

          after(function (done) {
            var request;
            request = app.get('/championships/' + championship._id + '/matches/' + match._id);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
              response.body.should.have.property('pot').with.property('guest').be.equal(0);
              response.body.should.have.property('pot').with.property('host').be.equal(0);
              response.body.should.have.property('pot').with.property('draw').be.equal(50);
            });
            request.end(done);
          });

          after(function (done) {
            var request;
            request = app.get('/users/' + user._id);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
              response.body.should.have.property('funds').be.equal(50);
              response.body.should.have.property('stake').be.equal(50);
            });
            request.end(done);
          });
        });
      });
    });
  });

  describe('list', function () {
    before(Bet.remove.bind(Bet));

    before(function (done) {
      match.finished = false;
      match.pot.guest = 0;
      match.pot.host = 0;
      match.pot.draw = 0;
      match.save(done);
    });

    before(function (done) {
      user.funds = 100;
      user.stake = 0;
      user.save(done);
    });

    before(function (done) {
      var bet;
      bet = new Bet();
      bet.bid = 40;
      bet.result = 'draw';
      bet.match = match;
      bet.user = user;
      bet.save(done);
    });

    it('should list one bet', function (done) {
      var request;
      request = app.get('/users/' + user._id + '/bets');
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
    var bet;

    before(Bet.remove.bind(Bet));

    before(function (done) {
      match.finished = false;
      match.pot.guest = 0;
      match.pot.host = 0;
      match.pot.draw = 0;
      match.save(done);
    });

    before(function (done) {
      user.funds = 100;
      user.stake = 0;
      user.save(done);
    });

    before(function (done) {
      bet = new Bet();
      bet.bid = 40;
      bet.result = 'draw';
      bet.match = match;
      bet.user = user;
      bet.save(done);
    });

    it('should return', function (done) {
      var request;
      request = app.get('/users/' + user._id + '/bets/' + bet._id);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('bid').be.equal(40);
        response.body.should.have.property('result').be.equal('draw');
        response.body.should.have.property('match');
        response.body.should.have.property('user');
      });
      request.end(done);
    });
  });

  describe('update', function () {
    var bet;

    before(Bet.remove.bind(Bet));

    before(function (done) {
      bet = new Bet();
      bet.bid = 40;
      bet.result = 'guest';
      bet.match = match;
      bet.user = user;
      bet.save(done);
    });

    describe('with finished match', function () {
      before(function (done) {
        match.finished = true;
        match.pot.guest = 40;
        match.pot.host = 0;
        match.pot.draw = 0;
        match.save(done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.put('/users/' + user._id + '/bets/' + bet._id);
        request.set('auth-token', auth.token(user));
        request.send({'match' : match._id});
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('match').be.equal('match already started');
        });
        request.end(done);
      });
    });

    describe('with unfinished match', function () {
      before(function (done) {
        match.finished = false;
        match.pot.guest = 40;
        match.pot.host = 0;
        match.pot.draw = 0;
        match.save(done);
      });

      describe('with insufficient funds', function () {
        before(function (done) {
          user.funds = 5;
          user.stake = 40;
          user.save(done);
        });

        it('should raise error', function (done) {
          var request;
          request = app.put('/users/' + user._id + '/bets/' + bet._id);
          request.set('auth-token', auth.token(user));
          request.send({'match' : match._id});
          request.send({'bid' : 50});
          request.send({'result' : 'draw'});
          request.expect(400);
          request.expect(function (response) {
            response.body.should.have.property('bid').be.equal('insufficient funds');
          });
          request.end(done);
        });
      });

      describe('with sufficient funds', function () {
        before(function (done) {
          user.funds = 60;
          user.stake = 40;
          user.save(done);
        });

        describe('without bid', function () {
          it('raise error', function (done) {
            var request;
            request = app.put('/users/' + user._id + '/bets/' + bet._id);
            request.set('auth-token', auth.token(user));
            request.send({'match' : match._id});
            request.send({'result' : 'draw'});
            request.expect(400);
            request.expect(function (response) {
              response.body.should.have.property('bid').be.equal('required');
            });
            request.end(done);
          });
        });

        describe('without result', function () {
          it('raise error', function (done) {
            var request;
            request = app.put('/users/' + user._id + '/bets/' + bet._id);
            request.set('auth-token', auth.token(user));
            request.send({'match' : match._id});
            request.send({'bid' : 50});
            request.expect(400);
            request.expect(function (response) {
              response.body.should.have.property('result').be.equal('required');
            });
            request.end(done);
          });
        });

        describe('with valid bid, match and result', function () {
          it('should update', function (done) {
            var request;
            request = app.put('/users/' + user._id + '/bets/' + bet._id);
            request.set('auth-token', auth.token(user));
            request.send({'match' : match._id});
            request.send({'bid' : 50});
            request.send({'result' : 'draw'});
            request.expect(200);
            request.expect(function (response) {
              response.body.should.have.property('match').with.property('round').be.equal(1);
              response.body.should.have.property('bid').be.equal(50);
              response.body.should.have.property('result').be.equal('draw');
            });
            request.end(done);
          });

          after(function (done) {
            var request;
            request = app.get('/users/' + user._id);
            request.set('auth-token', auth.token(user));
            request.expect(200);
            request.expect(function (response) {
              response.body.should.have.property('funds').be.equal(50);
              response.body.should.have.property('stake').be.equal(50);
            });
            request.end(done);
          });
        });
      });
    });
  });
});
