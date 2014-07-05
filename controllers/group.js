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
var VError, router, nconf, slug, Group;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
Group = require('../models/group');

/**
 * @api {post} /groups Creates a new group in database.
 * @apiName createGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Creates a new group in database.
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
router.post('/groups', function createGroup(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401, 'invalid token');
    }

    var group;
    group = new Group({
        'name' : request.param('name'),
        'slug': new Date().getTime().toString(36).substring(3),
        'picture' : request.param('picture'),
        'freeToEdit' : request.param('freeToEdit', false),
        'owner' : request.session._id
    });
    group.members.push({
        'user' : request.session._id
    });
    return group.save(function createdGroup(error) {
        if (error) {
            if (error.code === 11000) {
                return response.send(409);
            }
            if (error.errors) {
                var errors, prop;
                errors = {};
                for (prop in error.errors) {
                    if (error.errors.hasOwnProperty(prop)) {
                        errors[prop] = error.errors[prop].type;
                    }
                }
                return response.send(400, errors);
            }
            error = new VError(error, 'error creating group');
            return next(error);
        }
        response.header('Location', '/groups/' + group.slug);
        response.header('Last-Modified', group.updatedAt);
        return response.send(201, group);
    });
});

/**
 * @api {get} /groups List all groups in database
 * @apiName listGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * List all groups in database.
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
router.get('/groups', function listGroup(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401, 'invalid token');
    }

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Group.find();
    query.where('members.user').equals(request.session._id);
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedGroup(error, groups) {
        if (error) {
            error = new VError(error, 'error finding groups');
            return next(error);
        }
        if (groups.length > 0) {
            response.header('Last-Modified', groups.sort(function (a, b) {
                return b.updatedAt - a.updatedAt;
            })[0].updatedAt);
        }
        return response.send(200, groups);
    });
});

/**
 * @api {get} /groups/:id Get group info in database
 * @apiName getGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Get group info in database.
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
router.get('/groups/:id', function getGroup(request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401, 'invalid token');
    }

    var group;
    group = request.group;
    response.header('Last-Modified', group.updatedAt);
    return response.send(200, group);
});

/**
 * @api {put} /groups/:id Updates group info in database
 * @apiName updateGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Updates group info in database.
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
router.put('/groups/:id', function updateGroup(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401, 'invalid token');
    }

    var group;
    group = request.group;

    if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }

    group.name = request.param('name');
    group.picture = request.param('picture');

    if (request.session._id.toString() === group.owner.toString()) {
        group.freeToEdit = request.param('freeToEdit', false);
    }

    return group.save(function updatedGroup(error) {
        if (error) {
            if (error.code === 11001) {
                return response.send(409);
            }
            if (error.errors) {
                var errors, prop;
                errors = {};
                for (prop in error.errors) {
                    if (error.errors.hasOwnProperty(prop)) {
                        errors[prop] = error.errors[prop].type;
                    }
                }
                return response.send(400, errors);
            }
            error = new VError(error, 'error creating group');
            return next(error);
        }
        response.header('Last-Modified', group.updatedAt);
        return response.send(200, group);
    });
});

/**
 * @api {delete} /groups/:id Removes group from database
 * @apiName removeGroup
 * @apiVersion 2.0.1
 * @apiGroup group
 * @apiPermission user
 * @apiDescription
 * Removes group from database
 */
router.delete('/groups/:id', function removeGroup(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401, 'invalid token');
    }

    var group;
    group = request.group;

    if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }

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

    if (!request.session) {
        return response.send(401, 'invalid token');
    }

    var query;
    query = Group.findOne();
    query.where('slug').equals(id.toLowerCase());
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