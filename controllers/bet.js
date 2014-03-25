/**
 * @module
 * Manages bet resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, Bet;

router = require('express').Router();
nconf  = require('nconf');
Bet    = require('../models/bet');

/**
 * @method
 * @summary Creates a new bet in database
 *
 * @param request.user
 * @param request.matchId
 * @param request.date
 * @param request.result
 * @param request.bid
 * @param response
 *
 * @returns 201 bet
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/championships/:championshipId/matches/:matchId/bets', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

    var bet;
    bet = new Bet({
        'user'   : request.session._id,
        'match'  : request.params.matchId,
        'date'   : request.param('date'),
        'result' : request.param('result'),
        'bid'    : request.param('bid')
    });

    return bet.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(201, bet);
    });
});

/**
 * @method
 * @summary List all bets in database
 *
 * @param request.matchId
 * @param response
 *
 * @returns 200 [bet]
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId/bets', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

    var query, page, pageSize;
    query    = Bet.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.where('match').equals(request.params.matchId);
    query.populate('match');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, bets) {
        if (error) {return response.send(500, error);}
        return response.send(200, bets);
    });
});

/**
 * @method
 * @summary Get bet info in database
 *
 * @param request.betId
 * @param response
 *
 * @returns 200 bet
 * @throws 404 bet not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId/bets/:betId', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

    var bet;
    bet = request.bet;

    return response.send(200, bet);
});

/**
 * @method
 * @summary Updates bet info in database
 *
 * @param request.betId
 * @param request.date
 * @param request.result
 * @param request.bid
 * @param response
 *
 * @returns 200 bet
 * @throws 500 error
 * @throws 404 bet not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId/bets/:betId', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

    var bet;
    bet = request.bet;
    bet.date   = request.param('date');
    bet.result = request.param('result');
    bet.bid    = request.param('bid');

    return bet.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, bet);
    });
});

/**
 * @method
 * @summary Removes bet from database
 *
 * @param request.betId
 * @param response
 *
 * @returns 200 bet
 * @throws 500 error
 * @throws 404 bet not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/championships/:championshipId/matches/:matchId/bets/:betId', function (request, response) {
    'use strict';
    if (!request.session) {return response.send(401, 'invalid token');}

    var bet;
    bet = request.bet;

    return bet.remove(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, bet);
    });
});

/**
 * @method
 * @summary Puts requested bet in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 *
 * @returns bet
 * @throws 404 bet not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.param('betId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Bet.findOne();
    query.where('_id').equals(id);
    query.where('match').equals(request.params.matchId);
    query.populate('match');
    query.populate('user');
    query.exec(function (error, bet) {
        if (error) {return response.send(404, 'bet not found');}
        if (!bet) {return response.send(404, 'bet not found');}

        request.bet = bet;
        return next();
    });
});

module.exports = router;