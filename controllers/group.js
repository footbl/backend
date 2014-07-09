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
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, async, auth, errorParser, Group, GroupMember;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('../lib/auth');
errorParser = require('../lib/error-parser');
Group = require('../models/group');
GroupMember = require('../models/group-member');

/**
 * @method
 * @summary Setups default headers
 *
 * @param request
 * @param response
 * @param next
 */
router.use(function (request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', request.get('Access-Control-Request-Method'));
    response.header('Access-Control-Allow-Headers', request.get('Access-Control-Request-Headers'));
    next();
});

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
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups')
.post(auth.signature())
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
        'slug'  : request.session.slug,
        'user'  : request.session._id,
        'group' : group._id
    });

    return async.series([group.save.bind(group), groupMember.save.bind(groupMember)], function (error) {
        if (error) {
            error = new VError(error, 'error creating group');
            return next(error);
        }
        response.header('Location', '/groups/' + group.slug);
        response.header('Last-Modified', group.updatedAt);
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
 * @apiStructure groupSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "name": "College Buddies",
 *       "slug": "abcde",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "freeToEdit": false,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/groups')
.get(auth.signature())
.get(auth.session())
.get(function listGroup(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
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
        return response.send(200, groupMembers.map(function (groupMember) {
            return groupMember.group;
        }));
    });
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
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:id')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('group'))
.get(function getGroup(request, response) {
    'use strict';

    var group;
    group = request.group;
    response.header('Last-Modified', group.updatedAt);
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
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/groups/:id')
.put(auth.signature())
.put(auth.session())
.put(errorParser.notFound('group'))
.put(function (request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
        response.header('Allow', 'GET');
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
    group.freeToEdit = request.session._id.toString() === group.owner.toString() ? request.param('freeToEdit', false) : group.freeToEdit;
    return group.save(function updatedGroup(error) {
        if (error) {
            error = new VError(error, 'error updating group');
            return next(error);
        }
        response.header('Last-Modified', group.updatedAt);
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
.delete(auth.signature())
.delete(auth.session())
.delete(errorParser.notFound('group'))
.delete(function (request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
        response.header('Allow', 'GET');
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
        response.header('Last-Modified', group.updatedAt);
        return response.send(204);
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
    return query.exec(function foundGroup(error, group) {
        if (error) {
            error = new VError(error, 'error finding group: "$s"', id);
            return next(error);
        }
        request.group = group;
        return next();
    });
});

router.use(errorParser.mongoose());

module.exports = router;