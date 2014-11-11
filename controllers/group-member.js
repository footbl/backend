var VError, router, nconf, slug, async, auth, GroupMember, Group, User;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
GroupMember = require('../models/group-member');
Group = require('../models/group');
User = require('../models/user');

router.use(function findGroupUser(request, response, next) {
  'use strict';

  var query, user;
  user = request.param('user');
  if (!user) {
    return next();
  }
  query = User.findOne();
  query.where('slug').equals(user);
  return query.exec(function (error, user) {
    if (error) {
      error = new VError(error, 'error finding user: "$s"', user);
      return next(error);
    }
    request.groupUser = user;
    return next();
  });
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
.post(function (request, response, next) {
  'use strict';

  var group;
  group = request.group;
  if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
    return response.status(405).end()
  }
  return next();
})
.post(function createGroupMember(request, response, next) {
  'use strict';

  var groupMember;
  groupMember = new GroupMember({
    'slug'         : request.groupUser ? request.groupUser.slug : null,
    'group'        : request.group ? request.group._id : null,
    'user'         : request.groupUser ? request.groupUser._id : null,
    'initialFunds' : request.groupUser ? request.groupUser.funds : null
  });
  return async.series([groupMember.save.bind(groupMember), function (next) {
    groupMember.populate('user');
    groupMember.populate(next);
  }], function createdGroupMember(error) {
    if (error) {
      error = new VError(error, 'error creating group member: "$s"', groupMember._id);
      return next(error);
    }
    return response.status(201).send(groupMember);
  });
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

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = GroupMember.find();
  query.where('group').equals(request.group._id);
  query.sort('ranking');
  query.populate('user');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedGroupMember(error, groupMembers) {
    if (error) {
      error = new VError(error, 'error finding groupMembers');
      return next(error);
    }
    return response.status(200).send(groupMembers);
  });
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
.route('/groups/:group/members/:id')
.get(auth.session())
.get(function getGroupMember(request, response) {
  'use strict';

  var groupMember;
  groupMember = request.groupMember;
  return response.status(200).send(groupMember);
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
.route('/groups/:group/members/:id')
.delete(auth.session())
.delete(function validateRemoveGroupMember(request, response, next) {
  'use strict';

  var group;
  group = request.group;
  if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
    return response.status(405).end()
  }
  return next();
})
.delete(function removeGroupMember(request, response, next) {
  'use strict';

  var groupMember;
  groupMember = request.groupMember;
  return groupMember.remove(function removedGroupMember(error) {
    if (error) {
      error = new VError(error, 'error removing groupMember: "$s"', request.params.id);
      return next(error);
    }
    return response.status(204).end();
  });
});

router.param('id', function findGroupMember(request, response, next, id) {
  'use strict';

  var query;
  query = GroupMember.findOne();
  query.where('group').equals(request.group._id);
  query.where('slug').equals(id);
  query.populate('user');
  query.exec(function foundGroupMember(error, groupMember) {
    if (error) {
      error = new VError(error, 'error finding groupMember: "$s"', id);
      return next(error);
    }
    if (!groupMember) {
      return response.status(404).end();
    }
    request.groupMember = groupMember;
    return next();
  });
});

router.param('group', function findGroup(request, response, next, id) {
  'use strict';

  var query;
  query = Group.findOne();
  query.where('slug').equals(id);
  return query.exec(function foundChampionship(error, group) {
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