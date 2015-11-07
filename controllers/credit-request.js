'use strict';

var router = require('express').Router();
var async = require('async');
var CreditRequest = require('../models/credit-request');

/**
 * @api {post} /credit-requests Creates a new credit request.
 * @apiName create
 * @apiGroup CreditRequest
 */
router
.route('/credit-requests')
.post(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    if ((/^[0-9a-fA-F]{24}$/).test(request.body.user)) {
      require('../models/user').findOne().where('_id').equals(request.body.user).exec(next);
    } else {
      require('../models/user').findOne().where('facebookId').equals(request.body.user).exec(next);
    }
  }, function (user, next) {
    var User = require('../models/user');
    if (!user) user = new User({'facebookId' : request.body.user, 'password' : 'tmp', 'active' : false});
    var creditRequest = new CreditRequest();
    creditRequest.creditedUser = request.session._id;
    creditRequest.chargedUser = user._id;
    async.parallel([user.save.bind(user), creditRequest.save.bind(creditRequest)], next);
  }, function (result) {
    response.status(201).send(result[1].id);
  }], next);
});

/**
 * @api {get} /credit-requests List all credit request.
 * @apiName list
 * @apiGroup CreditRequest
 */
router
.route('/credit-requests')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    CreditRequest.find()
    .or([{'creditedUser' : request.session.id}, {'chargedUser' : request.session.id}])
    .skip((request.query.page || 0) * 20).limit(20).exec(next);
  }, function (creditRequests) {
    response.status(200).send(creditRequests);
  }], next);
});

/**
 * @api {get} /credit-requests/:creditRequest Get credit request.
 * @apiName get
 * @apiGroup CreditRequest
 */
router
.route('/credit-requests/:id')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.creditRequest.creditedUser.id && request.session.id !== request.creditRequest.chargedUser.id) throw new Error('invalid method');
  response.status(200).send(request.creditRequest);
});

/**
 * @api {put} /credit-requests/:creditRequest/approve Approve credit request.
 * @apiName approve
 * @apiGroup CreditRequest
 */
router
.route('/credit-requests/:id/approve')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.creditRequest.chargedUser.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var creditRequest = request.creditRequest;
    var availableCredits = creditRequest.creditedUser.funds + creditRequest.creditedUser.stake;
    creditRequest.status = 'payed';
    creditRequest.value = (availableCredits < 100) ? (100 - availableCredits) : 0;
    async.parallel([creditRequest.save.bind(creditRequest), function (next) {
      creditRequest.creditedUser.update({'$inc' : {'funds' : creditRequest.value}}, next)
    }, function (next) {
      creditRequest.chargedUser.update({'$inc' : {'funds' : -creditRequest.value}}, next)
    }], next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {put} /credit-requests/:creditRequest/reject Reject credit request.
 * @apiName reject
 * @apiGroup CreditRequest
 */
router
.route('/credit-requests/:id/reject')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.creditRequest.chargedUser.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var creditRequest = request.creditRequest;
    creditRequest.status = 'rejected';
    creditRequest.save(next);
  }, function () {
    response.status(200).end();
  }], next);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    CreditRequest.findOne().where('_id').equals(id).exec(next);
  }, function (creditRequest, next) {
    request.creditRequest = creditRequest;
    next(!creditRequest ? new Error('not found') : null);
  }], next);
});

module.exports = router;
