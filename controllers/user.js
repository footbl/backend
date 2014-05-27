/**
 * @module
 * Manages users resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, errorParser, crypto, geo, auth, User;

router      = require('express').Router();
auth        = require('../lib/auth');
nconf       = require('nconf');
errorParser = require('../lib/error-parser');
crypto      = require('crypto');
geo         = require('geoip-lite');
User        = require('../models/user');

/**
 * @method
 * @summary Creates a new user in database
 * Every user is created as a anonymous user in the database, and the only initial information of the user is _id
 * generated by the database and password. If is a anonymous login, the client should keep the userId and generate a
 * password for future login.
 *
 * @param request.password
 * @param response
 *
 * @returns 201 user
 * @throws 500 error
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/users', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var user, geoip;

    geoip = geo.lookup(request.ip);
    user  = new User({
        'password' : request.param('password') ? crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex') : null,
        'country'  : geoip ? geoip.country : null
    });

    return user.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        response.header('Location', '/users/' + user._id);
        return response.send(201, user);
    });
});

/**
 * @method
 * @summary List all users in database
 * To search users in the database, three attributes can be used to filter the results, email, username and id, each
 * filter parameter is added as a OR clause. Each of the filter parameters have to be send as a array of possible values
 * and if no filter parameter is passed, all users in database will be returned. All results are paginated and the page
 * size is 20 elements for each call.
 *
 * @param request.emails
 * @param request.usernames
 * @param request.ids
 * @param request.facebookIds
 * @param request.page
 * @param response
 *
 * @returns 200 [user]
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize;
    query    = User.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    if (request.param('emails')) {
        query.where('email').in(request.param('emails', []));
    } else if (request.param('usernames')) {
        query.where('username').in(request.param('usernames', []));
    } else if (request.param('facebookIds')) {
        query.where('facebookId').in(request.param('facebookIds', []));
    } else if (request.param('ids')) {
        query.where('_id').in(request.param('ids', []));
    }

    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, users) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, users);
    });
});

/**
 * @method
 * @summary Get user info in database
 *
 * @param request.userId
 * @param response
 *
 * @returns 200 user
 * @throws 404 user not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/:userId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var user;
    user = request.user;

    response.header('Last-Modified', user.updatedAt);
    return response.send(200, user);
});

/**
 * @method
 * @summary Updates user info in database
 * When updating user data if the attributes aren't defined in the request body, the old values will be lost. The
 * password will be encrypted with sha1 and digested into hex with a predefined salt.
 *
 * @param request.userId
 * @param request.email
 * @param request.username
 * @param request.name
 * @param request.about
 * @param request.password
 * @param request.picture
 * @param request.language
 * @param request.country
 * @param request.notifications
 * @param request.apnsToken
 * @param response
 *
 * @returns 200 user
 * @throws 500 error
 * @throws 404 user not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/users/:userId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session._id.toString() !== request.params.userId) { return response.send(401, 'invalid token'); }

    var user;
    user = request.user;
    user.email         = request.param('email');
    user.username      = request.param('username');
    user.name          = request.param('name');
    user.about         = request.param('about');
    user.picture       = request.param('picture');
    user.language      = request.param('language');
    user.country       = request.param('country', 'BR');
    user.notifications = request.param('notifications');
    user.apnsToken     = request.param('apnsToken');
    if (request.param('password')) {
        user.password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
    }
    if (request.facebook) {
        user.facebookId    = request.facebook;
    }

    return user.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, user);
    });
});

/**
 * @method
 * @summary Login user
 * There are three forms of login, anonymous user login, registered user login and registered facebook user login. If is
 * an anonymous user login the API call should contain the _id and password of the user, if is a registered user login
 * the API call should contain the email and the password of the user and if is facebook registered user the api call
 * should contain the facebook token wich will be converted into facebook id.
 *
 * @param request
 * @param request.password
 * @param request.email
 * @param request._id
 * @param response
 *
 * @returns 200 token
 * @throws 403 invalid username or password
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/me/session', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    var query, facebook, password, email, _id;
    facebook = request.facebook;
    email    = request.param('email');
    _id      = request.param('_id');
    password = request.param('password') ? crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex') : null;

    query    = User.findOne();

    if (request.facebook) {
        query.where('facebookId').equals(facebook);
    } else if (email) {
        query.where('email').equals(email);
        query.where('password').equals(password);
    } else {
        query.where('_id').equals(_id);
        query.where('password').equals(password);
    }
    return query.exec(function (error, user) {
        if (error) { return response.send(500, errorParser(error)); }
        if (!user) { return response.send(403, 'invalid username or password'); }
        return response.send(200, {token : auth.token(user), _id : user._id});
    });
});

/**
 * @method
 * @summary Creates a new starred in user
 *
 * @param request.userId
 * @param request.user
 * @param response
 *
 * @returns 201 user
 * @throws 500 error
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/users/:userId/starred', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session._id.toString() !== request.params.userId) { return response.send(401, 'invalid token'); }

    var user;
    user = request.user;
    user.starred.push(request.param('user'));

    return user.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(201, user);
    });
});

/**
 * @method
 * @summary Get user starred in database
 *
 * @param request.userId
 * @param response
 *
 * @returns 200 [starred]
 * @throws 404 user not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/:userId/starred', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var user;
    user = request.user;

    return response.send(200, user.starred);
});

/**
 * @method
 * @summary Removes a starred from user
 *
 * @param request.starredId
 * @param request.userId
 * @param response
 *
 * @returns 200 user
 * @throws 500 error
 * @throws 404 user not found
 * @throws 404 starred not found
 * @throws 401 invalid token
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/users/:userId/starred/:starredId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (!request.session || request.session._id.toString() !== request.params.userId) { return response.send(401, 'invalid token'); }

    var user, starred;
    user    = request.user;
    starred = user.starred.filter(function (user) {
        return user._id.toString() === request.params.starredId;
    }).pop();

    if (!starred) { return response.send(404, 'starred not found'); }

    user.starred = user.starred.filter(function (user) {
        return user._id.toString() !== request.params.starredId;
    });

    return user.save(function (error) {
        if (error) { return response.send(500, errorParser(error)); }
        return response.send(200, user);
    });
});

/**
 * @method
 * @summary Puts requested user in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 *
 * @returns user
 * @throws 404 user not found
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
router.param('userId', function (request, response, next, id) {
    'use strict';

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query;
    query = User.findOne();
    query.where('_id').equals(id);
    query.populate('starred');
    return query.exec(function (error, user) {
        if (error) { return response.send(404, 'user not found'); }
        if (!user) { return response.send(404, 'user not found'); }

        request.user = user;
        return next();
    });
});

module.exports = router;