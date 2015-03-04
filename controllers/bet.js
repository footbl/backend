'use strict';

var router, nconf, async, auth, push, crypto,
    Championship, Match, Bet, User;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Championship = require('../models/championship');
Match = require('../models/match');
Bet = require('../models/bet');
User = require('../models/user');

/**
 * @api {POST} /championships/:championship/matches/:match/bets
 * @apiName createBet
 * @apiGroup Bet
 *
 * @apiParam {Number} bid Bet bid.
 * @apiParam {String='guest','host','draw'} result Bet result.
 */
router
.route('/championships/:championship/matches/:match/bets')
.post(auth.session())
.post(function createBet(request, response, next) {
  async.waterfall([function (next) {
    var bet;
    bet = new Bet();
    bet.user = request.session._id;
    bet.match = request.match._id;
    bet.bid = request.body.bid;
    bet.result = request.body.result;
    bet.save(next);
  }, function (bet, _, next) {
    bet.populate('user');
    bet.populate('match');
    bet.populate(next);
  }, function (bet, next) {
    response.status(201);
    response.send(bet);
    next();
  }], next);
});

/**
 * @api {GET} /championships/:championship/matches/:match/bets
 * @apiName listBet
 * @apiGroup Bet
 */
router
.route('/championships/:championship/matches/:match/bets')
.get(auth.session())
.get(function listBet(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Bet.find();
    query.where('match').equals(request.match._id);
    query.populate('user');
    query.populate('match');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (bets, next) {
    response.status(200);
    response.send(bets);
    next();
  }], next);
});

/**
 * @api {GET} /championships/:championship/matches/:match/bets/:bet
 * @apiName getBet
 * @apiGroup Bet
 */
router
.route('/championships/:championship/matches/:match/bets/:bet')
.get(auth.session())
.get(function getBet(request, response, next) {
  async.waterfall([function (next) {
    var bet;
    bet = request.bet;
    response.status(200);
    response.send(bet);
    next();
  }], next);
});

/**
 * @api {PUT} /championships/:championship/matches/:match/bets/:bet
 * @apiName updateBet
 * @apiGroup Bet
 *
 * @apiParam {Number} bid Bet bid.
 * @apiParam {String='guest','host','draw'} result Bet result.
 */
router
.route('/championships/:championship/matches/:match/bets/:bet')
.put(auth.session())
.put(auth.checkMethod('bet', 'user'))
.put(function updateBet(request, response, next) {
  async.waterfall([function (next) {
    var bet;
    bet = request.bet;
    bet.bid = request.body.bid;
    bet.result = request.body.result;
    bet.save(next);
  }, function (bet, _, next) {
    bet.populate('user');
    bet.populate('match');
    bet.populate(next);
  }, function (bet, next) {
    response.status(200);
    response.send(bet);
    next();
  }], next);
});

/**
 * @api {GET} /users/:user/bets
 * @apiName listBet
 * @apiGroup Bet
 */
router
.route('/users/:user/bets')
.get(auth.session())
.get(function listUserBets(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Bet.find();
    query.where('user').equals(request.user._id);
    query.populate('user');
    query.populate('match');
    query.sort('-updatedAt');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (bets, next) {
    response.status(200);
    response.send(bets);
    next();
  }], next);
});

router.param('bet', function findBet(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Bet.findOne();
    query.populate('user');
    query.populate('match');
    query.where('match').equals(request.match._id);
    query.where('_id').equals(id);
    query.exec(next);
  }, function (bet, next) {
    request.bet = bet;
    next(!bet ? new Error('not found') : null);
  }], next);
});

router.param('match', function findMatch(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Match.findOne();
    query.where('championship').equals(request.championship._id);
    query.where('_id').equals(id);
    query.exec(next);
  }, function (match, next) {
    request.match = match;
    next(!match ? new Error('not found') : null);
  }], next);
});

router.param('championship', function findChampionship(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Championship.findOne();
    query.where('_id').equals(id);
    query.exec(next);
  }, function (championship, next) {
    request.championship = championship;
    next(!championship ? new Error('not found') : null);
  }], next);
});

router.param('user', function findUser(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('_id').equals(id);
    query.populate('entries');
    query.populate('starred');
    query.exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

module.exports = router;