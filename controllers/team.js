/**
 * @apiDefineStructure teamParams
 * @apiParam {string} name Team name
 * @apiParam {string} [picture] Team picture
 */
/**
 * @apiDefineStructure teamSuccess
 * @apiSuccess {String} name Team name.
 * @apiSuccess {String} picture Team picture.
 * @apiSuccess {String} slug Team identifier.
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, auth, errorParser, Team;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
auth = require('../lib/auth');
errorParser = require('../lib/error-parser');
Team = require('../models/team');

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
 * @api {post} /teams Creates a new team in database.
 * @apiName createTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission admin
 * @apiDescription
 * Creates a new team in database.
 *
 * @apiStructure teamParams
 * @apiStructure teamSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required",
 *       "picture": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "slug": "53b2a7f0fea3f69192122f38",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/teams')
.post(auth.signature())
.post(auth.session('admin'))
.post(function createTeam(request, response, next) {
    'use strict';

    var team;
    team = new Team({
        'slug'    : slug(request.param('name', '')),
        'name'    : request.param('name'),
        'picture' : request.param('picture')
    });
    return team.save(function createdTeam(error) {
        if (error) {
            error = new VError(error, 'error creating team');
            return next(error);
        }
        response.header('Location', '/teams/' + team.slug);
        response.header('Last-Modified', team.updatedAt);
        return response.send(201, team);
    });
});

/**
 * @api {get} /teams List all teams in database
 * @apiName listTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission user
 * @apiDescription
 * List all teams in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure teamSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/teams')
.get(auth.signature())
.get(auth.session())
.get(function listTeam(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Team.find();
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedTeam(error, teams) {
        if (error) {
            error = new VError(error, 'error finding teams');
            return next(error);
        }
        return response.send(200, teams);
    });
});

/**
 * @api {get} /teams/:id Get team info in database
 * @apiName getTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission user
 * @apiDescription
 * Get team info in database.
 *
 * @apiStructure teamSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/teams/:id')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('team'))
.get(function getTeam(request, response) {
    'use strict';

    var team;
    team = request.team;
    response.header('Last-Modified', team.updatedAt);
    return response.send(200, team);
});

/**
 * @api {put} /teams/:id Updates team info in database
 * @apiName updateTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission admin
 * @apiDescription
 * Updates team info in database.
 *
 * @apiStructure teamParams
 * @apiStructure teamSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required",
 *       "picture": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/teams/:id')
.put(auth.signature())
.put(auth.session('admin'))
.put(errorParser.notFound('team'))
.put(function updateTeam(request, response, next) {
    'use strict';

    var team;
    team = request.team;
    team.slug = slug(request.param('name', ''));
    team.name = request.param('name');
    team.picture = request.param('picture');
    return team.save(function updatedTeam(error) {
        if (error) {
            error = new VError(error, 'error updating team');
            return next(error);
        }
        response.header('Last-Modified', team.updatedAt);
        return response.send(200, team);
    });
});

/**
 * @api {delete} /teams/:id Removes team from database
 * @apiName removeTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission admin
 * @apiDescription
 * Removes team from database
 */
router
.route('/teams/:id')
.delete(auth.signature())
.delete(auth.session('admin'))
.delete(errorParser.notFound('team'))
.delete(function removeTeam(request, response, next) {
    'use strict';

    var team;
    team = request.team;
    return team.remove(function removedTeam(error) {
        if (error) {
            error = new VError(error, 'error removing team: "$s"', request.params.id);
            return next(error);
        }
        response.header('Last-Modified', team.updatedAt);
        return response.send(204);
    });
});

/**
 * @method
 * @summary Puts requested team in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', function findTeam(request, response, next, id) {
    'use strict';

    var query;
    query = Team.findOne();
    query.where('slug').equals(id);
    return query.exec(function foundTeam(error, team) {
        if (error) {
            error = new VError(error, 'error finding team: "$s"', id);
            return next(error);
        }
        request.team = team;
        return next();
    });
});

router.use(errorParser.mongoose());

module.exports = router;