'use strict';

var router = require('express').Router();
var async = require('async');
var Prize = require('../models/prize');

/**
 * @api {get} /prizes List all prizes.
 * @apiName list
 * @apiGroup Prize
 */
router
.route('/prizes')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    Prize.find()
    .where('user').equals(request.session.id)
    .skip((request.query.page || 0) * 20).limit(20).exec(next);
  }, function (prizes) {
    response.status(200).send(prizes);
  }], next);
});

/**
 * @api {get} /prizes/:id Get prize.
 * @apiName get
 * @apiGroup Prize
 */
router
.route('/prizes/:id')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.prize.user.id) throw new Error('invalid method');
  response.status(200).send(request.prize);
});

/**
 * @api {put} /prizes/:id/mark-as-read Mark prize as read.
 * @apiName markAsRead
 * @apiGroup Prize
 */
router
.route('/prizes/:id/mark-as-read')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.prize.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    async.parallel([function (next) {
      request.prize.update({'$addToSet' : {'seenBy' : request.session.id}}, next);
    }, function (next) {
      request.prize.user.update({'$inc' : {'funds' : request.prize.value}}, next);
    }], next);
  }, function () {
    response.status(200).end();
  }], next);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Prize.findOne().where('_id').equals(id).exec(next);
  }, function (prize, next) {
    request.prize = prize;
    next(!prize ? new Error('not found') : null);
  }], next);
});

module.exports = router;
