var router, nconf, slug, async, mandrill, auth, Group, GroupMember;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
mandrill = new (require('mandrill-api')).Mandrill(nconf.get('MANDRILL_APIKEY'));
auth = require('auth');
Group = require('../models/group');
GroupMember = require('../models/group-member');

/**
 * @api {post} /groups Creates a new group.
 * @apiName createGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Creates a new group.
 *
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture for display.
 * @apiParam {Boolean} [freeToEdit=false] Tells if the group can be edited be any member.
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
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
.route('/groups')
.post(auth.session())
.post(function createGroup(request, response, next) {
  'use strict';

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
 * @api {get} /groups List all groups
 * @apiName listGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * List all groups.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Boolean} [featured=false] Tells if should return the user groups or the featured groups.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
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
 *     }]
 */
router
.route('/groups')
.get(auth.session())
.get(function listGroup(request, response, next) {
  'use strict';

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
        }, next)
      }], next);
    }
  }, function (groups, next) {
    response.status(200);
    response.send(groups);
    next()
  }], next);
});

/**
 * @api {get} /groups/:id Get group info
 * @apiName getGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Get group info.
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
.route('/groups/:group')
.get(auth.session())
.get(function getGroup(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var group;
    group = request.group;
    response.status(200);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {put} /groups/:id Updates group info
 * @apiName updateGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Updates group info.
 *
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture for display.
 * @apiParam {Boolean} [freeToEdit=false] Tells if the group can be edited be any member.
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required"
 *     }
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
.route('/groups/:group')
.put(auth.session())
.put(auth.checkMethod('group', 'owner', 'freeToEdit'))
.put(function updateGroup(request, response, next) {
  'use strict';

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
    next()
  }], next);
});

/**
 * @api {delete} /groups/:id Removes group
 * @apiName removeGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Removes group
 */
router
.route('/groups/:group')
.delete(auth.session())
.delete(auth.checkMethod('group', 'owner', 'freeToEdit'))
.delete(function removeGroup(request, response, next) {
  'use strict';

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
 * @api {post} /groups/:id/invite Invites new user
 * @apiName inviteGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Updates group info.
 *
 * @apiParam {String} invite Invite
 */
router
.route('/groups/:group/invite')
.post(auth.session())
.post(auth.checkMethod('group', 'owner', 'freeToEdit'))
.post(function inviteGroup(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var group;
    group = request.group;
    group.invites.push(request.param('invite', ''));
    group.save(next);
  }, function (group, _, next) {
    async.parallel([function (next) {
      mandrill.messages.send({
        'message' : {
          'html'       : [
            '<p>Join my group on footbl!</p>',
            '<p>Bet against friends on football matches around the world. footbl is the global football betting app. Virtual money, real dynamic odds.<br> <a href="http://footbl.co/dl">Download</a> the app and use this e-mail address to Sign up or simply use the group code ' + group.code + '.<p>',
            '<p>footbl | wanna bet?<p>',
            request.session.name || request.session.username || 'A friend on footbl'
          ].join('\n'),
          'subject'    : 'wanna bet?',
          'from_name'  : request.session.name || request.session.username || 'A friend on footbl',
          'from_email' : 'noreply@footbl.co',
          'to'         : [
            {
              'email' : request.param('invite', ''),
              'type'  : 'to'
            }
          ]
        },
        'async'   : true
      });
      next();
    }, function (next) {
      response.status(200);
      response.send(group);
      next();
    }], next);
  }], next);
});

/**
 * @api {post} /groups/:id/restart Restarts all group members initial funds
 * @apiName restartGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Restarts all group members initial funds.
 */
router
.route('/groups/:group/restart')
.post(auth.session())
.post(auth.checkMethod('group', 'owner', 'freeToEdit'))
.post(function restartGroup(request, response, next) {
  'use strict';

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

module.exports = router;