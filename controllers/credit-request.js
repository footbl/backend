/**
 * @module
 * Manages credit request resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, errorParser, CreditRequest, Wallet;

router        = require('express').Router();
nconf         = require('nconf');
errorParser   = require('../lib/error-parser');
CreditRequest = require('../models/credit-request');
Wallet        = require('../models/wallet');

/**
 * @method
 * @summary Creates a new credit request in database
 *
 * @param request
 * @param response
 *
 * @returns 201 comment
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/users/:userId/credit-requests', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session._id.toString() !== request.params.userId) { return response.send(401, 'invalid token'); }

    var creditRequest;
    creditRequest = new CreditRequest({
        'debtor'             : request.params.userId,
        'creditor'           : request.param('creditor'),
        'creditorFacebookId' : request.param('creditorFacebookId'),
        'creditorEmail'      : request.param('creditorFacebookId'),
        'value'              : request.param('value')
    });

    return creditRequest.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(201, creditRequest);
    });
});

/**
 * @method
 * @summary List all credit requests in database
 *
 * @param request.page
 * @param response
 *
 * @returns 200 [creditRequest]
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/:userId/credit-requests', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize;
    query    = CreditRequest.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.or([{
        'debtor' : request.params.userId
    }, {
        'creditor' : request.params.userId
    }]);
    query.populate('creditor');
    query.populate('debtor');
    query.skip(page);
    query.limit(pageSize);

    return query.exec(function (error, creditRequests) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, creditRequests);
    });
});


/**
 * @method
 * @summary Update credit request info in database
 *
 * @param request.userId
 * @param request.creditRequestId
 * @param request.payed
 * @param response
 *
 * @returns 200 creditRequest
 * @throws 404 creditRequest not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/users/:userId/credit-requests/:creditRequestId/pay', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var creditRequest;
    creditRequest = request.creditRequest;

    if (!request.session || request.session._id.toString() !== creditRequest.creditor._id.toString()) { return response.send(401, 'invalid token'); }
    if (creditRequest.payed) { return response.send(500); }

    creditRequest.payed = true;

    return creditRequest.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }

        var query;
        query = Wallet.findOne();
        query.where('user').equals(creditRequest.debtor._id);
        return query.exec(function (error, wallet) {
            if (error) { return response.send(500, errorParser(error)); }
            if (!wallet) { return response.send(500); }

            wallet.lastRecharge = new Date();
            return wallet.save(function (error) {
                if (error) { return response.send(500, errorParser(error)); }
                return response.send(200, creditRequest);
            });
        });
    });
});

/**
 * @method
 * @summary Puts requested credit request in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 *
 * @returns comment
 * @throws 404 creditRequest not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.param('creditRequestId', function (request, response, next, id) {
    'use strict';

    var query;
    query = CreditRequest.findOne();
    query.where('_id').equals(id);
    query.populate('creditor');
    query.populate('debtor');
    query.exec(function (error, creditRequest) {
        if (error) { return response.send(404, 'creditRequest not found'); }
        if (!creditRequest) { return response.send(404, 'creditRequest not found'); }

        request.creditRequest = creditRequest;
        return next();
    });
});

module.exports = router;