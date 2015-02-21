'use strict';

var router, nconf, slug, async, auth, push, Group, GroupMember;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
Group = require('../models/group');
GroupMember = require('../models/group-member');

/**
 * @api {post} /groups Creates a new group.
 * @apiName createGroup
 * @apiVersion 2.2.0
 * @apiGroup group
 * @apiPermission user
 *
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture for display.
 * @apiParam {Boolean} [freeToEdit=false] Tells if the group can be edited by any member.
 *
 * @apiErrorExample
 * HTTP/1.1 400 Bad Request
 * {
 *   "name": "required"
 * }
 *
 * @apiSuccessExample
 * HTTP/1.1 201 Created
 * {
 *  "name": "College Buddies",
 *  "slug": "abcde",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "freeToEdit": false,
 *  "featured": false,
 *  "owner": {
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
.route('/groups')
.post(auth.session())
.post(function createGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = new Group({
      'name'       : request.param('name'),
      'slug'       : new Date().getTime().toString(36).substring(3),
      'picture'    : request.param('picture'),
      'freeToEdit' : request.param('freeToEdit', false),
      'owner'      : request.session._id
    });
    group.save(next);
  }, function (group, _, next) {
    async.waterfall([function (next) {
      async.parallel([function (next) {
        group.populate('owner');
        group.populate(next);
      }, function (next) {
        var groupMember;
        groupMember = new GroupMember({
          'slug'         : request.session.slug,
          'user'         : request.session._id,
          'group'        : group._id,
          'initialFunds' : request.session.funds
        });
        groupMember.save(next);
      }], next);
    }, function (_, next) {
      response.status(201);
      response.send(group);
      next();
    }], next);
  }], next);
});

/**
 * @api {get} /groups List all groups.
 * @apiName listGroup
 * @apiVersion 2.2.0
 * @apiGroup group
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Boolean} [featured=false] Tells if should return the user groups or the featured groups.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "name": "College Buddies",
 *  "slug": "abcde",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "freeToEdit": false,
 *  "featured": false,
 *  "owner": {
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
.route('/groups')
.get(auth.session())
.get(function listGroup(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query, featured;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    featured = request.param('featured', false);
    if (featured) {
      query = Group.find();
      query.where('featured').equals(true);
      query.populate('owner');
      query.skip(page);
      query.limit(pageSize);
      query.exec(next);
    } else {
      async.waterfall([function (next) {
        query = GroupMember.find();
        query.where('user').equals(request.session._id);
        query.populate('group');
        query.skip(page);
        query.limit(pageSize);
        query.exec(next);
      }, function (members, next) {
        async.map(members.filter(function (member) {
          return !!member.group;
        }), function (member, next) {
          var group;
          group = member.group;
          group.populate('owner');
          group.populate(next);
        }, next);
      }], next);
    }
  }, function (groups, next) {
    response.status(200);
    response.send(groups);
    next();
  }], next);
});

/**
 * @api {get} /groups/:group Get group.
 * @apiName getGroup
 * @apiVersion 2.2.0
 * @apiGroup group
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "name": "College Buddies",
 *  "slug": "abcde",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "freeToEdit": false,
 *  "featured": false,
 *  "owner": {
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
.route('/groups/:group')
.get(auth.session())
.get(function getGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    response.status(200);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {put} /groups/:group Updates group.
 * @apiName updateGroup
 * @apiVersion 2.2.0
 * @apiGroup group
 * @apiPermission user
 *
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture for display.
 * @apiParam {Boolean} [freeToEdit=false] Tells if the group can be edited be any member.
 *
 * @apiErrorExample
 * HTTP/1.1 400 Bad Request
 * {
 *   "name": "required"
 * }
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 201 Created
 * {
 *  "name": "College Buddies",
 *  "slug": "abcde",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "freeToEdit": false,
 *  "featured": false,
 *  "owner": {
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
.route('/groups/:group')
.put(auth.session())
.put(auth.checkMethod('group', 'owner', 'freeToEdit'))
.put(function updateGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    group.name = request.param('name');
    group.picture = request.param('picture');
    group.freeToEdit = request.session._id.toString() === group.owner._id.toString() ? request.param('freeToEdit', false) : group.freeToEdit;
    group.save(next);
  }, function (group, _, next) {
    response.status(200);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {delete} /groups/:group Removes group.
 * @apiName removeGroup
 * @apiVersion 2.2.0
 * @apiGroup group
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 204 Empty
 */
router
.route('/groups/:group')
.delete(auth.session())
.delete(auth.checkMethod('group', 'owner', 'freeToEdit'))
.delete(function removeGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    group.remove(next);
  }, function (_, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

/**
 * @api {post} /groups/:group/restart Restarts all group members initial funds.
 * @apiName restartGroup
 * @apiVersion 2.2.0
 * @apiGroup group
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "name": "College Buddies",
 *  "slug": "abcde",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "freeToEdit": false,
 *  "featured": false,
 *  "owner": {
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
.route('/groups/:group/restart')
.post(auth.session())
.post(auth.checkMethod('group', 'owner', 'freeToEdit'))
.post(function restartGroup(request, response, next) {
  async.waterfall([function (next) {
    var group, query;
    group = request.group;
    query = GroupMember.find();
    query.where('group').equals(group._id);
    query.populate('user');
    query.exec(next);
  }, function (members, next) {
    async.waterfall([function (next) {
      async.each(members, function (member, next) {
        member.initialFunds = member.user.funds;
        member.save(next);
      }, next);
    }, function (next) {
      response.status(200);
      response.send(request.group);
      next();
    }], next);
  }], next);
});

router.param('group', function findGroup(request, response, next, id) {
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

module.exports = router;