var router, nconf, slug, async, auth, push, User, CreditRequest;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
User = require('../models/user');
CreditRequest = require('../models/credit-request');

/**
 * @api {post} /users/:user/credit-requests Creates a new creditRequest.
 * @apiName createCreditRequest
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 409 Conflict
 *
 * @apiSuccessExample
 * HTTP/1.1 201 Created
 * {
 *  "slug": "vandoren",
 *  "value": 10,
 *  "payed": false,
 *  "creditedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "chargedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:userOrFacebookId/credit-requests')
.post(auth.session())
.post(function createCreditRequest(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.or([
      {'slug' : request.params.userOrFacebookId},
      {'facebookId' : request.params.userOrFacebookId}
    ]);
    query.exec(next);
  }, function (user, next) {
    if (!user) {
      user = new User({'facebookId' : request.params.userOrFacebookId, 'password' : 'temp', 'active' : false});
      user.save(next);
    } else {
      next(null, user, null);
    }
  }, function (user, _, next) {
    var creditRequest, now;
    now = new Date();
    creditRequest = new CreditRequest({
      'slug'         : request.params.userOrFacebookId + '-' + request.session.slug + '-' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
      'creditedUser' : request.session._id,
      'chargedUser'  : user._id
    });
    creditRequest.save(next);
  }, function (creditRequest, _, next) {
    async.waterfall([function (next) {
      async.parallel([function (next) {
        creditRequest.populate('creditedUser');
        creditRequest.populate('chargedUser');
        creditRequest.populate(next);
      }, function (next) {
        push(nconf.get('ZEROPUSH_TOKEN'), {
          'device' : creditRequest.chargedUser.apnsToken,
          'sound'  : 'get_money.mp3',
          'alert'  : {
            'loc-key'  : 'NOTIFICATION_SOMEONE_NEED_CASH',
            'loc-args' : [request.session.username || request.session.name]
          }
        }, next);
      }], next);
    }, function (_, next) {
      response.status(201);
      response.send(creditRequest);
      next();
    }], next);
  }], next);
});

/**
 * @api {get} /users/:user/credit-requests List all creditRequests.
 * @apiName listCreditRequest
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Boolean} [unreadMessages] Only displays unread messages.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "vandoren",
 *  "value": 10,
 *  "payed": false,
 *  "creditedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "chargedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/users/:user/credit-requests')
.get(auth.session())
.get(function listCreditRequest(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var unreadMessages, pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    unreadMessages = request.param('unreadMessages');
    query = CreditRequest.find();
    query.where('chargedUser').equals(request.user._id);
    query.populate('creditedUser');
    query.populate('chargedUser');
    if (unreadMessages) {
      query.where('seenBy').ne(request.session._id);
    }
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
 * @api {get} /users/:user/requested-credits List all creditRequests.
 * @apiName listRequestedCredits
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Boolean} [unreadMessages] Only displays unread messages.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "vandoren",
 *  "value": 10,
 *  "payed": false,
 *  "creditedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "chargedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/users/:user/requested-credits')
.get(auth.session())
.get(function listRequestedCredits(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var unreadMessages, pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    unreadMessages = request.param('unreadMessages');
    query = CreditRequest.find();
    query.where('creditedUser').equals(request.user._id);
    query.populate('creditedUser');
    query.populate('chargedUser');
    if (unreadMessages) {
      query.where('seenBy').ne(request.session._id);
    }
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
 * @api {get} /users/:user/credit-requests/:creditRequest Get creditRequest.
 * @apiName getCreditRequest
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "vandoren",
 *  "value": 10,
 *  "payed": false,
 *  "creditedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "chargedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/credit-requests/:creditRequest')
.get(auth.session())
.get(function getCreditRequest(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    response.status(200);
    response.send(creditRequest);
    next();
  }], next);
});

/**
 * @api {put} /users/:user/credit-requests/:creditRequest/approve Approves creditRequest.
 * @apiName approveCreditRequest
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 400 Bad Request
 * {
 *   "value": "insufficient funds"
 * }
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "vandoren",
 *  "value": 10,
 *  "payed": false,
 *  "creditedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "chargedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/credit-requests/:creditRequest/approve')
.put(auth.session())
.put(auth.checkMethod('user'))
.put(function approveCreditRequest(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    creditRequest.value = creditRequest.creditedUser.funds < 100 ? 100 - creditRequest.creditedUser.funds : 0;
    creditRequest.payed = true;
    creditRequest.save(next);
  }, function (creditRequest, _, next) {
    async.waterfall([function (next) {
      async.parallel([function (next) {
        push(nconf.get('ZEROPUSH_TOKEN'), {
          'device' : creditRequest.creditedUser.apnsToken,
          'sound'  : 'get_money.mp3',
          'alert'  : {
            'loc-key'  : 'NOTIFICATION_RECEIVED_CASH',
            'loc-args' : [request.session.username || request.session.name]
          }
        }, next);
      }, function (next) {
        async.waterfall([function (next) {
          var query;
          query = CreditRequest.find();
          query.where('creditedUser').equals(creditRequest.creditedUser._id);
          query.where('payed').equals(false);
          query.exec(next);
        }, function (creditRequests, next) {
          async.each(creditRequests, function (creditRequest, next) {
            creditRequest.remove(next);
          }, next);
        }], next);
      }, function (next) {
        creditRequest.populate('creditedUser');
        creditRequest.populate('chargedUser');
        creditRequest.populate(next);
      }], next);
    }, function (_, next) {
      response.status(200);
      response.send(creditRequest);
      next();
    }], next);
  }], next);
});

/**
 * @api {put} /users/:user/credit-requests/:creditRequest/mark-as-read Mark as read creditRequest.
 * @apiName markAsReadCreditRequest
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "vandoren",
 *  "value": 10,
 *  "payed": false,
 *  "creditedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "chargedUser": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/credit-requests/:creditRequest/mark-as-read')
.put(auth.session())
.put(function markAsReadCreditRequest(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    creditRequest.seenBy.push(request.session._id);
    creditRequest.save(next);
  }, function (creditRequest, _, next) {
    response.status(200);
    response.send(creditRequest);
    next();
  }], next);
});

/**
 * @api {delete} /users/:user/credit-requests/:creditRequest Removes creditRequest.
 * @apiName removeCreditRequest
 * @apiVersion 2.2.0
 * @apiGroup creditRequest
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 204 Empty
 */
router
.route('/users/:user/credit-requests/:creditRequest')
.delete(auth.session())
.delete(auth.checkMethod('user'))
.delete(function removeCreditRequest(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var creditRequest;
    creditRequest = request.creditRequest;
    creditRequest.remove(next);
  }, function (_, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

router.param('creditRequest', function findCreditRequest(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = CreditRequest.findOne();
    query.where('chargedUser').equals(request.user._id);
    query.where('slug').equals(id);
    query.populate('creditedUser');
    query.populate('chargedUser');
    query.exec(next);
  }, function (creditRequest, next) {
    request.creditRequest = creditRequest;
    next(!creditRequest ? new Error('not found') : null);
  }], next);
});

router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
  'use strict';

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