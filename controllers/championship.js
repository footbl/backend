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
var VError, router, nconf, slug, auth, Championship;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
auth = require('../lib/auth');
Championship = require('../models/championship');

/**
 * @api {post} /championships Creates a new championship.
 * @apiName createChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission admin
 * @apiDescription
 * Creates a new championship.
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
router
.route('/championships')
.post(auth.signature())
.post(auth.session('admin'))
.post(function createChampionship(request, response, next) {
    'use strict';

    var championship;
    championship = new Championship({
        'slug'    : slug(request.param('name', '')) + '-' + slug(request.param('country', '')) + '-' + request.param('edition', ''),
        'name'    : request.param('name'),
        'picture' : request.param('picture'),
        'edition' : request.param('edition'),
        'type'    : request.param('type', 'national league'),
        'country' : request.param('country')
    });
    return championship.save(function createdChampionship(error) {
        if (error) {
            error = new VError(error, 'error creating championship');
            return next(error);
        }
        response.header('Location', '/championships/' + championship.slug);
        response.header('Last-Modified', championship.updatedAt);
        return response.send(201, championship);
    });
});

/**
 * @api {get} /championships List all championships
 * @apiName listChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission user
 * @apiDescription
 * List all championships.
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
router
.route('/championships')
.get(auth.signature())
.get(auth.session())
.get(function listChampionship(request, response, next) {
    'use strict';

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
        return response.send(200, championships);
    });
});

/**
 * @api {get} /championships/:id Get championship info
 * @apiName getChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission user
 * @apiDescription
 * Get championship info.
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
router
.route('/championships/:id')
.get(auth.signature())
.get(auth.session())
.get(function getChampionship(request, response) {
    'use strict';

    var championship;
    championship = request.championship;
    response.header('Last-Modified', championship.updatedAt);
    return response.send(200, championship);
});

/**
 * @api {put} /championships/:id Updates championship info
 * @apiName updateChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission admin
 * @apiDescription
 * Updates championship info.
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
router
.route('/championships/:id')
.put(auth.signature())
.put(auth.session('admin'))
.put(function updateChampionship(request, response, next) {
    'use strict';

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
            error = new VError(error, 'error updating championship');
            return next(error);
        }
        response.header('Last-Modified', championship.updatedAt);
        return response.send(200, championship);
    });
});

/**
 * @api {delete} /championships/:id Removes championship 
 * @apiName removeChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission admin
 * @apiDescription
 * Removes championship 
 */
router
.route('/championships/:id')
.delete(auth.signature())
.delete(auth.session('admin'))
.delete(function removeChampionship(request, response, next) {
    'use strict';

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