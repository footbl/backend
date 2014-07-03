/**
 * @apiDefineStructure championshipParams
 * @apiParam {String} name Championship name.
 * @apiParam {String} [picture] Championship picture for display.
 * @apiParam {Number} year Championship year of occurrence.
 * @apiParam {String} [type='national league'] Championship type.
 * @apiParam {String} country Championship country of occurrence.
 */
/**
 * @apiDefineStructure championshipSuccess
 * @apiSuccess {String} name Championship name.
 * @apiSuccess {String} slug Championship identifier.
 * @apiSuccess {String} picture Championship picture for display.
 * @apiSuccess {Number} year Championship year of occurrence.
 * @apiSuccess {String} type Championship type.
 * @apiSuccess {String} country Championship country of occurrence.
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 * @apiSuccess {Number} rounds Championship number of rounds.
 * @apiSuccess {Number} currentRound Championship current round.
 */
var VError, router, nconf, slug, Championship;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
Championship = require('../models/championship');

/**
 * @api {post} /championships Creates a new championship in database.
 * @apiName createChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission admin
 * @apiDescription
 * Creates a new championship in database. To create a new championship, the client must provide a name, picture,
 * edition, type and country. The the properties name, edition are required, and the default value for the type is
 * national league.
 *
 * @apiStructure championshipParams
 * @apiStructure championshipSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required",
 *       "edition": "required",
 *       "country": "required",
 *       "type": "enum"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "name": "Brasileirão",
 *       "slug": "brasileirao-brasil-2014",
 *       "country" : "brasil",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "edition": 2014,
 *       "type": "national league",
 *       "rounds": 7,
 *       "currentRound" : 4,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router.post('/championships', function createChampionship(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {
        return response.send(401);
    }

    var championship;
    championship = new Championship({
        'slug' : slug(request.param('name', '')) + '-' + slug(request.param('country', '')) + '-' + request.param('edition', ''),
        'name' : request.param('name'),
        'picture' : request.param('picture'),
        'edition' : request.param('edition'),
        'type' : request.param('type', 'national league'),
        'country' : request.param('country')
    });
    return championship.save(function createdChampionship(error) {
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
            error = new VError(error, 'error creating championship');
            return next(error);
        }
        response.header('Location', '/championships/' + championship.slug);
        response.header('Last-Modified', championship.updatedAt);
        return response.send(201, championship);
    });
});

/**
 * @api {get} /championships List all championships in database
 * @apiName listChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission user
 * @apiDescription
 * List all championships in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure championshipSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "name": "Brasileirão",
 *       "slug": "brasileirao-brasil-2014",
 *       "country" : "brasil",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "edition": 2014,
 *       "type": "national league",
 *       "rounds": 7,
 *       "currentRound" : 4,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router.get('/championships', function listChampionship(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401);
    }

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Championship.find();
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedChampionship(error, championships) {
        if (error) {
            error = new VError(error, 'error finding championships');
            return next(error);
        }
        if (championships.length > 0) {
            response.header('Last-Modified', championships.sort(function (a, b) {
                return b.updatedAt - a.updatedAt;
            })[0].updatedAt);
        }
        return response.send(200, championships);
    });
});

/**
 * @api {get} /championships/:id Get championship info in database
 * @apiName getChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission user
 * @apiDescription
 * Get championship info in database.
 *
 * @apiStructure championshipSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "Brasileirão",
 *       "slug": "brasileirao-brasil-2014",
 *       "country" : "brasil",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "edition": 2014,
 *       "type": "national league",
 *       "rounds": 7,
 *       "currentRound" : 4,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router.get('/championships/:id', function getChampionship(request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401);
    }

    var championship;
    championship = request.championship;
    response.header('Last-Modified', championship.updatedAt);
    return response.send(200, championship);
});

/**
 * @api {put} /championships/:id Updates championship info in database
 * @apiName updateChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission admin
 * @apiDescription
 * Updates championship info in database.
 *
 * @apiStructure championshipParams
 * @apiStructure championshipSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required",
 *       "edition": "required",
 *       "country": "required",
 *       "type": "enum"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "Brasileirão",
 *       "slug": "brasileirao-brasil-2014",
 *       "country" : "brasil",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "edition": 2014,
 *       "type": "national league",
 *       "rounds": 7,
 *       "currentRound" : 4,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router.put('/championships/:id', function updateChampionship(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {
        return response.send(401);
    }

    var championship;
    championship = request.championship;

    championship.slug = slug(request.param('name', '')) + '-' + slug(request.param('country', '')) + '-' + request.param('edition', '');
    championship.name = request.param('name');
    championship.picture = request.param('picture');
    championship.edition = request.param('edition');
    championship.type = request.param('type', 'national league');
    championship.country = request.param('country');
    return championship.save(function updatedChampionship(error) {
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
            error = new VError(error, 'error creating championship');
            return next(error);
        }
        response.header('Last-Modified', championship.updatedAt);
        return response.send(200, championship);
    });
});

/**
 * @api {delete} /championships/:id Removes championship from database
 * @apiName removeChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission admin
 * @apiDescription
 * Removes championship from database
 */
router.delete('/championships/:id', function removeChampionship(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {
        return response.send(401);
    }

    var championship;
    championship = request.championship;
    return championship.remove(function removedChampionship(error) {
        if (error) {
            error = new VError(error, 'error removing championship: "$s"', request.params.id);
            return next(error);
        }
        response.header('Last-Modified', championship.updatedAt);
        return response.send(204);
    });
});

/**
 * @method
 * @summary Puts requested championship in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', function findChampionship(request, response, next, id) {
    'use strict';

    if (!request.session) {
        return response.send(401);
    }

    var query;
    query = Championship.findOne();
    query.where('slug').equals(id);
    return query.exec(function foundChampionship(error, championship) {
        if (error) {
            error = new VError(error, 'error finding championship: "$s"', id);
            return next(error);
        }
        if (!championship) {
            return response.send(404);
        }
        request.championship = championship;
        return next();
    });
});

module.exports = router;