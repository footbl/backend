/**
 * @apiDefineStructure matchParams
 * @apiParam {String} guest Match guest team slug
 * @apiParam {String} host Match host team slug
 * @apiParam {Number} round Match round
 * @apiParam {Date} date Match date
 * @apiParam {Boolean} [finished=false] Match status
 * @apiParam {Number} [elapsed] Match elapsed time
 * @apiParam {Number} [score.guest=0] Match guest team score
 * @apiParam {Number} [score.host=0] Match host team score
 */
/**
 * @apiDefineStructure matchSuccess
 * @apiSuccess {String} slug Match identifier.
 * @apiSuccess {String} guest Match guest team slug.
 * @apiSuccess {String} host Match host team slug.
 * @apiSuccess {Number} round Match round.
 * @apiSuccess {Date} date Match date.
 * @apiSuccess {Boolean} finished Match status.
 * @apiSuccess {Number} elapsed Match elapsed time.
 * @apiSuccess {Number} score.guest Match guest team score.
 * @apiSuccess {Number} score.host Match host team score.
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, async, Match, Championship, Team;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
Match = require('../models/match');
Championship = require('../models/championship');
Team = require('../models/team');

/**
 * @method
 * @summary Puts requested guest in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.use(function (request, response, next) {
    'use strict';

    var query, guest;
    guest = request.param('guest');
    if (!guest) { return next(); }
    query = Team.findOne();
    query.where('slug').equals(guest);
    return query.exec(function (error, team) {
        if (error) {
            error = new VError(error, 'error finding guest: "$s"', guest);
            return next(error);
        }
        request.guestTeam = team;
        return next();
    });
});

/**
 * @method
 * @summary Puts requested host in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.use(function (request, response, next) {
    'use strict';

    var query, host;
    host = request.param('host');
    if (!host) { return next(); }
    query = Team.findOne();
    query.where('slug').equals(host);
    return query.exec(function (error, team) {
        if (error) {
            error = new VError(error, 'error finding host: "$s"', host);
            return next(error);
        }
        request.hostTeam = team;
        return next();
    });
});

/**
 * @api {post} /championships/:championship/matches Creates a new match in database.
 * @apiName createMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission admin
 * @apiDescription
 * Creates a new match in database.
 *
 * @apiStructure matchParams
 * @apiStructure matchSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "guest" : "required",
 *       "host" : "required",
 *       "round" : "required",
 *       "date" : "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *       "guest": {
 *         "name": "fluminense",
 *         "slug": "fluminense",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "host": {
 *         "name": "botafogo",
 *         "slug": "botafogo",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "round": 3,
 *       "date": "2014-07-01T12:22:25.058Z",
 *       "finished": true,
 *       "elapsed": null,
 *       "score": {
 *         "guest": 0,
 *         "host" 0
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router.post('/championships/:championship/matches', function createMatch(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {
        return response.send(401);
    }

    var match;
    match = new Match({
        'slug' : 'round-' + request.param('round', '') + '-' + slug(request.hostTeam ? request.hostTeam.name || '' : '') + '-vs-' + slug(request.guestTeam ? request.guestTeam.name || '' : ''),
        'championship' : request.championship._id,
        'guest' : request.guestTeam ? request.guestTeam._id : null,
        'host' : request.hostTeam ? request.hostTeam._id : null,
        'round' : request.param('round'),
        'date' : request.param('date'),
        'finished' : request.param('finished', false),
        'elapsed' : request.param('elapsed'),
        'score' : request.param('score')
    });
    return match.save(function createdMatch(error) {
        var query, errors, prop;
        if (error) {
            if (error.code === 11000) {
                return response.send(409);
            }
            if (error.errors) {
                errors = {};
                for (prop in error.errors) {
                    if (error.errors.hasOwnProperty(prop)) {
                        errors[prop] = error.errors[prop].type;
                    }
                }
                return response.send(400, errors);
            }
            error = new VError(error, 'error creating match');
            return next(error);
        }
        query = Match.findOne();
        query.where('_id').equals(match._id);
        query.populate('guest');
        query.populate('host');
        return query.exec(function (error, match) {
            if (error) {
                error = new VError(error, 'error finding match: "$s"', match._id);
                return next(error);
            }
            response.header('Last-Modified', match.updatedAt);
            response.header('Location', '/matches/' + match.slug);
            return response.send(201, match);
        });
    });
});

/**
 * @api {get} /championships/:championship/matches List all matches in database
 * @apiName listMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission user
 * @apiDescription
 * List all matches in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure matchSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *       "guest": {
 *         "name": "fluminense",
 *         "slug": "fluminense",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "host": {
 *         "name": "botafogo",
 *         "slug": "botafogo",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "round": 3,
 *       "date": "2014-07-01T12:22:25.058Z",
 *       "finished": true,
 *       "elapsed": null,
 *       "score": {
 *         "guest": 0,
 *         "host" 0
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router.get('/championships/:championship/matches', function listMatch(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401);
    }

    var pageSize, page, query, championship;
    championship = request.championship;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Match.find();
    query.where('championship').equals(championship._id);
    query.skip(page);
    query.populate('guest');
    query.populate('host');
    query.limit(pageSize);
    return query.exec(function listedMatch(error, matches) {
        if (error) {
            error = new VError(error, 'error finding matches');
            return next(error);
        }
        if (matches.length > 0) {
            response.header('Last-Modified', matches.sort(function (a, b) {
                return b.updatedAt - a.updatedAt;
            })[0].updatedAt);
        }
        return response.send(200, matches);
    });
});

/**
 * @api {get} /championships/:championship/matches/:id Get match info in database
 * @apiName getMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission user
 * @apiDescription
 * Get match info in database.
 *
 * @apiStructure matchSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *       "guest": {
 *         "name": "fluminense",
 *         "slug": "fluminense",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "host": {
 *         "name": "botafogo",
 *         "slug": "botafogo",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "round": 3,
 *       "date": "2014-07-01T12:22:25.058Z",
 *       "finished": true,
 *       "elapsed": null,
 *       "score": {
 *         "guest": 0,
 *         "host" 0
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router.get('/championships/:championship/matches/:id', function getMatch(request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {
        return response.send(401);
    }

    var match;
    match = request.match;
    response.header('Last-Modified', match.updatedAt);
    return response.send(200, match);
});

/**
 * @api {put} /championships/:championship/matches/:id Updates match info in database
 * @apiName updateMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission admin
 * @apiDescription
 * Updates match info in database.
 *
 * @apiStructure matchParams
 * @apiStructure matchSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "guest" : "required",
 *       "host" : "required",
 *       "round" : "required",
 *       "date" : "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *       "guest": {
 *         "name": "fluminense",
 *         "slug": "fluminense",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "host": {
 *         "name": "botafogo",
 *         "slug": "botafogo",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "round": 3,
 *       "date": "2014-07-01T12:22:25.058Z",
 *       "finished": true,
 *       "elapsed": null,
 *       "score": {
 *         "guest": 0,
 *         "host" 0
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router.put('/championships/:championship/matches/:id', function updateMatch(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {
        return response.send(401);
    }

    var match;
    match = request.match;
    match.slug = 'round-' + request.param('round', '') + '-' + slug(request.guestTeam ? request.guestTeam.name : '') + '-vs-' + slug(request.hostTeam ? request.hostTeam.name :  '');
    match.guest = request.guestTeam ? request.guestTeam._id : null;
    match.host = request.hostTeam ? request.hostTeam._id : null;
    match.round = request.param('round');
    match.date = request.param('date');
    match.finished = request.param('finished', false);
    match.elapsed = request.param('elapsed');
    match.score = request.param('score', {'guest' : 0, 'host' : 0});
    return match.save(function updatedMatch(error) {
        var query, errors, prop;
        if (error) {
            if (error.code === 11001) {
                return response.send(409);
            }
            if (error.errors) {
                errors = {};
                for (prop in error.errors) {
                    if (error.errors.hasOwnProperty(prop)) {
                        errors[prop] = error.errors[prop].type;
                    }
                }
                return response.send(400, errors);
            }
            error = new VError(error, 'error creating match');
            return next(error);
        }
        query = Match.findOne();
        query.where('_id').equals(match._id);
        query.populate('guest');
        query.populate('host');
        return query.exec(function (error, match) {
            if (error) {
                error = new VError(error, 'error finding match: "$s"', match._id);
                return next(error);
            }
            response.header('Last-Modified', match.updatedAt);
            return response.send(200, match);
        });
    });
});

/**
 * @api {delete} /championships/:championship/matches/:id Removes match from database
 * @apiName removeMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission admin
 * @apiDescription
 * Removes match from database
 */
router.delete('/championships/:championship/matches/:id', function removeMatch(request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {
        return response.send(401);
    }

    var match;
    match = request.match;
    return match.remove(function removedMatch(error) {
        if (error) {
            error = new VError(error, 'error removing match: "$s"', request.params.id);
            return next(error);
        }
        response.header('Last-Modified', match.updatedAt);
        return response.send(204);
    });
});

/**
 * @method
 * @summary Puts requested match in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', function findMatch(request, response, next, id) {
    'use strict';

    if (!request.session) {
        return response.send(401);
    }

    var query, championship;
    championship = request.championship;
    query = Match.findOne();
    query.where('slug').equals(id);
    query.where('championship').equals(championship._id);
    query.populate('guest');
    query.populate('host');
    return query.exec(function foundMatch(error, match) {
        if (error) {
            error = new VError(error, 'error finding match: "$s"', id);
            return next(error);
        }
        if (!match) {
            return response.send(404);
        }
        request.match = match;
        return next();
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
router.param('championship', function findChampionship(request, response, next, id) {
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