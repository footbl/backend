var router, nconf, slug, async, auth, push, GroupMember, Group, User;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
GroupMember = require('../models/group-member');
Group = require('../models/group');
User = require('../models/user');

router.use(function findGroupUser(request, response, next) {
  'use strict';

  var user;
  user = request.param('user');
  if (!user) {
    return next();
  }
  return async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('slug').equals(user);
    query.exec(next);
  }, function (user, next) {
    request.groupUser = user;
    return next();
  }], next);
});

/**
 * @api {post} /groups/:group/members Creates a new groupMember.
 * @apiName createGroupMember
 * @apiVersion 2.0.1
 * @apiGroup groupMember
 * @apiPermission user
 * @apiDescription
 * Creates a new groupMember.
 *
 * @apiParam {String} user GroupMember user
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "user": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "vandoren",
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
 *       "ranking": 1,
 *       "previousRanking": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:group/members')
.post(auth.session())
.post(auth.checkMethod('group', 'owner', 'freeToEdit'))
.post(function createGroupMember(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var groupMember;
    groupMember = new GroupMember({
      'slug'         : request.groupUser ? request.groupUser.slug : null,
      'group'        : request.group ? request.group._id : null,
      'user'         : request.groupUser ? request.groupUser._id : null,
      'initialFunds' : request.groupUser ? request.groupUser.funds : null
    });
    groupMember.save(next);
  }, function (member, _, next) {
    async.waterfall([function (next) {
      async.parallel([function (next) {
        member.populate('user');
        member.populate(next);
      }, function (next) {
        push(nconf.get('ZEROPUSH_TOKEN'), {
          'device' : request.groupUser.apnsToken,
          'alert'  : {
            'loc-key'  : 'NOTIFICATION_GROUP_ADDED',
            'loc-args' : [request.session.username || request.session.name]
          }
        }, next);
      }], next);
    }, function (_, next) {
      response.status(201);
      response.send(member);
      next();
    }], next);
  }], next);
});

/**
 * @api {get} /groups/:group/members List all groupMembers
 * @apiName listGroupMember
 * @apiVersion 2.0.1
 * @apiGroup groupMember
 * @apiPermission user
 * @apiDescription
 * List all groupMembers.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
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
 *       "ranking": 1,
 *       "previousRanking": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/groups/:group/members')
.get(auth.session())
.get(function listGroupMember(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = GroupMember.find();
    query.where('group').equals(request.group._id);
    query.sort('ranking');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (members, next) {
    response.status(200);
    response.send(members);
    next();
  }], next);
});

/**
 * @api {get} /groups/:group/members/:id Get groupMember info
 * @apiName getGroupMember
 * @apiVersion 2.0.1
 * @apiGroup groupMember
 * @apiPermission user
 * @apiDescription
 * Get groupMember info.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
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
 *       "ranking": 1,
 *       "previousRanking": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:group/members/:member')
.get(auth.session())
.get(function getGroupMember(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var groupMember;
    groupMember = request.groupMember;
    response.status(200);
    response.send(groupMember);
    next();
  }], next);
});

/**
 * @api {delete} /groups/:group/members/:id Removes groupMember
 * @apiName removeGroupMember
 * @apiVersion 2.0.1
 * @apiGroup groupMember
 * @apiPermission user
 * @apiDescription
 * Removes groupMember
 */
router
.route('/groups/:group/members/:member')
.delete(auth.session())
.delete(auth.checkMethod('group', 'owner', 'freeToEdit'))
.delete(function removeGroupMember(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var groupMember;
    groupMember = request.groupMember;
    groupMember.remove(next);
  }, function (_, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

router.param('group', function findGroup(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = Group.findOne();
    query.where('slug').equals(id);
    query.populate('owner');
    query.exec(next);
  }, function (group, next) {
    request.group = group;
    next(!group ? new Error('not found') : null);
  }], next);
});

router.param('member', function findGroupMember(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = GroupMember.findOne();
    query.where('group').equals(request.group._id);
    query.where('slug').equals(id);
    query.populate('user');
    query.exec(next);
  }, function (groupMember, next) {
    request.groupMember = groupMember;
    next(!groupMember ? new Error('not found') : null);
  }], next);
});

module.exports = router;