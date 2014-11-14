var VError, router, nconf, slug, async, auth, User, ZeroPush, CreditRequest;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
ZeroPush = require('nzero-push').ZeroPush;
User = require('../models/user');
CreditRequest = require('../models/credit-request');

/**
 * @api {post} /users/:user/credit-requests Creates a new creditRequest in database.
 * @apiName createCreditRequest
 * @apiVersion 2.0.1
 * @apiGroup creditRequest
 * @apiPermission none
 * @apiDescription
 * Creates a new creditRequest in database.
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "value": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "vandoren",
 *       "value": 10,
 *       "payed": false,
 *       "creditedUser": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "chargedUser": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:userOrFacebookId/credit-requests')
.post(auth.session())
.post(function createUserIfNotExistsToCreate(request, response, next) {
  'use strict';

  var query, id;
  query = User.findOne();
  id = request.params.userOrFacebookId;
  query.or([
    {'slug' : id},
    {'facebookId' : id}
  ]);
  return query.exec(function (error, user) {
    if (error) {
      error = new VError(error, 'error finding user: "$s"', id);
      return next(error);
    }
    if (!user) {
      request.user = new User({
        'facebookId' : id,
        'password'   : 'temp',
        'active'     : false
      });
      return request.user.save(next);
    }
    request.user = user;
    return next();
  });
})
.post(function createCreditRequest(request, response, next) {
  'use strict';

  var creditRequest, now;
  now = new Date();
  creditRequest = new CreditRequest({
    'slug'         : request.params.userOrFacebookId + '-' + request.session.slug + '-' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
    'creditedUser' : request.session._id,
    'chargedUser'  : request.user._id
  });
  return async.series([creditRequest.save.bind(creditRequest), function (next) {
    creditRequest.populate('creditedUser');
    creditRequest.populate('chargedUser');
    creditRequest.populate(next);
  }, function (next) {
    var push;
    push = new ZeroPush(nconf.get('ZEROPUSH_TOKEN'));
    push.notify('ios-mac', {
      'device_tokens' : [creditRequest.chargedUser.apnsToken]
    }, {
      'sound' : 'get_money.mp3',
      'alert' : JSON.stringify({
        'loc-key'  : 'NOTIFICATION_SOMEONE_NEED_CASH',
        'loc-args' : [creditRequest.creditedUser.username]
      })
    }, next);
  }], function createdCreditRequest(error) {
    if (error) {
      error = new VError(error, 'error creating creditRequest');
      return next(error);
    }
    return response.status(201).send(creditRequest);
  });
});

/**
 * @api {get} /users/:user/credit-requests List all creditRequests in database
 * @apiName listCreditRequest
 * @apiVersion 2.0.1
 * @apiGroup creditRequest
 * @apiPermission none
 * @apiDescription
 * List all creditRequests in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "value": 10,
 *       "payed": false,
 *       "creditedUser": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "chargedUser": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/credit-requests')
.get(auth.session())
.get(function listCreditRequest(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = CreditRequest.find();
  query.where('chargedUser').equals(request.user._id);
  query.populate('creditedUser');
  query.populate('chargedUser');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedCreditRequest(error, creditRequests) {
    if (error) {
      error = new VError(error, 'error finding creditRequests');
      return next(error);
    }
    return response.status(200).send(creditRequests);
  });
});

/**
 * @api {get} /users/:user/requested-credits List all creditRequests in database
 * @apiName listRequestedCredits
 * @apiVersion 2.0.1
 * @apiGroup creditRequest
 * @apiPermission none
 * @apiDescription
 * List all creditRequests in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "value": 10,
 *       "payed": false,
 *       "creditedUser": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "chargedUser": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/requested-credits')
.get(auth.session())
.get(function listRequestedCredits(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = CreditRequest.find();
  query.where('creditedUser').equals(request.user._id);
  query.populate('creditedUser');
  query.populate('chargedUser');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedRequestedCredits(error, creditRequests) {
    if (error) {
      error = new VError(error, 'error finding creditRequests');
      return next(error);
    }
    return response.status(200).send(creditRequests);
  });
});

/**
 * @api {get} /users/:user/credit-requests/:id Get creditRequest info in database
 * @apiName getCreditRequest
 * @apiVersion 2.0.1
 * @apiGroup creditRequest
 * @apiPermission none
 * @apiDescription
 * Get creditRequest info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "value": 10,
 *       "payed": false,
 *       "creditedUser": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "chargedUser": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/credit-requests/:id')
.get(auth.session())
.get(function getCreditRequest(request, response) {
  'use strict';

  var creditRequest;
  creditRequest = request.creditRequest;
  return response.status(200).send(creditRequest);
});

/**
 * @api {put} /users/:user/credit-requests/:id/approve Approves creditRequest info in database
 * @apiName approveCreditRequest
 * @apiVersion 2.0.1
 * @apiGroup creditRequest
 * @apiPermission none
 * @apiDescription
 * Updates creditRequest info in database.
 *
 * @apiParam {Number} value Credit request value.
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "value": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "value": 10,
 *       "payed": false,
 *       "creditedUser": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "chargedUser": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/credit-requests/:id/approve')
.put(auth.session())
.put(function validateUserToApprove(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (request.session._id.toString() !== user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.put(function approveCreditRequest(request, response, next) {
  'use strict';

  var creditRequest;
  creditRequest = request.creditRequest;
  creditRequest.value = creditRequest.creditedUser.funds < 100 ? 100 - creditRequest.creditedUser.funds : 0;
  creditRequest.payed = true;
  return async.series([creditRequest.save.bind(creditRequest), function (next) {
    var query;
    query = CreditRequest.find();
    query.where('creditedUser').equals(creditRequest.creditedUser._id);
    query.where('payed').equals(false);
    query.exec(function (error, creditRequests) {
      async.each(creditRequests, function (creditRequest, next) {
        creditRequest.remove(next);
      }, next);
    });
  }, function (next) {
    creditRequest.populate('creditedUser');
    creditRequest.populate('chargedUser');
    creditRequest.populate(next);
  }, function (next) {
    var push;
    push = new ZeroPush(nconf.get('ZEROPUSH_TOKEN'));
    push.notify('ios-mac', {
      'device_tokens' : [creditRequest.creditedUser.apnsToken]
    }, {
      'sound' : 'get_money.mp3',
      'alert' : JSON.stringify({
        'loc-key'  : 'NOTIFICATION_RECEIVED_CASH',
        'loc-args' : [creditRequest.chargedUser.username]
      })
    }, next);
  }], function updatedCreditRequest(error) {
    if (error) {
      error = new VError(error, 'error updating creditRequest');
      return next(error);
    }
    return response.status(200).send(creditRequest);
  });
});

/**
 * @api {delete} /users/:user/credit-requests/:id Removes creditRequest from database
 * @apiName removeCreditRequest
 * @apiVersion 2.0.1
 * @apiGroup creditRequest
 * @apiPermission none
 * @apiDescription
 * Removes creditRequest from database
 */
router
.route('/users/:user/credit-requests/:id')
.delete(auth.session())
.delete(function validateUserToDelete(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (request.session._id.toString() !== user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.delete(function removeCreditRequest(request, response, next) {
  'use strict';

  var creditRequest;
  creditRequest = request.creditRequest;
  return creditRequest.remove(function removedCreditRequest(error) {
    if (error) {
      error = new VError(error, 'error removing creditRequest: "$s"', request.params.id);
      return next(error);
    }
    return response.status(204).end();
  });
});

router.param('id', function findCreditRequest(request, response, next, id) {
  'use strict';

  var query;
  query = CreditRequest.findOne();
  query.where('chargedUser').equals(request.user._id);
  query.where('slug').equals(id);
  query.populate('creditedUser');
  query.populate('chargedUser');
  query.exec(function foundCreditRequest(error, creditRequest) {
    if (error) {
      error = new VError(error, 'error finding creditRequest: "$s"', id);
      return next(error);
    }
    if (!creditRequest) {
      return response.status(404).end();
    }
    request.creditRequest = creditRequest;
    return next();
  });
});

router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
  'use strict';

  var query;
  query = User.findOne();
  if (id === 'me') {
    request.user = request.session;
    return next();
  }
  query.where('slug').equals(id);
  return query.exec(function foundUser(error, user) {
    if (error) {
      error = new VError(error, 'error finding user: "$s"', id);
      return next(error);
    }
    if (!user) {
      return response.status(404).end();
    }
    request.user = user;
    return next();
  });
});

module.exports = router;