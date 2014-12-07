/*globals describe, before, beforeEach, afterEach, it, after*/
var supertest, app, auth,
User, Championship, Match, Bet,
user, otherUser, championship, match, now;

require('should');
supertest = require('supertest');
app = supertest(require('../../index.js'));
auth = require('auth');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
Bet = require('../../models/bet');
now = new Date();

describe('bet controller', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Match.remove.bind(Match));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
    user.save(done);
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
    match = new Match({
      '_id'          : 1,
      'round'        : 1,
      'date'         : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      'guest'        : {
        'name'    : 'botafogo',
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

  beforeEach('remove bets', Bet.remove.bind(Bet));

  beforeEach('reset user funds', function (done) {
    User.update({'_id' : user._id}, {'$set' : {
      'funds' : 100,
      'stake' : 0
    }}, done);
  });

  beforeEach('reset match status', function (done) {
    Match.update({'_id' : match._id}, {'$set' : {
      'finished' : false,
      'elapsed'  : null,
      'date'     : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      'pot'      : {
        'guest' : 0,
        'host'  : 0,
        'draw'  : 0
      },
      'result'   : {
        'guest' : 0,
        'host'  : 0
      }
    }}, done);
  });

  describe('create', function () {
    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid championship', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid match', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/invalid/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('without bid and valid result', function () {
      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'result' : 'invalid'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal('required');
          response.body.should.have.property('result').be.equal('enum');
        });
        request.end(done);
      });
    });

    describe('with a created bet', function () {
      beforeEach('create a bet', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.end(done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(409);
        request.end(done);
      });
    });

    describe('without insufficient funds', function () {
      beforeEach('remove user funds', function (done) {
        User.update({'_id' : user._id}, {'$set' : {
          'funds' : 10,
          'stake' : 0
        }}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal('insufficient funds');
        });
        request.end(done);
      });
    });

    describe('with finished match', function () {
      beforeEach('finish match', function (done) {
        Match.update({'_id' : match._id}, {'$set' : {'finished' : true}}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('match').be.equal('match already started');
        });
        request.end(done);
      });
    });

    describe('with live match', function () {
      beforeEach('set match live', function (done) {
        Match.update({'_id' : match._id}, {'$set' : {'elapsed' : 10}}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('match').be.equal('match already started');
        });
        request.end(done);
      });
    });

    describe('with valid credentials, match, bid and result', function () {
      it('should create', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(201);
        request.expect(function (response) {
          response.body.should.have.property('slug').be.equal('round-1-fluminense-vs-botafogo-user');
          response.body.should.have.property('bid').be.equal(50);
          response.body.should.have.property('result').be.equal('draw');
          response.body.should.have.property('user').with.property('slug').be.equal('user');
          response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('jackpot').be.equal(50);
          response.body.should.have.property('pot').with.property('draw').be.equal(50);
          response.body.should.have.property('pot').with.property('guest').be.equal(0);
          response.body.should.have.property('pot').with.property('host').be.equal(0);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(50);
          response.body.should.have.property('funds').be.equal(50);
        });
        request.end(done);
      });
    });
  });

  describe('list match bets', function () {
    describe('without token', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid championship', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid match', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/invalid/bets');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one bet created', function () {
      beforeEach('create a bet', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
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
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
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
  });

  describe('list user bets', function () {
    describe('without token', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/users/user/bets');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid user id', function () {
      it('should raise error ', function (done) {
        var request;
        request = app.get('/users/invalid/bets');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with one bet created', function () {
      beforeEach('create a bet', function (done) {
        var request;
        request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.end(done);
      });

      it('should list one in first page', function (done) {
        var request;
        request = app.get('/users/user/bets');
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
        request = app.get('/users/user/bets');
        request.set('auth-token', auth.token(user));
        request.send({'page' : 1});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(0);
        });
        request.end(done);
      });

      it('should list one in first page of mine bets', function (done) {
        var request;
        request = app.get('/users/me/bets');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1);
        });
        request.end(done);
      });

      it('should return empty in second page of mine bets', function (done) {
        var request;
        request = app.get('/users/me/bets');
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
  });

  describe('details', function () {
    beforeEach('create a bet', function (done) {
      var request;
      request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 50});
      request.send({'result' : 'draw'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with invalid championship', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid match', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/invalid/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with valid credentials', function () {
      it('should return', function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal(50);
          response.body.should.have.property('result').be.equal('draw');
          response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
          response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
          response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
          response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
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
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal(50);
          response.body.should.have.property('result').be.equal('draw');
          response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
          response.body.should.have.property('match').with.property('guest').with.property('name').be.equal('botafogo');
          response.body.should.have.property('match').with.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
          response.body.should.have.property('match').with.property('host').with.property('name').be.equal('fluminense');
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
  });

  describe('update', function () {
    beforeEach('create a bet', function (done) {
      var request;
      request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 10});
      request.send({'result' : 'guest'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(otherUser));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid championship', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid match', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/invalid/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('without bid and valid result', function () {
      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'result' : 'invalid'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal('required');
          response.body.should.have.property('result').be.equal('enum');
        });
        request.end(done);
      });
    });

    describe('without insufficient funds', function () {
      beforeEach('remove user funds', function (done) {
        User.update({'_id' : user._id}, {'$set' : {
          'funds' : 10,
          'stake' : 0
        }}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal('insufficient funds');
        });
        request.end(done);
      });
    });

    describe('with finished match', function () {
      beforeEach('finish match', function (done) {
        Match.update({'_id' : match._id}, {'$set' : {'finished' : true}}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('match').be.equal('match already started');
        });
        request.end(done);
      });
    });

    describe('with live match', function () {
      beforeEach('set match live', function (done) {
        Match.update({'_id' : match._id}, {'$set' : {'elapsed' : 10}}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(400);
        request.expect(function (response) {
          response.body.should.have.property('match').be.equal('match already started');
        });
        request.end(done);
      });
    });

    describe('with valid credentials, match, bid and result', function () {
      it('should update', function (done) {
        var request;
        request = app.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.send({'bid' : 50});
        request.send({'result' : 'draw'});
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('slug').be.equal('round-1-fluminense-vs-botafogo-user');
          response.body.should.have.property('bid').be.equal(50);
          response.body.should.have.property('result').be.equal('draw');
          response.body.should.have.property('user').with.property('slug').be.equal('user');
          response.body.should.have.property('match').with.property('slug').be.equal('round-1-fluminense-vs-botafogo');
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('jackpot').be.equal(50);
          response.body.should.have.property('pot').with.property('draw').be.equal(50);
          response.body.should.have.property('pot').with.property('guest').be.equal(0);
          response.body.should.have.property('pot').with.property('host').be.equal(0);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(50);
          response.body.should.have.property('funds').be.equal(50);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/mine');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('bid').be.equal(50);
          response.body.should.have.property('result').be.equal('draw');
        });
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    beforeEach('create a bet', function (done) {
      var request;
      request = app.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
      request.set('auth-token', auth.token(user));
      request.send({'bid' : 10});
      request.send({'result' : 'guest'});
      request.end(done);
    });

    describe('without token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.expect(401);
        request.end(done);
      });
    });

    describe('with other user token', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(otherUser));
        request.expect(405);
        request.end(done);
      });
    });

    describe('with invalid championship', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/invalid/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid match', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/invalid/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with invalid id', function () {
      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/invalid');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });
    });

    describe('with finished match', function () {
      beforeEach('finish match', function (done) {
        Match.update({'_id' : match._id}, {'$set' : {'finished' : true}}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.end(done);
      });
    });

    describe('with live match', function () {
      beforeEach('set match live', function (done) {
        Match.update({'_id' : match._id}, {'$set' : {'elapsed' : 10}}, done);
      });

      it('should raise error', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(400);
        request.end(done);
      });
    });

    describe('with valid credentials and match', function () {
      it('should delete', function (done) {
        var request;
        request = app.del('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(204);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets/round-1-fluminense-vs-botafogo-user');
        request.set('auth-token', auth.token(user));
        request.expect(404);
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('pot').with.property('draw').be.equal(0);
          response.body.should.have.property('pot').with.property('guest').be.equal(0);
          response.body.should.have.property('pot').with.property('host').be.equal(0);
        });
        request.end(done);
      });

      afterEach(function (done) {
        var request;
        request = app.get('/users/me');
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('stake').be.equal(0);
          response.body.should.have.property('funds').be.equal(100);
        });
        request.end(done);
      });
    });
  });
});