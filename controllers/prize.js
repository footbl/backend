var VError, router, nconf, slug, async, auth, User, Prize;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
User = require('../models/user');
Prize = require('../models/prize');

/**
 * @api {get} /users/:id/prizes Send user prizes
 * @apiName listPrizes
 * @apiVersion 2.0.1
 * @apiGroup prize
 * @apiPermission user
 * @apiDescription
 * This route send all user prizes, including daily bonus.
 *
 * @apiParam {Array} [page].
 * @apiParam {Boolean} [unreadMessages] Only displays unread messages.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "value": 1,
 *       "type": "daily",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/prizes')
.get(auth.session())
.get(function listPrizes(request, response, next) {
  'use strict';

  var unreadMessages, pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  unreadMessages = request.param('unreadMessages');
  query = Prize.find();
  query.where('user').equals(request.session._id);
  query.sort('-createdAt');
  if (unreadMessages) {
    query.where('seenBy').ne(request.session._id);
  }
  query.skip(page);
  query.limit(pageSize);
  query.exec(function listedPrizes(error, prizes) {
    if (error) {
      error = new VError(error, 'error finding user prizes');
      return next(error);
    }
    return response.status(200).send(prizes);
  });
});

/**
 * @api {get} /users/:user/prizes/:id Get prize info in database
 * @apiName getPrize
 * @apiVersion 2.0.1
 * @apiGroup prize
 * @apiPermission user
 * @apiDescription
 * Get prize info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "value": 1,
 *       "type": "daily",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/prizes/:id')
.get(auth.session())
.get(function getPrizes(request, response) {
  'use strict';

  var prize;
  prize = request.prize;
  return response.status(200).send(prize);
});

/**
 * @api {put} /users/:user/prizes/:id/mark-as-read Mark as read prize info in database
 * @apiName markAsReadPrize
 * @apiVersion 2.0.1
 * @apiGroup prize
 * @apiPermission user
 * @apiDescription
 * Mark as read prize info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "value": 1,
 *       "type": "daily",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/prizes/:id/mark-as-read')
.put(auth.session())
.put(function markAsReadPrize(request, response, next) {
  'use strict';

  var prize;
  prize = request.prize;
  prize.seenBy.push(request.session._id);
  return async.series([prize.save.bind(prize)], function markedAsReadPrize(error) {
    if (error) {
      error = new VError(error, 'error updating prize');
      return next(error);
    }
    return response.status(200).send(prize);
  });
});

router.param('id', function findPrize(request, response, next, id) {
  'use strict';

  var query;
  query = Prize.findOne();
  query.where('user').equals(request.user._id);
  query.where('slug').equals(id);
  query.exec(function foundPrize(error, prize) {
    if (error) {
      error = new VError(error, 'error finding prize: "$s"', id);
      return next(error);
    }
    if (!prize) {
      return response.status(404).end();
    }
    request.prize = prize;
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