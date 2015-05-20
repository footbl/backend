'use strict';

var router, nconf, async, auth, push, crypto,
    Bet, User;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Bet = require('../models/bet');
User = require('../models/user');

/**
 * @api {post} /users/:user/bets Creates a new bet.
 * @apiName createBet
 * @apiGroup bet
 *
 * @apiParam {ObjectId} match Bet match.
 * @apiParam {Number} bid Bet bid.
 * @apiParam {String} result Bet result.
 */
router
.route('/users/:user/bets')
.post(auth.session())
.post(auth.checkMethod('user'))
.post(function createBet(request, response, next) {
  async.waterfall([function (next) {
    var bet;
    bet = new Bet();
    bet.bid = request.body.bid;
    bet.result = request.body.result;
    bet.match = request.body.match;
    bet.user = request.session._id;
    bet.save(next);
  }, function (bet, _, next) {
    bet.populate('user');
    bet.populate('match');
    bet.populate(next);
  }, function (bet, next) {
    var user, match;
    user = bet.user;
    match = bet.match;
    user.funds -= bet.bid;
    user.stake += bet.bid;
    match.pot[bet.result] += bet.bid;
    response.status(201);
    response.send(bet);
    async.parallel([user.save.bind(user), match.save.bind(match)], next);
  }], next);
});

/**
 * @api {get} /users/:user/bets List all bets.
 * @apiName listBet
 * @apiGroup bet
 *
 * @apiParam {String} [page=0] The page to be displayed.
 */
router
.route('/users/:user/bets')
.get(auth.session())
.get(function listBet(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Bet.find();
    query.where('user').equals(request.user._id);
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
 * @api {get} /users/:user/bets/:bet Get bet.
 * @apiName getBet
 * @apiGroup bet
 */
router
.route('/users/:user/bets/:bet')
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
 * @api {put} /users/:user/bets/:bet Updates bet.
 * @apiName updateBet
 * @apiGroup bet
 *
 * @apiParam {Number} bid Bet bid.
 * @apiParam {String} result Bet result.
 */
router
.route('/users/:user/bets/:bet')
.put(auth.session())
.put(auth.checkMethod('bet', 'user'))
.put(function updateBet(request, response, next) {
  async.waterfall([function (next) {
    var bet;
    bet = request.bet;
    request.oldBid = bet.bid;
    request.oldResult = bet.result;
    bet.bid = request.body.bid;
    bet.result = request.body.result;
    bet.save(next);
  }, function (bet, _, next) {
    bet.populate('user');
    bet.populate('match');
    bet.populate(next);
  }, function (bet, next) {
    var user, match;
    user = bet.user;
    match = bet.match;
    user.funds += request.oldBid - bet.bid;
    user.stake += bet.bid - request.oldBid;
    match.pot[bet.result] += bet.bid;
    match.pot[request.oldResult] -= request.oldBid;
    response.status(200);
    response.send(bet);
    async.parallel([user.save.bind(user), match.save.bind(match)], next);
  }], next);
});

router.param('user', function findUser(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('_id').equals(id);
    query.exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

router.param('bet', function findBet(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Bet.findOne();
    query.populate('user');
    query.populate('match');
    query.where('user').equals(request.user._id);
    query.where('_id').equals(id);
    query.exec(next);
  }, function (bet, next) {
    request.bet = bet;
    next(!bet ? new Error('not found') : null);
  }], next);
});

module.exports = router;
