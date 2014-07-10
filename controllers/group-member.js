/**
 * @apiDefineStructure groupMemberParams
 * @apiParam {String} user GroupMember user
 */
/**
 * @apiDefineStructure groupMemberSuccess
 * @apiSuccess {String} slug GroupMember identifier.
 * @apiSuccess {Number} ranking GroupMember current ranking
 * @apiSuccess {Number} previousRanking GroupMember previous ranking
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 *
 * @apiSuccess (user) {String} slug User identifier
 * @apiSuccess (user) {String} email User email
 * @apiSuccess (user) {String} username User username
 * @apiSuccess (user) {String} name User name
 * @apiSuccess (user) {String} about User about
 * @apiSuccess (user) {Boolean} verified User verified
 * @apiSuccess (user) {Boolean} featured User featured
 * @apiSuccess (user) {String} picture User picture
 * @apiSuccess (user) {String} apnsToken User apnsToken
 * @apiSuccess (user) {Number} ranking User current ranking
 * @apiSuccess (user) {Number} previousRanking User previous ranking
 * @apiSuccess (user) {Date} createdAt Date of document creation.
 * @apiSuccess (user) {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, auth, errorParser, GroupMember, Group, User;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
auth = require('../lib/auth');
errorParser = require('../lib/error-parser');
GroupMember = require('../models/group-member');
Group = require('../models/group');
User = require('../models/user');

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
 * @method
 * @summary Puts requested user in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
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
 * @apiStructure groupMemberParams
 * @apiStructure groupMemberSuccess
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
.post(auth.signature())
.post(auth.session())
.post(errorParser.notFound('group'))
.post(function (request, response, next) {
    'use strict';

    var group;
    group = request.group;
    if (!group.freeToEdit && request.session._id.toString() !== group.owner.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }
    return next();
})
.post(function createGroupMember(request, response, next) {
    'use strict';

    var groupMember;
    groupMember = new GroupMember({
        'slug'  : request.groupUser ? request.groupUser.slug : null,
        'group' : request.group ? request.group._id : null,
        'user'  : request.groupUser ? request.groupUser._id : null
    });
    return groupMember.save(function createdGroupMember(error) {
        if (error) {
            error = new VError(error, 'error creating groupMember');
            return next(error);
        }
        groupMember.populate('user');
        return groupMember.populate(function populateGroupMemberAfterSave(error) {
            if (error) {
                error = new VError(error, 'error populating user: "$s"', groupMember._id);
                return next(error);
            }
            response.header('Location', '/groups/' + request.params.group + '/members/' + groupMember.slug);
            response.header('Last-Modified', groupMember.updatedAt);
            return response.send(201, groupMember);
        });
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
 * @apiStructure groupMemberSuccess
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
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('group'))
.get(function listGroupMember(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = GroupMember.find();
    query.where('group').equals(request.group._id);
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedGroupMember(error, groupMembers) {
        if (error) {
            error = new VError(error, 'error finding groupMembers');
            return next(error);
        }
        return response.send(200, groupMembers);
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
 * @apiStructure groupMemberSuccess
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
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('group'))
.get(errorParser.notFound('groupMember'))
.get(function getGroupMember(request, response) {
    'use strict';

    var groupMember;
    groupMember = request.groupMember;
    response.header('Last-Modified', groupMember.updatedAt);
    return response.send(200, groupMember);
});

/**
 * @api {put} /groups/:group/members/:id Updates groupMember info
 * @apiName updateGroupMember
 * @apiVersion 2.0.1
 * @apiGroup groupMember
 * @apiPermission user
 * @apiDescription
 * Updates groupMember info.
 *
 * @apiStructure groupMemberParams
 * @apiStructure groupMemberSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "user": "required"
 *     }
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
.put(auth.signature())
.put(auth.session())
.put(errorParser.notFound('group'))
.put(errorParser.notFound('groupMember'))
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
.put(function updateGroupMember(request, response, next) {
    'use strict';

    var groupMember;
    groupMember = request.groupMember;
    groupMember.slug = request.groupUser ? request.groupUser.slug : null;
    groupMember.user = request.groupUser ? request.groupUser._id : null;
    return groupMember.save(function updatedGroupMember(error) {
        if (error) {
            error = new VError(error, 'error updating groupMember');
            return next(error);
        }
        groupMember.populate('user');
        return groupMember.populate(function populateGroupMemberAfterUpdate(error) {
            if (error) {
                error = new VError(error, 'error populating user: "$s"', groupMember._id);
                return next(error);
            }
            response.header('Last-Modified', groupMember.updatedAt);
            return response.send(200, groupMember);
        });
    });
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
.delete(auth.signature())
.delete(auth.session())
.delete(errorParser.notFound('group'))
.delete(errorParser.notFound('groupMember'))
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
.delete(function removeGroupMember(request, response, next) {
    'use strict';

    var groupMember;
    groupMember = request.groupMember;
    return groupMember.remove(function removedGroupMember(error) {
        if (error) {
            error = new VError(error, 'error removing groupMember: "$s"', request.params.id);
            return next(error);
        }
        response.header('Last-Modified', groupMember.updatedAt);
        return response.send(204);
    });
});

/**
 * @method
 * @summary Puts requested groupMember in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', errorParser.notFound('group'));
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
        request.groupMember = groupMember;
        return next();
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
        request.group = group;
        return next();
    });
});

router.use(errorParser.mongoose());

module.exports = router;