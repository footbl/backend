/**
 * @module
 * Manages users resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, auth, User;

router = require('express').Router();
auth   = require('../lib/auth');
nconf  = require('nconf');
User   = require('../models/user');

/**
 * @method
 * @summary Creates a new user in database
 * Every user is created as a anonymous user in the database, and the only initial information of the user is _id
 * generated by the database and password. If is a anonymous login, the client should keep the userId and generate a
 * password for future login.
 *
 * @param request
 * @param request.password
 * @param response
 *
 * @returns 201 user
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/users', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    var user;

    user = new User({
        'password' : request.param('password')
    });

    return user.save(function (error) {
        if (error) {return response.send(500, error);}
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
 * @param response
 *
 * @returns 200 [user]
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var query, page, pageSize;
    query    = User.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    if (request.param('emails'))    {query.where('email').in(request.param('emails'));}
    if (request.param('usernames')) {query.where('username').in(request.param('usernames'));}
    if (request.param('ids'))       {query.where('_id').in(request.param('ids'));}

    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, users) {
        if (error) {return response.send(500, error);}
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
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/:userId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var user;
    user = request.user;

    response.header('Last-Modified', user.updatedAt);
    return response.send(200, user);
});

/**
 * @method
 * @summary Get user bets in database
 *
 * @param request.userId
 * @param response
 *
 * @returns 200 [bets]
 * @throws 404 user not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/:userId/bets', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var user;
    user = request.user;

    return response.send(200, user.bets);
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
 * @param request.password
 * @param request.picture
 * @param response
 *
 * @returns 200 user
 * @throws 500 error
 * @throws 404 user not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/users/:userId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var user;
    user = request.user;
    user.email    = request.param('email');
    user.username = request.param('username');
    user.password = request.param('password');
    user.picture  = request.param('picture');
    user.language = request.param('language');

    return user.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, user);
    });
});

/**
 * @method
 * @summary Login user
 * There are two forms of login, anonymous user login and registered user login. If is an anonymous user login the API
 * call should contain the _id and password of the user, and if is a registered user login the API call should contain
 * the email and the password of the user.
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
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/users/me/session', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    var query, password, email, _id;
    email    = request.param('email');
    _id      = request.param('_id');
    password = request.param('password');
    query    = User.findByPassword(password);

    if (email) {
        query.where('email').equals(email);
    } else {
        query.where('_id').equals(_id);
    }
    return query.exec(function (error, user) {
        if (error) {return response.send(500, error);}
        if (!user) {return response.send(403, 'invalid username or password');}
        return response.send(200, {token : auth.token(user), _id : user._id});
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
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.param('userId', function (request, response, next, id) {
    'use strict';

    if (!request.session) {return response.send(401, 'invalid token');}

    var query;
    query = User.findOne();
    query.where('_id').equals(id);
    query.populate('bets');
    return query.exec(function (error, user) {
        if (error) {return response.send(404, 'user not found');}
        if (!user) {return response.send(404, 'user not found');}

        request.user = user;
        return next();
    });
});

module.exports = router;