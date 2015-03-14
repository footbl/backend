'use strict';

var router, nconf, async, auth, push, crypto,
    User, Prize;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

User = require('../models/user');
Prize = require('../models/prize');

/**
 * @api {GET} /users/:user/prizes listPrize
 * @apiName listPrize
 * @apiGroup Prize
 *
 * @apiExample HTTP/1.1 200
 * [{
 *   "_id": "54f8ec1af6ee09b2dcf7ccf1",
 *   "value": 2,
 *   "type": "daily",
 *   "createdAt": "2015-03-05T23:51:54.923Z",
 *   "updatedAt": "2015-03-05T23:51:54.924Z"
 * }]
 */
router
.route('/users/:user/prizes')
.get(auth.session())
.get(function listPrize(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Prize.find();
    query.where('user').equals(request.session._id);
    query.sort('-createdAt');
    if (request.body.unreadMessages) query.where('seenBy').ne(request.session._id);
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (prizes, next) {
    response.status(200);
    response.send(prizes);
    next();
  }], next);
});

/**
 * @api {GET} /users/:user/prizes/:prize' getPrize
 * @apiName getPrize
 * @apiGroup Prize
 *
 * @apiExample HTTP/1.1 200
 * {
 *   "_id": "54f8ec1af6ee09b2dcf7ccf1",
 *   "value": 2,
 *   "type": "daily",
 *   "createdAt": "2015-03-05T23:51:54.923Z",
 *   "updatedAt": "2015-03-05T23:51:54.924Z"
 * }
 */
router
.route('/users/:user/prizes/:prize')
.get(auth.session())
.get(function getPrize(request, response, next) {
  async.waterfall([function (next) {
    var prize;
    prize = request.prize;
    response.status(200);
    response.send(prize);
    next();
  }], next);
});

/**
 * @api {PUT} /users/:user/prizes/:prize/mark-as-read markAsReadPrize
 * @apiName markAsReadPrize
 * @apiGroup Prize
 *
 * @apiExample HTTP/1.1 200
 * {
 *   "_id": "54f8ec1af6ee09b2dcf7ccf1",
 *   "value": 2,
 *   "type": "daily",
 *   "createdAt": "2015-03-05T23:51:54.923Z",
 *   "updatedAt": "2015-03-05T23:51:54.924Z"
 * }
 */
router
.route('/users/:user/prizes/:prize/mark-as-read')
.put(auth.session())
.put(function markAsReadPrize(request, response, next) {
  async.waterfall([function (next) {
    var prize;
    prize = request.prize;
    prize.seenBy.push(request.user._id);
    prize.save(next);
  }, function (prize, _, next) {
    response.status(200);
    response.send(prize);
    User.update({'_id' : prize.user}, {'$inc' : {'seasons.0.funds' : prize.value}}, next);
  }], next);
});

router.param('prize', function findPrize(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Prize.findOne();
    query.where('user').equals(request.user._id);
    query.where('_id').equals(id);
    query.exec(next);
  }, function (prize, next) {
    request.prize = prize;
    next(!prize ? new Error('not found') : null);
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

module.exports = router;
