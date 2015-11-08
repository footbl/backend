'use strict';

var router = require('express').Router();
var async = require('async');
var Challenge = require('../models/challenge');

/**
 * @api {post} /challenges Creates a new challenge.
 * @apiName create
 * @apiGroup Challenge
 * @apiUse defaultHeaders
 *
 * @apiParam {Number} bid
 * @apiParam {ObjectId} match
 * @apiParam {ObjectId} user
 * @apiParam {String=draw,guest,host} result
 */
router
.route('/challenges')
.post(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    var challenge = new Challenge();
    challenge.bid = request.body.bid;
    challenge.match = request.body.match;
    challenge.challenger.user = request.session;
    challenge.challenger.result = request.body.result;
    challenge.challenged.user = request.body.user;
    async.series([challenge.validate.bind(challenge), challenge.save.bind(challenge), function (next) {
      request.session.update({'$inc' : {'funds' : -challenge.bid, 'stake' : challenge.bid}}, next);
    }], next);
  }, function (result) {
    response.status(201).send(result[1].id);
  }], next);
});

/**
 * @api {get} /challenges List all challenges.
 * @apiName list
 * @apiGroup Challenge
 * @apiUse defaultHeaders
 * @apiUse defaultPaging
 *
 * @apiParam {ObjectId} filterByChallenger
 * @apiParam {ObjectId} filterByChallenged
 */
router
.route('/challenges')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    var query = Challenge.find().skip((request.query.page || 0) * 20).limit(20)
    .or([{'challenger.user' : request.session.id}, {'challenged.user' : request.session.id}]);
    if (request.query.filterByChallenger) query.where('challenger.user').equals(request.query.filterByChallenger);
    if (request.query.filterByChallenged) query.where('challenged.user').equals(request.query.filterByChallenged);
    query.exec(next);
  }, function (challenges) {
    response.status(200).send(challenges);
  }], next);
});

/**
 * @api {get} /challenges/:id Get challenge.
 * @apiName get
 * @apiGroup Challenge
 * @apiUse defaultHeaders
 */
router
.route('/challenges/:id')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.challenge.challenger.user.id && request.session.id !== request.challenge.challenged.user.id) throw new Error('invalid method');
  response.status(200).send(request.challenge);
});

/**
 * @api {put} /challenges/:id/reject Reject challenge.
 * @apiName reject
 * @apiGroup Challenge
 * @apiUse defaultHeaders
 */
router
.route('/challenges/:id/reject')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.challenge.challenged.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var challenge = request.challenge;
    async.series([challenge.validate.bind(challenge), function (next) {
      challenge.update({'$set' : {'accepted' : false}}, next);
    }, function (next) {
      challenge.challenger.user.update({'$inc' : {'funds' : challenge.bid, 'stake' : -challenge.bid}}, next);
    }], next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {put} /challenges/:id/accept Accept challenge.
 * @apiName accept
 * @apiGroup Challenge
 * @apiUse defaultHeaders
 */
router
.route('/challenges/:id/accept')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.challenge.challenged.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var challenge = request.challenge;
    async.series([challenge.validate.bind(challenge), function (next) {
      challenge.update({'$set' : {'accepted' : true}}, next);
    }, function (next) {
      challenge.challenged.user.update({'$inc' : {'funds' : -challenge.bid, 'stake' : challenge.bid}}, next);
    }], next);
  }, function () {
    response.status(200).end();
  }], next);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Challenge.findOne().where('_id').equals(id).exec(next);
  }, function (challenge, next) {
    request.challenge = challenge;
    next(!challenge ? new Error('not found') : null);
  }], next);
});

module.exports = router;
