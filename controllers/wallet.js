/**
 * @module
 * Manages wallet resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, iap, Wallet;

router = require('express').Router();
nconf  = require('nconf');
iap    = require('iap');
Wallet = require('../models/wallet');

/**
 * @method
 * @summary Creates a new wallet in database
 *
 * @param request.championship
 * @param request.notifications
 * @param request.notifications.roundStart
 * @param request.notifications.roundEnd
 * @param request.priority
 * @param response
 *
 * @returns 201 wallet
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/wallets', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var wallet;
    wallet = new Wallet({
        'championship'  : request.param('championship'),
        'user'          : request.session._id,
        'notifications' : request.param('notifications'),
        'priority'      : request.param('priority')
    });

    return wallet.save(function (error) {
        if (error) { return response.send(500, error); }
        response.header('Location', '/wallets/' + wallet._id);
        return response.send(201, wallet);
    });
});

/**
 * @method
 * @summary List all wallets in database
 *
 * @param request.page
 * @param response
 *
 * @returns 200 [wallet]
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/wallets', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize;
    query    = Wallet.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.where('user').equals(request.session._id);
    query.populate('championship');
    query.populate('user');
    query.populate('bets.match');
    query.sort({'priority' : 1});
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, wallets) {
        if (error) { return response.send(500, error); }
        return response.send(200, wallets);
    });
});

/**
 * @method
 * @summary Get wallet info in database
 *
 * @param request.walletId
 * @param response
 *
 * @returns 200 wallet
 * @throws 401 invalid token
 * @throws 404 wallet not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/wallets/:walletId', function (request, response) {
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

    response.header('Last-Modified', wallet.updatedAt);
    console.log(wallet);
    return response.send(200, wallet);
});

/**
 * @method
 * @summary Updates wallet info in database
 *
 * @param request.walletId
 * @param request.active
 * @param request.notifications
 * @param request.priority
 * @param response
 *
 * @returns 200 wallet
 * @throws 500 error
 * @throws 401 invalid token
 * @throws 404 wallet not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/wallets/:walletId', function (request, response) {
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

    wallet.active        = request.param('active');
    wallet.notifications = request.param('notifications');
    wallet.priority      = request.param('priority');

    return wallet.save(function (error) {
        if (error) { return response.send(500, error); }
        return response.send(200, wallet);
    });
});

/**
 * @method
 * @summary Sets wallet value to 100
 *
 * @param request.walletId
 * @param request.platform
 * @param request.receipt
 * @param request.productId
 * @param request.packageName
 * @param response
 *
 * @returns 200 wallet
 * @throws 500 error
 * @throws 401 invalid token
 * @throws 404 wallet not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/wallets/:walletId/recharge', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var wallet;
    wallet   = request.wallet;

    if (!request.session || request.session._id.toString() !== wallet.user._id.toString()) { return response.send(401, 'invalid token'); }

    return iap.verifyPayment(request.param('platform'), {
        'receipt'     : request.param('receipt'),
        'productId'   : request.param('productId'),
        'packageName' : request.param('packageName')
    }, function (error, response) {
        if (error) { return response.send(500, error); }
        if (!response.receipt) { return response.send(500, new Error('invalid purchase')); }

        wallet.iaps.push({
            'platform'    : request.param('platform'),
            'productId'   : request.param('productId'),
            'receipt'     : request.param('receipt'),
            'packageName' : request.param('packageName'),
            'date'        : new Date(response.receipt.purchase_date_ms)
        });

        return wallet.save(function (error) {
            if (error) { return response.send(500, error); }
            return response.send(200, wallet);
        });
    });
});

/**
 * @method
 * @summary Removes wallet from database
 *
 * @param request.walletId
 * @param response
 *
 * @returns 200 wallet
 * @throws 500 error
 * @throws 401 invalid token
 * @throws 404 wallet not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/wallets/:walletId', function (request, response) {
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

    return wallet.remove(function (error) {
        if (error) { return response.send(500, error); }
        return response.send(200, wallet);
    });
});

/**
 * @method
 * @summary Get all wallets bets
 *
 * @param request.walletId
 * @param response
 *
 * @returns 200 [bet]
 * @throws 401 invalid token
 * @throws 404 wallet not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/wallets/:walletId/bets', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var wallet;
    wallet = request.wallet;

    if (!request.session) { return response.send(401, 'invalid token'); }

    response.header('Last-Modified', wallet.updatedAt);
    return response.send(200, wallet.bets);
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
router.param('walletId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Wallet.findOne();
    query.where('_id').equals(id);
    query.populate('championship');
    query.populate('user');
    query.populate('bets.match');
    query.exec(function (error, wallet) {
        if (error) { return response.send(404, 'wallet not found'); }
        if (!wallet) { return response.send(404, 'wallet not found'); }

        request.wallet = wallet;
        return next();
    });
});

module.exports = router;