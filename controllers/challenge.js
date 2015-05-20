'use strict';

var router, nconf, async, auth, push, crypto,
Challenge, User;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Challenge = require('../models/challenge');
User = require('../models/user');

/**
 * @api {post} /users/:user/challenges Creates a new challenge.
 * @apiName createChallenge
 * @apiGroup challenge
 *
 * @apiParam {ObjectId} match Challenge match.
 * @apiParam {Number} bid Challenge bid.
 * @apiParam {String} result Challenge result.
 */
router
.route('/users/:user/challenges')
.post(auth.session())
.post(auth.checkMethod('user'))
.post(function createChallenge(request, response, next) {
  async.waterfall([function (next) {
    var challenge;
    challenge = new Challenge();
    challenge.bid = request.body.bid;
    challenge.result = request.body.result;
    challenge.match = request.body.match;
    challenge.user = request.session._id;
    challenge.save(next);
  }, function (challenge, _, next) {
    challenge.populate('challenger.user');
    challenge.populate('challenged.user');
    challenge.populate('match');
    challenge.populate(next);
  }, function (challenge, next) {
    var challenger;
    challenger = challenge.challenger.user;
    challenger.stake += challenge.bid;
    challenger.funds -= challenge.bid;
    response.status(201);
    response.send(challenge);
    challenger.save(next);
  }], next);
});

/**
 * @api {get} /users/:user/challenges List all challenges.
 * @apiName listChallenge
 * @apiGroup challenge
 *
 * @apiParam {String} [page=0] The page to be displayed.
 */
router
.route('/users/:user/challenges')
.get(auth.session())
.get(function listChallenge(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Challenge.find();
    query.where('user').equals(request.user._id);
    query.populate('challenger.user');
    query.populate('challenged.user');
    query.populate('match');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (challenges, next) {
    response.status(200);
    response.send(challenges);
    next();
  }], next);
});

/**
 * @api {get} /users/:user/challenges/:challenge Get challenge.
 * @apiName getChallenge
 * @apiGroup challenge
 */
router
.route('/users/:user/challenges/:challenge')
.get(auth.session())
.get(function getChallenge(request, response, next) {
  async.waterfall([function (next) {
    var challenge;
    challenge = request.challenge;
    response.status(200);
    response.send(challenge);
    next();
  }], next);
});

/**
 * @api {put} /users/:user/challenges/:challenge/reject Reject challenge.
 * @apiName rejectChallenge
 * @apiGroup challenge
 */
router
.route('/users/:user/challenges/:challenge/reject')
.put(auth.session())
.put(function rejectChallenge(request, response, next) {
  async.waterfall([function (next) {
    var challenge, challenger;
    challenge = request.challenge;
    challenger = challenge.challenger.user;
    challenger.stake -= challenge.bid;
    challenger.funds += challenge.bid;
    challenge.accepted = false;
    async.parallel([challenger.save.bind(challenger), challenge.save.bind(challenge)], next);
  }, function (_, next) {
    response.status(200);
    response.end();
    next();
  }], next);
});

/**
 * @api {put} /users/:user/challenges/:challenge/accept Accept challenge.
 * @apiName acceptChallenge
 * @apiGroup challenge
 */
router
.route('/users/:user/challenges/:challenge/accept')
.put(auth.session())
.put(function acceptChallenge(request, response, next) {
  async.waterfall([function (next) {
    var challenge, challenged;
    challenge = request.challenge;
    challenged = challenge.challenged.user;
    challenged.stake += challenge.bid;
    challenged.funds -= challenge.bid;
    challenge.accepted = false;
    async.parallel([challenged.save.bind(challenged), challenge.save.bind(challenge)], next);
  }, function (challenge, next) {
    response.status(200);
    response.end();
    next();
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

router.param('challenge', function findChallenge(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Challenge.findOne();
    query.populate('challenger.user');
    query.populate('challenged.user');
    query.populate('match');
    query.where('user').equals(request.user._id);
    query.where('_id').equals(id);
    query.exec(next);
  }, function (challenge, next) {
    request.challenge = challenge;
    next(!challenge ? new Error('not found') : null);
  }], next);
});

module.exports = router;
