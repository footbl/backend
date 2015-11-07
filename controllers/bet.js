'use strict';

var router = require('express').Router();
var async = require('async');
var Bet = require('../models/bet');

/**
 * @api {post} /bets Creates a new bet.
 * @apiName create
 * @apiGroup Bet
 *
 * @apiParam {Number} bid
 * @apiParam {ObjectId} match
 * @apiParam {String=draw,guest,host} result
 */
router
.route('/bets')
.post(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    require('../models/match').findOne().where('_id').equals(request.body.match).exec(next);
  }, function (match, next) {
    if (!match) return next(new Error('not found'));
    var bet = new Bet();
    bet.bid = request.body.bid;
    bet.result = request.body.result;
    bet.match = match;
    bet.user = request.session;
    async.series([bet.validate.bind(bet), bet.save.bind(bet), function (next) {
      request.session.update({'$inc' : {'funds' : -bet.bid, 'stake' : bet.bid}}, next);
    }, function (next) {
      var inc = {};
      inc['pot.' + bet.result] = bet.bid;
      match.update({'$inc' : inc}, next);
    }], next);
  }, function (result) {
    response.status(201).send(result[2].id);
  }], next);
});

/**
 * @api {get} /bets List all bets.
 * @apiName list
 * @apiGroup Bet
 */
router
.route('/bets')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    Bet.find().skip((request.query.page || 0) * 20).limit(20).exec(next);
  }, function (bets) {
    response.status(200).send(bets);
  }], next);
});

/**
 * @api {get} /bets/:id Get bet.
 * @apiName get
 * @apiGroup Bet
 */
router
.route('/bets/:id')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  response.status(200).send(request.bet);
});

/**
 * @api {put} /bets/:id Updates bet.
 * @apiName update
 * @apiGroup Bet
 *
 * @apiParam {Number} bid
 * @apiParam {String=draw,guest,host} result
 */
router
.route('/bets/:id')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.bet.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var bet = request.bet;
    var oldBid = bet.bid;
    var oldResult = bet.result;
    bet.bid = request.body.bid;
    bet.result = request.body.result;
    async.series([bet.validate.bind(bet), bet.save.bind(bet), function (next) {
      request.session.update({'$inc' : {'funds' : -bet.bid + oldBid, 'stake' : bet.bid - oldBid}}, next);
    }, function (next) {
      var inc = {};
      inc['pot.' + oldResult] = inc['pot.' + oldResult] || 0;
      inc['pot.' + oldResult] -= oldBid;
      inc['pot.' + bet.result] = inc['pot.' + bet.result] || 0;
      inc['pot.' + bet.result] += bet.bid;
      bet.match.update({'$inc' : inc}, next);
    }], next);
  }, function () {
    response.status(200).end();
  }], next);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Bet.findOne().where('_id').equals(id).exec(next);
  }, function (bet, next) {
    request.bet = bet;
    next(!bet ? new Error('not found') : null);
  }], next);
});

module.exports = router;
