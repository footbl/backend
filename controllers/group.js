/**
 * @apiDefineStructure groupParams
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture for display.
 * @apiParam {Boolean} [freeToEdit=false] Tells if the group can be edited be any member.
 */
/**
 * @apiDefineStructure groupSuccess
 * @apiSuccess {String} name Group name.
 * @apiSuccess {String} slug Group identifier.
 * @apiSuccess {String} picture Group picture for display.
 * @apiSuccess {Boolean} freeToEdit Tells if the group can be edited be any member.
 * @apiSuccess {Boolean} featured Tells if the group is featured.
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, async, mandrill, auth, Group, GroupMember;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
mandrill = new (require('mandrill-api')).Mandrill(nconf.get('MANDRILL_APIKEY'));
auth = require('../lib/auth');
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
 * @apiStructure groupParams
 * @apiStructure groupSuccess
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
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups')
.post(auth.session())
.post(function createGroup(request, response, next) {
    'use strict';

    var group, groupMember;
    group = new Group({
        'name'       : request.param('name'),
        'slug'       : new Date().getTime().toString(36).substring(3),
        'picture'    : request.param('picture'),
        'freeToEdit' : request.param('freeToEdit', false),
        'owner'      : request.session._id
    });
    groupMember = new GroupMember({
        'slug'         : request.session.slug,
        'user'         : request.session._id,
        'group'        : group._id,
        'initialFunds' : request.session.funds
    });
    return async.series([group.save.bind(group), groupMember.save.bind(groupMember)], function (error) {
        if (error) {
            error = new VError(error, 'error creating group: "$s"', group._id);
            return next(error);
        }
        return response.send(201, group);
    });
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
 * @apiStructure groupSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "name": "College Buddies",
 *       "slug": "abcde",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "freeToEdit": false,
 *       "featured": false,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/groups')
.get(auth.session())
.get(function listGroup(request, response, next) {
    'use strict';

    var pageSize, page, query, featured;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    featured = request.param('featured', false);
    query = GroupMember.find();
    if (featured) {
        query = Group.find();
        query.where('featured').equals(true);
        query.populate('owner');
        query.skip(page);
        query.limit(pageSize);
        return query.exec(function listedGroup(error, groups) {
            if (error) {
                error = new VError(error, 'error finding groups');
                return next(error);
            }
            return response.send(200, groups);
        });
    } else {
        query = GroupMember.find();
        query.where('user').equals(request.session._id);
        query.populate('group');
        query.skip(page);
        query.limit(pageSize);
        return query.exec(function listedGroup(error, groupMembers) {
            if (error) {
                error = new VError(error, 'error finding groups');
                return next(error);
            }
            return async.map(groupMembers, function populateGroupOwner(groupMember, next) {
                var group;
                group = groupMember.group;
                group.populate('owner');
                group.populate(next);
            }, function populatedGroupOwner(error, groups) {
                return response.send(200, groups);
            });
        });
    }
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
 * @apiStructure groupSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "College Buddies",
 *       "slug": "abcde",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "freeToEdit": false,
 *       "featured": false,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:id')
.get(auth.session())
.get(function getGroup(request, response) {
    'use strict';

    var group;
    group = request.group;
    return response.send(200, group);
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
 * @apiStructure groupParams
 * @apiStructure groupSuccess
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
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:id')
.put(auth.session())
.put(function validateUpdateGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {
        return response.send(405);
    }
    return next();
})
.put(function updateGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    group.name = request.param('name');
    group.picture = request.param('picture');
    group.freeToEdit = request.session._id.toString() === group.owner._id.toString() ? request.param('freeToEdit', false) : group.freeToEdit;
    return group.save(function updatedGroup(error) {
        if (error) {
            error = new VError(error, 'error updating group: "$s"', group._id);
            return next(error);
        }
        return response.send(200, group);
    });
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
.route('/groups/:id')
.delete(auth.session())
.delete(function validateRemoveGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {
        return response.send(405);
    }
    return next();
})
.delete(function removeGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    return group.remove(function removedGroup(error) {
        if (error) {
            error = new VError(error, 'error removing group: "$s"', request.params.id);
            return next(error);
        }
        return response.send(204);
    });
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
.route('/groups/:id/invite')
.post(auth.session())
.post(function validateInviteGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {
        return response.send(405);
    }
    return next();
})
.post(function inviteGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    group.invites.push(request.param('invite', ''));
    async.series([group.save.bind(group), function (next) {
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
    }], function (error) {
        if (error) {
            error = new VError(error, 'error inviting user');
            return next(error);
        }
        return response.send(200, group);
    });
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
.route('/groups/:id/restart')
.post(auth.session())
.post(function validateRestartGroup(request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {
        return response.send(405);
    }
    return next();
})
.post(function restartGroup(request, response, next) {
    'use strict';

    var group, query;
    group = request.group;
    query = GroupMember.find();
    query.where('group').equals(group._id);
    query.populate('user');
    query.exec(function (error, members) {
        if (error) {
            error = new VError(error, 'error finding groupMembers to restart group: "%s"', request.group._id);
            return next(error);
        }
        return async.each(members, function (member, next) {
            member.initialFunds = member.user.funds;
            member.save(next);
        }, function (error) {
            if (error) {
                error = new VError(error, 'error restarting group: "%s"', request.group._id);
                return next(error);
            }
            return response.send(200, group);
        });
    });
});

/**
 * @method
 * @summary Puts requested group in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', function findGroup(request, response, next, id) {
    'use strict';

    var query;
    query = Group.findOne();
    query.where('slug').equals(id.toLowerCase());
    query.populate('owner');
    return query.exec(function foundGroup(error, group) {
        if (error) {
            error = new VError(error, 'error finding group: "$s"', id);
            return next(error);
        }
        if (!group) {
            return response.send(404);
        }
        request.group = group;
        return next();
    });
});

module.exports = router;