var VError, router, nconf, slug, async, auth, push, GroupMember, Group;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
Message = require('../models/message');
Group = require('../models/group');

/**
 * @api {post} /groups/:group/messages Creates a new message.
 * @apiName createMessage
 * @apiVersion 2.0.1
 * @apiGroup message
 * @apiPermission user
 * @apiDescription
 * Creates a new message.
 *
 * @apiParam {String} message Message text
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "user": {
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
 *       "message": "fala galera!",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:group/messages')
.post(auth.session())
.post(function createMessage(request, response, next) {
  'use strict';

  var message;
  message = new Message({
    'group'   : request.group ? request.group._id : null,
    'user'    : request.session._id,
    'message' : request.param('message')
  });
  return async.series([message.save.bind(message), function (next) {
    message.populate('user');
    message.populate(next);
  }], function createdMessage(error) {
    if (error) {
      error = new VError(error, 'error creating message: "$s"', message._id);
      return next(error);
    }
    return response.status(201).send(message);
  });
});

/**
 * @api {get} /groups/:group/members List all messages
 * @apiName listMessage
 * @apiVersion 2.0.1
 * @apiGroup message
 * @apiPermission user
 * @apiDescription
 * List all messages.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "user": {
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
 *       "message": "fala galera!",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/groups/:group/messages')
.get(auth.session())
.get(function listMessage(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Message.find();
  query.where('group').equals(request.group._id);
  query.sort('-createdAt');
  query.populate('user');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedMessage(error, messages) {
    if (error) {
      error = new VError(error, 'error finding message');
      return next(error);
    }
    return response.status(200).send(messages);
  });
});

router.param('group', function findGroup(request, response, next, id) {
  'use strict';

  var query;
  query = Group.findOne();
  query.where('slug').equals(id);
  return query.exec(function foundGroup(error, group) {
    if (error) {
      error = new VError(error, 'error finding group: "$s"', id);
      return next(error);
    }
    if (!group) {
      return response.status(404).end();
    }
    request.group = group;
    return next();
  });
});

module.exports = router;