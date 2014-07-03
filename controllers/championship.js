/**
 * @module
 * Manages championship resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, errorParser, Championship, Wallet;

router       = require('express').Router();
nconf        = require('nconf');
errorParser  = require('../lib/error-parser');
Championship = require('../models/championship');
Wallet       = require('../models/wallet');

/**
 * @method
 * @summary Creates a new championship in database
 *
 * @param request.name
 * @param request.picture
 * @param request.edition
 * @param request.type
 * @param request.country
 * @param response
 *
 * @returns 201 championship
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/championships', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var championship;
    championship = new Championship({
        'name'        : request.param('name'),
        'picture'     : request.param('picture'),
        'edition'     : request.param('edition'),
        'type'        : request.param('type', 'national league'),
        'country'     : request.param('country')
    });

    return championship.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        response.header('Location', '/championships/' + championship._id);
        return response.send(201, championship);
    });
});

/**
 * @method
 * @summary List all championships in database
 *
 * @param request.page
 * @param response
 *
 * @returns 200 [championship]
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize;
    query    = Championship.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.populate('competitors');
    query.populate('matches');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, championships) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, championships);
    });
});

/**
 * @method
 * @summary Get championship info in database
 *
 * @param request.championshipId
 * @param response
 *
 * @returns 200 championship
 * @throws 401 invalid token
 * @throws 404 championship not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var championship;
    championship = request.championship;

    response.header('Last-Modified', championship.updatedAt);
    return response.send(200, championship);
});

/**
 * @method
 * @summary Updates championship info in database
 *
 * @param request.championshipId
 * @param request.name
 * @param request.picture
 * @param request.edition
 * @param request.type
 * @param request.country
 * @param response
 *
 * @returns 200 championship
 * @throws 500 error
 * @throws 401 invalid token
 * @throws 404 championship not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var championship;
    championship = request.championship;
    championship.name        = request.param('name');
    championship.picture     = request.param('picture');
    championship.year        = request.param('year');
    championship.competitors = request.param('competitors');
    championship.type        = request.param('type', 'national league');
    championship.country     = request.param('country');

    return championship.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, championship);
    });
});

/**
 * @method
 * @summary Removes championship from database
 *
 * @param request.championshipId
 * @param response
 *
 * @returns 200 championship
 * @throws 500 error
 * @throws 401 invalid token
 * @throws 404 championship not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/championships/:championshipId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session.type !== 'admin') { return response.send(401, 'invalid token'); }

    var championship;
    championship = request.championship;

    return championship.remove(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, championship);
    });
});

/**
 * @method
 * @summary List championship wallets ordered by ranking
 *
 * @param request.championshipId
 * @param response
 *
 * @returns 200 championship
 * @throws 500 error
 * @throws 401 invalid token
 * @throws 404 championship not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/ranking', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize, championship, round;
    query        = Wallet.find();
    pageSize     = nconf.get('PAGE_SIZE');
    page         = request.param('page', 0) * pageSize;
    championship = request.championship;
    round        = championship.currentRound;

    query.where('championship').equals(championship._id);
    query.exists('-ranking.' + round + '.ranking');
    query.populate('user');
    query.sort('-ranking.' + round + '.ranking');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, wallets) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, wallets);
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
 *
 * @returns championship
 * @throws 404 championship not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.param('championshipId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Championship.findOne();
    query.where('_id').equals(id);
    query.populate('competitors');
    query.populate('matches');
    query.exec(function (error, championship) {
        if (error) { return response.send(404, 'championship not found'); }
        if (!championship) { return response.send(404, 'championship not found'); }

        request.championship = championship;
        return next();
    });
});

module.exports = router;