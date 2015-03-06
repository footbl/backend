'use strict';

var router, nconf, async, auth, push, crypto,
    User, CreditRequest;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

User = require('../models/user');
CreditRequest = require('../models/credit-request');

/**
 * @api {POST} /users/:userOrFacebookId/credit-requests createCreditRequest
 * @apiName createCreditRequest
 * @apiGroup CreditRequest
 *
 * @apiExample HTTP/1.1 201
 * {
 *   "_id": "54f8de21b54cf548db39e00d",
 *   "creditedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "chargedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "payed": false,
 *   "createdAt": "2015-03-05T22:52:17.368Z",
 *   "updatedAt": "2015-03-05T22:52:17.368Z"
 * }
 */
router
.route('/users/:userOrFacebookId/credit-requests')
.post(auth.session())
.post(function createCreditRequest(request, response, next) {
  async.waterfall([function (next) {
    var query, id;
    query = User.findOne();
    id = request.params.userOrFacebookId;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      query.where('facebookId').equals(id);
    } else {
      query.where('_id').equals(id);
    }
    query.exec(next);
  }, function (user, next) {
    if (user) return next(null, user, null);
    user = new User({'facebookId' : request.params.userOrFacebookId, 'password' : 'temp', 'active' : false});
    return user.save(next);
  }, function (user, _, next) {
    var creditRequest;
    creditRequest = new CreditRequest();
    creditRequest.creditedUser = request.session._id;
    creditRequest.chargedUser = user._id;
    creditRequest.save(next);
  }, function (creditRequest, _, next) {
    creditRequest.populate('creditedUser');
    creditRequest.populate('chargedUser');
    creditRequest.populate(next);
  }, function (creditRequest, next) {
    response.status(201);
    response.send(creditRequest);
    push(nconf.get('ZEROPUSH_TOKEN'), {
      'device' : creditRequest.chargedUser.apnsToken,
      'sound'  : 'get_money.mp3',
      'alert'  : {
        'loc-key'  : 'NOTIFICATION_SOMEONE_NEED_CASH',
        'loc-args' : [request.session.username || request.session.name]
      }
    }, next);
  }], next);
});

/**
 * @api {GET} /users/:user/credit-requests listCreditRequest
 * @apiName listCreditRequest
 * @apiGroup CreditRequest
 *
 * @apiExample HTTP/1.1 200
 * [{
 *   "_id": "54f8de21b54cf548db39e00d",
 *   "creditedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "chargedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "payed": false,
 *   "createdAt": "2015-03-05T22:52:17.368Z",
 *   "updatedAt": "2015-03-05T22:52:17.368Z"
 * }]
 */
router
.route('/users/:user/credit-requests')
.get(auth.session())
.get(function listCreditRequest(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = CreditRequest.find();
    query.where('chargedUser').equals(request.user._id);
    query.populate('creditedUser');
    query.populate('chargedUser');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (creditRequests, next) {
    response.status(200);
    response.send(creditRequests);
    next();
  }], next);
});

/**
 * @api {GET} /users/:user/requested-credits listRequestedCredits
 * @apiName listRequestedCredits
 * @apiGroup CreditRequest
 *
 * @apiExample HTTP/1.1 200
 * [{
 *   "_id": "54f8de21b54cf548db39e00d",
 *   "creditedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "chargedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "payed": false,
 *   "createdAt": "2015-03-05T22:52:17.368Z",
 *   "updatedAt": "2015-03-05T22:52:17.368Z"
 * }]
 */
router
.route('/users/:user/requested-credits')
.get(auth.session())
.get(function listRequestedCredits(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = CreditRequest.find();
    query.where('creditedUser').equals(request.user._id);
    query.populate('creditedUser');
    query.populate('chargedUser');
    if (request.body.unreadMessages) query.where('seenBy').ne(request.session._id);
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (creditRequests, next) {
    response.status(200);
    response.send(creditRequests);
    next();
  }], next);
});

/**
 * @api {GET} /users/:user/credit-requests/:creditRequest getCreditRequest
 * @apiName getCreditRequest
 * @apiGroup CreditRequest
 *
 * @apiExample HTTP/1.1 200
 * {
 *   "_id": "54f8de21b54cf548db39e00d",
 *   "creditedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "chargedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "payed": false,
 *   "createdAt": "2015-03-05T22:52:17.368Z",
 *   "updatedAt": "2015-03-05T22:52:17.368Z"
 * }
 */
router
.route('/users/:user/credit-requests/:creditRequest')
.get(auth.session())
.get(function getCreditRequest(request, response, next) {
  async.waterfall([function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    response.status(200);
    response.send(creditRequest);
    next();
  }], next);
});

/**
 * @api {PUT} /users/:user/credit-requests/:creditRequest/approve approveCreditRequest
 * @apiName approveCreditRequest
 * @apiGroup CreditRequest
 *
 * @apiExample HTTP/1.1 201
 * {
 *   "_id": "54f8de21b54cf548db39e00d",
 *   "creditedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "chargedUser": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "payed": false,
 *   "createdAt": "2015-03-05T22:52:17.368Z",
 *   "updatedAt": "2015-03-05T22:52:17.368Z"
 * }
 */
router
.route('/users/:user/credit-requests/:creditRequest/approve')
.put(auth.session())
.put(auth.checkMethod('creditRequest', 'chargedUser'))
.put(function approveCreditRequest(request, response, next) {
  async.waterfall([function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    creditRequest.approve(next);
  }, function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    response.status(200);
    response.send(creditRequest);
    next(null, creditRequest);
  }, function (creditRequest, next) {
    push(nconf.get('ZEROPUSH_TOKEN'), {
      'device' : creditRequest.creditedUser.apnsToken,
      'sound'  : 'get_money.mp3',
      'alert'  : {
        'loc-key'  : 'NOTIFICATION_RECEIVED_CASH',
        'loc-args' : [request.session.username || request.session.name]
      }
    }, next);
  }], next);
});

router.param('creditRequest', function findCreditRequest(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = CreditRequest.findOne();
    query.where('chargedUser').equals(request.user._id);
    query.where('_id').equals(id);
    query.populate('creditedUser');
    query.populate('chargedUser');
    query.exec(next);
  }, function (creditRequest, next) {
    request.creditRequest = creditRequest;
    next(!creditRequest ? new Error('not found') : null);
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