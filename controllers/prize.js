'use strict';

var router, nconf, slug, async, auth, push, User, Prize;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
User = require('../models/user');
Prize = require('../models/prize');

/**
 * @api {get} /users/:prize/prizes List user prizes.
 * @apiName listPrizes
 * @apiVersion 2.2.0
 * @apiGroup prize
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Boolean} [unreadMessages] Only displays unread messages.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "213123123",
 *  "value": 1,
 *  "type": "daily",
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/users/:user/prizes')
.get(auth.session())
.get(function listPrizes(request, response, next) {
  async.waterfall([function (next) {
    var unreadMessages, pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    unreadMessages = request.param('unreadMessages');
    query = Prize.find();
    query.where('user').equals(request.session._id);
    query.sort('-createdAt');
    if (unreadMessages) query.where('seenBy').ne(request.session._id);
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
 * @api {get} /users/:user/prizes/:prize Get prize.
 * @apiName getPrize
 * @apiVersion 2.2.0
 * @apiGroup prize
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "213123123",
 *  "value": 1,
 *  "type": "daily",
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/prizes/:prize')
.get(auth.session())
.get(function getPrizes(request, response, next) {
  async.waterfall([function (next) {
    var prize;
    prize = request.prize;
    response.status(200);
    response.send(prize);
    next();
  }], next);
});

/**
 * @api {put} /users/:user/prizes/:prize/mark-as-read Mark as read prize.
 * @apiName markAsReadPrize
 * @apiVersion 2.2.0
 * @apiGroup prize
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "213123123",
 *  "value": 1,
 *  "type": "daily",
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/prizes/:prize/mark-as-read')
.put(auth.session())
.put(function markAsReadPrize(request, response, next) {
  async.waterfall([function (next) {
    var prize;
    prize = request.prize;
    prize.markAsRead(request.session._id, next);
  }, function (_, next) {
    var prize;
    prize = request.prize;
    response.status(200);
    response.send(prize);
    next();
  }], next);
});

router.param('prize', function findPrize(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Prize.findOne();
    query.where('user').equals(request.user._id);
    query.where('slug').equals(id);
    query.exec(next);
  }, function (prize, next) {
    request.prize = prize;
    next(!prize ? new Error('not found') : null);
  }], next);
});

router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    if (id === 'me') {
      query.where('_id').equals(request.session._id);
    } else {
      query.where('slug').equals(id);
    }
    query.exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

module.exports = router;