/**
 * @module
 * @summary Security and authentication module
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
var crypto, nconf, graph, redis, url,
    secondsInOneHour, milisecondsInOneHour, uri, client, User;

redis  = require('redis');
url    = require('url');
crypto = require('crypto');
nconf  = require('nconf');
graph  = require('fbgraph');
User   = require('../models/user');

secondsInOneHour     = 60 * 60;
milisecondsInOneHour = secondsInOneHour * 1000;

if (nconf.get('REDISCLOUD_URL')) {
    uri = url.parse(nconf.get('REDISCLOUD_URL'));
    client = redis.createClient(uri.port, uri.hostname);

    if (uri.auth) { client.auth(uri.auth.split(':')[1]); }
} else {
    client = redis.createClient();
}

/**
 * @method
 * @summary Generates valid signature
 * The timestamp, the transactionId and a provided key should be concatenated in this order and a sha1 should be
 * generated and digested to hex to generate the signature.
 *
 * @param [timestamp]
 * @param [transactionId]
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
exports.credentials = function (timestamp, transactionId) {
    'use strict';

    var key;

    timestamp     = timestamp     || new Date().getTime();
    transactionId = transactionId || crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex');
    key           = nconf.get('KEY');

    return {
        timestamp     : timestamp,
        transactionId : transactionId,
        signature     : crypto.createHash('sha1').update(timestamp + transactionId + key).digest('hex')
    };
};

/**
 * @method
 * @summary Checks if the signature is valid.
 * To check the signature, every API call should receive a timestamp, a transactionId and a signature. The timestamp
 * should be created at the moment of the request, and is used to check if the signature is old. A random number,
 * transactionId, should be created as well and this number can be used only once in the next hour to ensure the
 * uniqueness of the transaction.
 *
 * @param request
 * @param request.signature
 * @param request.timestamp
 * @param request.transactionId
 * @param response
 * @param next
 *
 * @throws 403 invalid timestamp,
 * @throws 403 invalid transactionId,
 * @throws 403 invalid signature
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
exports.signature = function () {
    'use strict';

    return function (request, response, next) {
        var timestamp, transactionId, signature, validSignature, now;
        now            = new Date().getTime();
        signature      = request.get('auth-signature');
        timestamp      = request.get('auth-timestamp');
        transactionId  = request.get('auth-transactionId');
        validSignature = exports.credentials(timestamp, transactionId).signature;

        client.get(transactionId, function (error, used) {
            if (error) { return response.send(500, error); }
            if (used) { return response.send(401, 'invalid transactionId'); }
            if (now - timestamp > milisecondsInOneHour) { return response.send(401, 'invalid timestamp'); }
            if (signature !== validSignature) { return response.send(401, 'invalid signature'); }

            if (request.method !== 'OPTIONS') {
                client.set(transactionId, timestamp);
                client.expire(transactionId, secondsInOneHour);
            }
            return next();
        });
    };
};

/**
 * @method
 * @summary Generates a new access token
 *
 * @param user
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
exports.token = function (user) {
    'use strict';

    var token, timestamp, key;

    timestamp = new Date().getTime();
    key       = nconf.get('TOKEN_SALT');
    token     = crypto.createHash('sha1').update(timestamp + user._id + key).digest('hex');

    client.set(token, user._id);
    client.expire(token, secondsInOneHour);

    return token;
};

/**
 * @method
 * @summary Checks if the session token is valid
 * To check the access token, an API call should receive a token, this access token was generated in the login and
 * stored in the redis for one hour. During this period this access token can be used to call the API for restricted
 * methods.
 *
 * @param request
 * @param response
 * @param next
 *
 * @throws 401 invalid token,
 * @throws 401 invalid userId
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
exports.session = function (type) {
    'use strict';

    return function (request, response, next) {
        var token;
        token = request.get('auth-token');

        return client.get(token, function (error, id) {
            if (error) { return response.send(500, error); }
            if (!id) { return response.send(401); }
            return User.findById(id, function (error, user) {
                if (error) { return response.send(500, error); }
                if (!user) { return response.send(401); }
                if (type && type !== user.type) { response.send(401); }
                request.session = user;
                return next();
            });
        });
    };
};

/**
 * @method
 * @summary Checks facebook token
 * If the client sends a facebook token, this function should check if the given access token is valid. If no valid
 * facebook id was found or an error raised, the system must go to the next middleware and ignore the error.
 *
 * @param request
 * @param response
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
exports.facebook = function (request, response, next) {
    'use strict';

    var token;
    token = request.get('facebook-token');
    if (!token) { return next(); }

    return graph.get('/me?access_token=' + token, function (error, data) {
        if (!error && data && data.id) { request.facebook = data.id; }
        next();
    });
};