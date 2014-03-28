/**
 * @module
 * Manages match resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, Match;

router = require('express').Router();
nconf  = require('nconf');
Match  = require('../models/match');

/**
 * @method
 * @summary Creates a new match in database
 *
 * @param request.championshipId
 * @param request.date
 * @param request.guest
 * @param request.visitor
 * @param response
 *
 * @returns 201 match
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/championships/:championshipId/matches', function (request, response) {
    'use strict';
    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var match;
    match = new Match({
        'date'         : request.param('date'),
        'championship' : request.params.championshipId,
        'guest'        : request.param('guest'),
        'host'         : request.param('host')
    });

    return match.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(201, match);
    });
});

/**
 * @method
 * @summary List all matches in database
 *
 * @param request
 * @param response
 *
 * @returns 200 [match]
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

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
        if (error) {return response.send(500, error);}
        return response.send(200, matches);
    });
});

/**
 * @method
 * @summary Get match info in database
 *
 * @param request.matchId
 * @param response
 *
 * @returns 200 match
 * @throws 404 match not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

    var match;
    match = request.match;

    return response.send(200, match);
});

/**
 * @method
 * @summary Finishes a match
 *
 * @param request.matchId
 * @param request.result
 * @param response
 *
 * @returns 200 match
 * @throws 404 match not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId/finish', function (request, response) {
    'use strict';
    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var match;
    match = request.match;
    return match.finish(function (error) {
        if (error) {return response.send(500, error);}

        return response.send(200, match);
    });
});

/**
 * @method
 * @summary Updates match info in database
 *
 * @param request.date
 * @param request.guest
 * @param request.visitor
 * @param response
 *
 * @returns 200 match
 * @throws 500 error
 * @throws 404 match not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId', function (request, response) {
    'use strict';
    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var match;
    match = request.match;
    match.date   = request.param('date');
    match.guest  = request.param('guest');
    match.host   = request.param('host');
    match.result = request.param('result');

    return match.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, match);
    });
});

/**
 * @method
 * @summary Removes match from database
 *
 * @param request.championshipId
 * @param response
 *
 * @returns 200 match
 * @throws 500 error
 * @throws 404 match not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/championships/:championshipId/matches/:matchId', function (request, response) {
    'use strict';
    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var match;
    match = request.match;

    return match.remove(function (error) {
        if (error) {return response.send(500, error);}
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
 * @since 2013-03
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
        if (error) {return response.send(404, 'match not found');}
        if (!match) {return response.send(404, 'match not found');}

        request.match = match;
        return next();
    });
});

module.exports = router;