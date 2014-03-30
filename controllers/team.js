/**
 * @module
 * Manages team resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, Team;

router = require('express').Router();
nconf  = require('nconf');
Team   = require('../models/team');

/**
 * @method
 * @summary Creates a new team in database
 *
 * @param request.name
 * @param request.picture
 * @param response
 *
 * @returns 201 team
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/teams', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var team;
    team = new Team({
        'name'    : request.param('name'),
        'picture' : request.param('picture')
    });

    return team.save(function (error) {
        if (error) {return response.send(500, error);}
        response.header('Location', '/teams/' + team._id);
        return response.send(201, team);
    });
});

/**
 * @method
 * @summary List all teams in database
 *
 * @param request
 * @param response
 *
 * @returns 200 [team]
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/teams', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var query, page, pageSize;
    query    = Team.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, teams) {
        if (error) {return response.send(500, error);}
        return response.send(200, teams);
    });
});

/**
 * @method
 * @summary Get team info in database
 *
 * @param request.teamId
 * @param response
 *
 * @returns 200 team
 * @throws 404 team not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/teams/:teamId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var team;
    team = request.team;

    response.header('Last-Modified', team.updatedAt);
    return response.send(200, team);
});

/**
 * @method
 * @summary Updates team info in database
 *
 * @param request.name
 * @param request.picture
 * @param response
 *
 * @returns 200 team
 * @throws 500 error
 * @throws 404 team not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/teams/:teamId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var team;
    team = request.team;
    team.name    = request.param('name');
    team.picture = request.param('picture');

    return team.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, team);
    });
});

/**
 * @method
 * @summary Removes team from database
 *
 * @param request.championshipId
 * @param response
 *
 * @returns 200 team
 * @throws 500 error
 * @throws 404 team not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/teams/:teamId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') {return response.send(401, 'invalid token');}

    var team;
    team = request.team;

    return team.remove(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, team);
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
 *
 * @returns team
 * @throws 404 team not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.param('teamId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Team.findOne();
    query.where('_id').equals(id);
    query.exec(function (error, team) {
        if (error) {return response.send(404, 'team not found');}
        if (!team) {return response.send(404, 'team not found');}

        request.team = team;
        return next();
    });
});

module.exports = router;