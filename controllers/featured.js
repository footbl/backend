/**
 * @apiDefineStructure featuredParams
 * @apiParam {String} featured Featured user
 */
/**
 * @apiDefineStructure featuredSuccess
 * @apiSuccess {String} slug Featured identifier
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 *
 * @apiSuccess (featured) {String} slug User identifier
 * @apiSuccess (featured) {String} email User email
 * @apiSuccess (featured) {String} username User username
 * @apiSuccess (featured) {String} name User name
 * @apiSuccess (featured) {String} about User about
 * @apiSuccess (featured) {Boolean} verified User verified
 * @apiSuccess (featured) {Boolean} featured User featured
 * @apiSuccess (featured) {String} picture User picture
 * @apiSuccess (featured) {String} apnsToken User apnsToken
 * @apiSuccess (featured) {Number} ranking User current ranking
 * @apiSuccess (featured) {Number} previousRanking User previous ranking
 * @apiSuccess (featured) {Number} funds User funds
 * @apiSuccess (featured) {Number} stake User stake
 * @apiSuccess (featured) {Date} createdAt Date of document creation.
 * @apiSuccess (featured) {Date} updatedAt Date of document last change.
 *
 * @apiSuccess (featured history) {Date} date Date of history creation
 * @apiSuccess (featured history) {Number} funds Funds in history
 */
var VError, router, nconf, slug, async, async, auth, errorParser, User, Featured;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('../lib/auth');
errorParser = require('../lib/error-parser');
User = require('../models/user');
Featured = require('../models/featured');

/**
 * @method
 * @summary Puts requested user in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.use(function findFeaturedUser(request, response, next) {
    'use strict';

    var query, user;
    user = request.param('featured');
    if (!user) {
        return next();
    }
    query = User.findOne();
    query.where('slug').equals(user);
    return query.exec(function (error, user) {
        if (error) {
            error = new VError(error, 'error finding featured: "$s"', user);
            return next(error);
        }
        request.featuredUser = user;
        return next();
    });
});

/**
 * @api {post} /users/:user/featured Creates a new featured.
 * @apiName createFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Creates a new featured.
 *
 * @apiStructure featuredParams
 * @apiStructure featuredSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "featured": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "vandoren",
 *       "featured": {
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
 *       "user": {
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
.route('/users/:user/featured')
.post(auth.signature())
.post(auth.session())
.post(errorParser.notFound('user'))
.post(function (request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (request.session._id.toString() !== user._id.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }
    return next();
})
.post(function createFeatured(request, response, next) {
    'use strict';

    var featured;
    featured = new Featured({
        'slug'     : request.featuredUser ? request.featuredUser.slug : null,
        'featured' : request.featuredUser,
        'user'     : request.session._id
    });

    return async.series([featured.save.bind(featured), function populateFeaturedAfterSave(next) {
        featured.populate('featured');
        featured.populate('user');
        featured.populate(next);
    }], function createdFeature(error) {
        if (error) {
            error = new VError(error, 'error creating featured: "$s"', featured._id);
            return next(error);
        }
        response.header('Location', '/users/:user/featured/' + featured.slug);
        response.header('Last-Modified', featured.updatedAt);
        return response.send(201, featured);
    });
});

/**
 * @api {get} /users/:user/featured List all featured
 * @apiName listFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * List all featured.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure featuredSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "featured": {
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
 *       "user": {
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
.route('/users/:user/featured')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('user'))
.get(function listFeatured(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Featured.find();
    query.where('user').equals(request.user._id);
    query.populate('featured');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedFeatured(error, featured) {
        if (error) {
            error = new VError(error, 'error finding featured');
            return next(error);
        }
        return response.send(200, featured);
    });
});

/**
 * @api {get} /users/:user/fans List all user fans
 * @apiName listFans
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * List all featured.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure featuredSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "featured": {
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
 *       "user": {
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
.route('/users/:user/fans')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('user'))
.get(function listFans(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Featured.find();
    query.where('featured').equals(request.user._id);
    query.populate('featured');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedFeatured(error, featured) {
        if (error) {
            error = new VError(error, 'error finding featured');
            return next(error);
        }
        return response.send(200, featured);
    });
});

/**
 * @api {get} /users/:user/featured/:id Get featured info
 * @apiName getFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Get featured info.
 *
 * @apiStructure featuredSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "featured": {
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
 *       "user": {
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
.route('/users/:user/featured/:id')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('user'))
.get(errorParser.notFound('featured'))
.get(function getFeatured(request, response) {
    'use strict';

    var featured;
    featured = request.featured;
    response.header('Last-Modified', featured.updatedAt);
    return response.send(200, featured);
});

/**
 * @api {put} /users/:user/featured/:id Updates featured info
 * @apiName updateFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Updates featured info.
 *
 * @apiStructure featuredParams
 * @apiStructure featuredSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "featured": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "featured": {
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
 *       "user": {
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
.route('/users/:user/featured/:id')
.put(auth.signature())
.put(auth.session())
.put(errorParser.notFound('user'))
.put(errorParser.notFound('featured'))
.put(function (request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (request.session._id.toString() !== user._id.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }
    return next();
})
.put(function updateFeatured(request, response, next) {
    'use strict';

    var featured;
    featured = request.featured;
    featured.slug = request.featuredUser ? request.featuredUser.slug : null;
    featured.featured = request.featuredUser;

    return async.series([featured.save.bind(featured), function populateFeaturedAfterUpdate(next) {
        featured.populate('featured');
        featured.populate('user');
        featured.populate(next);
    }], function updatedFeatured(error) {
        if (error) {
            error = new VError(error, 'error updating featured: "$s"', featured._id);
            return next(error);
        }
        response.header('Last-Modified', featured.updatedAt);
        return response.send(200, featured);
    });
});

/**
 * @api {delete} /users/:user/featured/:id Removes featured
 * @apiName removeFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Removes featured
 */
router
.route('/users/:user/featured/:id')
.delete(auth.signature())
.delete(auth.session())
.delete(errorParser.notFound('user'))
.delete(errorParser.notFound('featured'))
.delete(function (request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (request.session._id.toString() !== user._id.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }
    return next();
})
.delete(function removeFeatured(request, response, next) {
    'use strict';

    var featured;
    featured = request.featured;
    return featured.remove(function removedFeatured(error) {
        if (error) {
            error = new VError(error, 'error removing featured: "$s"', request.params.id);
            return next(error);
        }
        response.header('Last-Modified', featured.updatedAt);
        return response.send(204);
    });
});

/**
 * @method
 * @summary Puts requested featured in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', errorParser.notFound('user'));
router.param('id', function findFeatured(request, response, next, id) {
    'use strict';

    var query;
    query = Featured.findOne();
    query.where('user').equals(request.user._id);
    query.where('slug').equals(id);
    query.populate('featured');
    query.populate('user');
    query.exec(function foundFeatured(error, featured) {
        if (error) {
            error = new VError(error, 'error finding featured: "$s"', id);
            return next(error);
        }
        request.featured = featured;
        return next();
    });
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
router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
    'use strict';

    var query;
    query = User.findOne();
    if (id === 'me') {
        request.user = request.session;
        return next();
    }
    query.where('slug').equals(id);
    return query.exec(function foundUser(error, user) {
        if (error) {
            error = new VError(error, 'error finding user: "$s"', id);
            return next(error);
        }
        request.user = user;
        return next();
    });
});

router.use(errorParser.mongoose());

module.exports = router;