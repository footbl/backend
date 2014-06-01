/**
 * @module
 * Manages bet resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, errorParser, Wallet, Match, Team;

router      = require('express').Router();
nconf       = require('nconf');
errorParser = require('../lib/error-parser');
Wallet      = require('../models/wallet');
Match       = require('../models/match');
Team        = require('../models/team');

/**
 * @method
 * @summary Creates a new bet in database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.match
 * @param request.date
 * @param request.result
 * @param request.bid
 * @param response
 *
 * @returns 201 bet
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/championships/:championshipId/matches/:matchId/bets', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var wallet;
    wallet = request.wallet;

    if (!request.session || request.session._id.toString() !== wallet.user._id.toString()) { return response.send(401, 'invalid token'); }

    wallet.bets.push({
        'match'        : request.params.matchId,
        'date'         : request.param('date'),
        'result'       : request.param('result'),
        'bid'          : request.param('bid')
    });

    return wallet.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }

        var query;
        query = Match.findOne();
        query.where('_id').equals(request.params.matchId);
        query.populate('guest');
        query.populate('host');
        return query.exec(function (error, match) {
            if (error) { return response.send(500, errorParser(error)); }
            match.pot[request.param('result')] += request.param('bid');
            return match.save(function (error) {
                if (error) { return response.send(500, errorParser(error)); }

                var bet;
                bet = wallet.bets.pop();
                bet.match = match;
                response.header('Location', '/wallets/' + wallet._id + '/bets/' + bet._id);
                return response.send(201, bet);
            });
        });
    });
});

/**
 * @method
 * @summary List all bets in database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.page
 * @param response
 *
 * @returns 200 [bet]
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId/bets', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var page, pageSize, query;
    query     = Wallet.find();
    pageSize  = nconf.get('PAGE_SIZE');
    page      = request.param('page', 0) * pageSize;

    query.where('championship').equals(request.params.championshipId);
    query.populate('championship');
    query.populate('user');
    query.populate('bets.match');
    return query.exec(function (error, wallets) {
        if (error) { response.send(500, errorParser(error)); }

        var bets;
        bets = wallets.map(function (wallet) {
            return wallet.bets;
        }).reduce(function (bets, wallet) {
            return bets.concat(wallet);
        }, []).filter(function (bet) {
            return bet.match._id.toString() === request.params.matchId;
        });

        if (request.param('filterByFriends') === true) {
            bets = bets.filter(function (bet) {
                return request.session.starred.some(function (starred) {
                    return starred.toString() === bet.parent().user.toString();
                });
            });
        } else if (request.param('filterByFriends') === false) {
            bets = bets.filter(function (bet) {
                return request.session.starred.every(function (starred) {
                    return starred.toString() !== bet.parent().user.toString();
                });
            });
        }

        return response.send(200, bets.slice(page, page + pageSize));
    });
});

/**
 * @method
 * @summary Get bet info in database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.betId
 * @param response
 *
 * @returns 200 bet
 * @throws 404 bet not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId/bets/:betId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var wallet, bet;
    wallet = request.wallet;
    bet    = wallet.bets.id(request.params.betId);

    if (!bet) { return response.send(404, 'bet not found'); }
    response.header('Last-Modified', wallet.updatedAt);
    return response.send(200, bet);
});

/**
 * @method
 * @summary Updates bet in database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.betId
 * @param request.date
 * @param request.result
 * @param request.bid
 * @param response
 *
 * @returns 200 bet
 * @throws 500 error
 * @throws 404 bet not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId/bets/:betId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var wallet, bet, oldBid, oldResult;
    wallet    = request.wallet;
    bet       = wallet.bets.id(request.params.betId);
    oldBid    = bet.bid;
    oldResult = bet.result;

    if (!request.session || request.session._id.toString() !== wallet.user._id.toString()) { return response.send(401, 'invalid token'); }
    if (!bet) { return response.send(404, 'bet not found'); }

    bet.date   = request.param('date');
    bet.result = request.param('result');
    bet.bid    = request.param('bid');

    return wallet.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }

        var query;
        query = Match.findOne();
        query.where('_id').equals(request.params.matchId);
        query.populate('guest');
        query.populate('host');
        return query.exec(function (error, match) {
            if (error) { return response.send(500, errorParser(error)); }

            match.pot[oldResult]               -= oldBid;
            match.pot[request.param('result')] += request.param('bid');
            return match.save(function (error) {
                if (error) { return response.send(500, errorParser(error)); }

                bet.match = match;
                return response.send(200, bet);
            });
        });
    });
});

/**
 * @method
 * @summary Removes bet from database
 *
 * @param request.championshipId
 * @param request.matchId
 * @param request.betId
 * @param response
 *
 * @returns 200 bet
 * @throws 500 error
 * @throws 404 bet not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/championships/:championshipId/matches/:matchId/bets/:betId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var wallet, bet, oldBid, oldResult;
    wallet = request.wallet;
    bet    = wallet.bets.id(request.params.betId);

    if (!request.session || request.session._id.toString() !== wallet.user._id.toString()) { return response.send(401, 'invalid token'); }
    if (!bet) { return response.send(404, 'bet not found'); }

    oldBid    = bet.bid;
    oldResult = bet.result;

    return bet.remove(function (error) {
        if (error) { return response.send(500, errorParser(error)); }

        return wallet.save(function (error) {
            if (error) { return response.send(500, errorParser(error)); }

            var query;
            query = Match.findOne();
            query.where('_id').equals(request.params.matchId);
            query.populate('guest');
            query.populate('host');
            return query.exec(function (error, match) {
                if (error) { return response.send(500, errorParser(error)); }

                match.pot[oldResult] -= oldBid;
                return match.save(function (error) {
                    if (error) { return response.send(500, errorParser(error)); }

                    bet.match = match;
                    return response.send(200, bet);
                });
            });
        });
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
 * @returns wallet
 * @throws 404 wallet not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.param('championshipId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Wallet.findOne();
    query.where('championship').equals(id);
    if (request.session) {
        query.where('user').equals(request.session._id);
    }
    query.populate('championship');
    query.populate('user');
    query.populate('bets.match');
    query.exec(function (error, wallet) {
        if (error) { return response.send(404, 'wallet not found'); }
        if (!wallet) { return response.send(404, 'wallet not found'); }
        return Team.populate(wallet, 'bets.match.host bets.match.guest',  function (error, wallet) {
            if (error) { return response.send(404, 'wallet not found'); }
            if (!wallet) { return response.send(404, 'wallet not found'); }

            request.wallet = wallet;
            return next();
        });
    });
});

module.exports = router;