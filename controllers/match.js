/**
 * @module
 * Manages match resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, errorParser, Match, Team;

router      = require('express').Router();
nconf       = require('nconf');
errorParser = require('../lib/error-parser');
Match       = require('../models/match');
Team        = require('../models/team');

/**
 * @method
 * @summary Creates a new match in database
 *
 * @param request.championshipId
 * @param request.date
 * @param request.guest
 * @param request.host
 * @param request.round
 * @param response
 *
 * @returns 201 match
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/championships/:championshipId/matches', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var match;
    match = new Match({
        'date'         : request.param('date'),
        'championship' : request.params.championshipId,
        'guest'        : request.param('guest'),
        'host'         : request.param('host'),
        'round'        : request.param('round')
    });

    return match.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        response.header('Location', '/championships/' + request.param.championshipId + '/matches/' + match._id);
        return Team.populate(match, {'path' : 'guest'}, function (error, match) {
            if (error) { return response.send(500, errorParser(error)); }
            return Team.populate(match, {'path' : 'host'}, function (error, match) {
                if (error) { return response.send(500, errorParser(error)); }
                return response.send(201, match);
            });
        });
    });
});

/**
 * @method
 * @summary List all matches in database
 *
 * @param request.championshipId
 * @param request.page
 * @param response
 *
 * @returns 200 [match]
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en')
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize;
    query    = Match.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.where('championship').equals(request.params.championshipId);
    query.populate('championship');
    query.populate('guest');
    query.populate('host');
    query.sort({'date' : 1});
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, matches) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, matches);
    });
});

/**
 * @method
 * @summary Get match info in database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param response
 *
 * @returns 200 match
 * @throws 404 match not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var match;
    match = request.match;

    response.header('Last-Modified', match.updatedAt);
    return response.send(200, match);
});

/**
 * @method
 * @summary Finishes a match
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.result
 * @param response
 *
 * @returns 200 match
 * @throws 404 match not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId/finish', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var match;
    match = request.match;
    match.finished = true;
    return match.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, match);
    });
});

/**
 * @method
 * @summary Updates match info in database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.date
 * @param request.guest
 * @param request.visitor
 * @param request.round
 * @param response
 *
 * @returns 200 match
 * @throws 500 error
 * @throws 404 match not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var match;
    match = request.match;
    match.date     = request.param('date');
    match.guest    = request.param('guest');
    match.host     = request.param('host');
    match.round    = request.param('round');
    match.elapsed  = request.param('elapsed');

    return match.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, match);
    });
});

/**
 * @method
 * @summary Removes match from database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param response
 *
 * @returns 200 match
 * @throws 500 error
 * @throws 404 match not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/championships/:championshipId/matches/:matchId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var match;
    match = request.match;

    return match.remove(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, match);
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
 *
 * @returns match
 * @throws 404 match not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.param('matchId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Match.findOne();
    query.where('_id').equals(id);
    query.where('championship').equals(request.params.championshipId);
    query.populate('guest');
    query.populate('host');
    query.exec(function (error, match) {
        if (error) { return response.send(404, 'match not found'); }
        if (!match) { return response.send(404, 'match not found'); }

        request.match = match;
        return next();
    });
});

module.exports = router;