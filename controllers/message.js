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
GroupMember = require('../models/group-member');

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

  async.waterfall([function (next) {
    var message;
    message = new Message({
      'slug'    : request.session.slug + '-' + Date.now(),
      'group'   : request.group ? request.group._id : null,
      'user'    : request.session._id,
      'message' : request.param('message')
    });
    message.save(next);
  }, function (message, _, next) {
    async.waterfall([function (next) {
      async.parallel([function (next) {
        message.populate('user');
        message.populate(next);
      }, function (next) {
        async.waterfall([function (next) {
          var query;
          query = GroupMember.find();
          query.where('group').equals(request.group._id);
          query.populate('user');
          query.exec(next);
        }, function (members, next) {
          async.each(members, function (member, next) {
            push(nconf.get('ZEROPUSH_TOKEN'), {
              'device' : member.user.apnsToken,
              'alert'  : {
                'loc-key'  : 'NOTIFICATION_GROUP_MESSAGE',
                'loc-args' : [request.session.username]
              }
            }, next);
          }, next);
        }], next);
      }], next);
    }, function (_, next) {
      response.status(201);
      response.send(message);
      next();
    }], next);
  }], next);
});

/**
 * @api {get} /groups/:group/messages List all messages
 * @apiName listMessage
 * @apiVersion 2.0.1
 * @apiGroup message
 * @apiPermission user
 * @apiDescription
 * List all messages.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Boolean} [unreadMessages] Only displays unread messages.
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

  async.waterfall([function (next) {
    var unreadMessages, pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    unreadMessages = request.param('unreadMessages');
    query = Message.find();
    query.where('group').equals(request.group._id);
    query.sort('-createdAt');
    query.populate('user');
    if (unreadMessages) {
      query.where('seenBy').ne(request.session._id);
    }
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (messages, next) {
    response.status(200);
    response.send(messages);
    next();
  }], next);
});

/**
 * @api {get} /groups/:group/messages/:id Get message info in database
 * @apiName getMessage
 * @apiVersion 2.0.1
 * @apiGroup message
 * @apiPermission user
 * @apiDescription
 * Get message info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
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
.route('/groups/:group/messages/:message')
.get(auth.session())
.get(function getMessage(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var message;
    message = request.message;
    response.status(200);
    response.send(message);
    next();
  }], next);
});

/**
 * @api {get} /groups/:group/messages/all/mark-as-read Mark as read all group messages in database
 * @apiName markAllAsReadMessage
 * @apiVersion 2.0.1
 * @apiGroup message
 * @apiPermission user
 * @apiDescription
 * Mark as read all group messages in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "College Buddies",
 *       "slug": "abcde",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "freeToEdit": false,
 *       "featured": false,
 *       "owner": {
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
.route('/groups/:group/messages/all/mark-as-read')
.put(auth.session())
.put(function markAllAsReadMessage(request, response, next) {
  'use strict';

  var group;
  group = request.group;
  async.waterfall([function (next) {
    var query;
    query = Message.find();
    query.where('group').equals(group._id);
    query.exec(next)
  }, function (messages, next) {
    async.each(messages, function (message, next) {
      message.seenBy.push(request.session._id);
      message.save(next);
    }, next);
  }, function (next) {
    response.status(200);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {get} /groups/:group/messages/:id/mark-as-read Mark as read message info in database
 * @apiName markAsReadMessage
 * @apiVersion 2.0.1
 * @apiGroup message
 * @apiPermission user
 * @apiDescription
 * Mark as read message info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
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
.route('/groups/:group/messages/:message/mark-as-read')
.put(auth.session())
.put(function markedAsReadMessage(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var message;
    message = request.message;
    message.seenBy.push(request.session._id);
    message.save(next);
  }, function (message, _, next) {
    response.status(200);
    response.send(message);
    next();
  }], next);
});

router.param('group', function findGroup(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = Group.findOne();
    query.where('slug').equals(id);
    query.exec(next);
  }, function (group, next) {
    request.group = group;
    next(!group ? new Error('not found') : null);
  }], next);
});

router.param('message', function findMessage(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = Message.findOne();
    query.where('group').equals(request.group._id);
    query.where('slug').equals(id);
    query.populate('user');
    query.exec(next);
  }, function (message, next) {
    request.message = message;
    next(!message ? new Error('not found') : null);
  }], next);
});

module.exports = router;