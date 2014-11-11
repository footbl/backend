/*globals describe, before, it, after*/
require('should');
var supertest, app, auth,
User, CreditRequest, Championship, Team, Match, Bet,
user, otherUser, creditRequestedUser, otherCreditRequestedUser, championship, guestTeam, hostTeam, match;

supertest = require('supertest');
app = require('../index.js');
auth = require('auth');
User = require('../models/user');
CreditRequest = require('../models/credit-request');
Championship = require('../models/championship');
Team = require('../models/team');
Match = require('../models/match');
Bet = require('../models/bet');

describe('credit request controller', function () {
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
    otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
    otherUser.save(done);
  });

  before(function (done) {
    creditRequestedUser = new User({'password' : '1234', 'slug' : 'credit-requested-user'});
    creditRequestedUser.save(done);
  });

  before(function (done) {
    otherCreditRequestedUser = new User({'password' : '1234', 'slug' : 'other-credit-requested-user'});
    otherCreditRequestedUser.save(done);
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

  describe('create', function () {
    before(CreditRequest.remove.bind(CreditRequest));

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should create', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(201);
      request.expect(function (response) {
        response.body.should.have.property('creditedUser');
        response.body.should.have.property('chargedUser');
      });
      request.end(done);
    });

    it('should create virtual user with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/invalid/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(201);
      request.end(done);
    });
  });

  describe('list', function () {
    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/invalid/credit-requests');
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
      request = request.get('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body.every(function (creditRequest) {
          creditRequest.should.have.property('creditedUser');
          creditRequest.should.have.property('chargedUser');
        });
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/credit-requested-user/credit-requests');
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

  describe('list request credits', function () {
    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/requested-credits');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/invalid/requested-credits');
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
      request = request.get('/users/user/requested-credits');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body.every(function (creditRequest) {
          creditRequest.should.have.property('creditedUser');
          creditRequest.should.have.property('chargedUser');
        });
      });
      request.end(done);
    });

    it('should list mine', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/me/requested-credits');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1);
        response.body.every(function (creditRequest) {
          creditRequest.should.have.property('creditedUser');
          creditRequest.should.have.property('chargedUser');
        });
      });
      request.end(done);
    });

    it('should return empty in second page', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/user/requested-credits');
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
    var id;

    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body.slug;
      });
      request.end(done);
    });

    it('should raise error without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/credit-requested-user/credit-requests/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise error with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/invalid/credit-requests/' + id);
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
      request = request.get('/users/credit-requested-user/credit-requests/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(404);
      request.end(done);
    });

    it('should show', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.get('/users/credit-requested-user/credit-requests/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(200);
      request.expect(function (response) {
        response.body.should.have.property('creditedUser');
        response.body.should.have.property('chargedUser');
      });
      request.end(done);
    });
  });

  describe('approve', function () {
    describe('with sufficient funds', function () {
      var id;

      before(CreditRequest.remove.bind(CreditRequest));

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

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/users/credit-requested-user/credit-requests');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body.slug;
        });
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/users/other-credit-requested-user/credit-requests');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.end(done);
      });

      it('should raise without token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.expect(401);
        request.end(done);
      });

      it('should raise with other user token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(405);
        request.end(done);
      });

      it('should raise with invalid user id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/invalid/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(404);
        request.end(done);
      });

      it('should raise with invalid id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/invalid/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(404);
        request.end(done);
      });

      it('should approve', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('payed');
          response.body.should.have.property('creditedUser');
          response.body.should.have.property('chargedUser');
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/credit-requested-user');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('funds').be.equal(30);
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/user');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(200);
        request.expect(function (response) {
          response.body.should.have.property('funds').be.equal(100);
        });
        request.end(done);
      });

      after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/users/me/requested-credits');
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

    describe('without sufficient funds', function () {
      var id;

      before(CreditRequest.remove.bind(CreditRequest));

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

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.send({'bid' : 70});
        request.send({'result' : 'draw'});
        request.end(done);
      });

      before(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.post('/users/credit-requested-user/credit-requests');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(function (response) {
          id = response.body.slug;
        });
        request.end(done);
      });

      it('should raise without token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.expect(401);
        request.end(done);
      });

      it('should raise with other user token', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(405);
        request.end(done);
      });

      it('should raise with invalid user id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/invalid/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(404);
        request.end(done);
      });

      it('should raise with invalid id', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/invalid/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(404);
        request.end(done);
      });

      it('should raise error', function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.put('/users/credit-requested-user/credit-requests/' + id + '/approve');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(creditRequestedUser));
        request.expect(400);
        request.end(done);
      });
    });
  });

  describe('delete', function () {
    var id;

    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.post('/users/credit-requested-user/credit-requests');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(function (response) {
        id = response.body.slug;
      });
      request.end(done);
    });

    it('should raise without token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/credit-requested-user/credit-requests/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.expect(401);
      request.end(done);
    });

    it('should raise with other user token', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/credit-requested-user/credit-requests/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(user));
      request.expect(405);
      request.end(done);
    });

    it('should raise with invalid user id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/invalid/credit-requests/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(creditRequestedUser));
      request.expect(404);
      request.end(done);
    });

    it('should raise with invalid id', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/credit-requested-user/credit-requests/invalid');
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(creditRequestedUser));
      request.expect(404);
      request.end(done);
    });

    it('should remove', function (done) {
      var request, credentials;
      credentials = auth.credentials();
      request = supertest(app);
      request = request.del('/users/credit-requested-user/credit-requests/' + id);
      request.set('auth-signature', credentials.signature);
      request.set('auth-timestamp', credentials.timestamp);
      request.set('auth-transactionId', credentials.transactionId);
      request.set('auth-token', auth.token(creditRequestedUser));
      request.expect(204);
      request.end(done);
    });
  });
});