/**
 * @apiDefineStructure featuredParams
 * @apiParam {String} featured Featured user
 */
/**
 * @apiDefineStructure featuredSuccess
 * @apiSuccess {String} slug Featured identifier
 * @apiSuccess {String} featured Featured user
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, auth, errorParser, Featured;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
auth = require('../lib/auth');
errorParser = require('../lib/error-parser');
Featured = require('../models/featured');

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
 * @api {post} /featured Creates a new featured.
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
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/featured')
.post(auth.signature())
.post(auth.session())
.post(function createFeatured(request, response, next) {
    'use strict';

    var featured;
    featured = new Featured({
        'slug' : slug(request.param(''))
    });
    return featured.save(function createdFeatured(error) {
        if (error) {
            error = new VError(error, 'error creating featured');
            return next(error);
        }
        response.header('Location', '/featured/' + featured.slug);
        response.header('Last-Modified', featured.updatedAt);
        return response.send(201, featured);
    });
});

/**
 * @api {get} /featured List all featured
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
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/featured')
.get(auth.signature())
.get(auth.session())
.get(function listFeatured(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Featured.find();
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
 * @api {get} /featured/:id Get featured info
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
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/featured/:id')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('featured'))
.get(function getFeatured(request, response) {
    'use strict';

    var featured;
    featured = request.featured;
    response.header('Last-Modified', featured.updatedAt);
    return response.send(200, featured);
});

/**
 * @api {put} /featured/:id Updates featured info
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
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/featured/:id')
.put(auth.signature())
.put(auth.session())
.put(errorParser.notFound('featured'))
.put(function updateFeatured(request, response, next) {
    'use strict';

    var featured;
    featured = request.featured;
    featured.slug = slug(request.param(''));
    return featured.save(function updatedFeatured(error) {
        if (error) {
            error = new VError(error, 'error updating featured');
            return next(error);
        }
        response.header('Last-Modified', featured.updatedAt);
        return response.send(200, featured);
    });
});

/**
 * @api {delete} /featured/:id Removes featured from database
 * @apiName removeFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Removes featured from database
 */
router
.route('/featured/:id')
.delete(auth.signature())
.delete(auth.session())
.delete(errorParser.notFound('featured'))
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
router.param('id', function findFeatured(request, response, next, id) {
    'use strict';

    var query;
    query = Featured.findOne();
    query.where('slug').equals(id);
    query.exec(function foundFeatured(error, featured) {
        if (error) {
            error = new VError(error, 'error finding featured: "$s"', id);
            return next(error);
        }
        request.featured = featured;
        return next();
    });
});

router.use(errorParser.mongoose());

module.exports = router;