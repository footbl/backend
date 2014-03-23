/**
 * @module
 * Manages users resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, User;

router = require('express').Router();
router.use(require('../lib/auth').session);

nconf  = require('nconf');
User   = require('../models/user');

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
router.get('/', function (request, response) {
    'use strict';

    var query, page, pageSize;
    query    = User.find();
    pageSize = nconf.get('page-size');
    page     = request.param('page', 0) * pageSize;

    if (request.param('emails'))    {query.where('email').in(request.param('emails'));}
    if (request.param('usernames')) {query.where('username').in(request.param('usernames'));}
    if (request.param('ids'))       {query.where('_id').in(request.param('ids'));}

    query.skip(page);
    query.limit(pageSize);
    query.exec(function (error, users) {
        if (error) {response.send(500, error);}
        response.send(200, users);
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
router.get('/:userId', function (request, response) {
    'use strict';

    var user;
    user = request.user;

    response.send(200, user);
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
router.put('/:userId', function (request, response) {
    'use strict';

    var user;
    user = request.user;
    user.email    = request.param('email');
    user.username = request.param('username');
    user.password = request.param('password');
    user.picture  = request.param('picture');

    user.save(function (error) {
        if (error) {response.send(500, error);}
        response.send(200, user);
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

    User.findById(id, function (error, user) {
        if (error || !user) {return response.send(404, 'user not found');}

        request.user = user;
        return next();
    });
});

module.exports = router;