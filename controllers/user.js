/**
 * @apiDefineStructure userParams
 * @apiParam {String} [email] User email
 * @apiParam {String} [username] User username
 * @apiParam {String} password User password
 * @apiParam {String} [name] User name
 * @apiParam {String} [about] User about
 * @apiParam {String} [picture] User picture
 * @apiParam {String} [apnsToken] User apnsToken
 */
/**
 * @apiDefineStructure userSuccess
 * @apiSuccess {String} slug User identifier
 * @apiSuccess {String} email User email
 * @apiSuccess {String} username User username
 * @apiSuccess {String} name User name
 * @apiSuccess {String} about User about
 * @apiSuccess {Boolean} verified User verified
 * @apiSuccess {Boolean} featured User featured
 * @apiSuccess {String} picture User picture
 * @apiSuccess {String} apnsToken User apnsToken
 * @apiSuccess {Number} ranking User current ranking
 * @apiSuccess {Number} previousRanking User previous ranking
 * @apiSuccess {Number} funds User funds
 * @apiSuccess {Number} stake User stake
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 *
 * @apiSuccess (history) {Date} date Date of history creation
 * @apiSuccess (history) {Number} funds Funds in history
 */
var VError, router, nconf, slug, crypto, auth, errorParser, User;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
crypto = require('crypto');
auth = require('../lib/auth');
errorParser = require('../lib/error-parser');
User = require('../models/user');

/**
 * @method
 * @summary Setups default headers
 *
 * @param request
 * @param response
 * @param next
 */
router.use(function (request, response, next) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', request.get('Access-Control-Request-Method'));
    response.header('Access-Control-Allow-Headers', request.get('Access-Control-Request-Headers'));
    next();
});

/**
 * @api {post} /users Creates a new user.
 * @apiName createUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * Creates a new user.
 *
 * @apiStructure userParams
 * @apiStructure userSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "password": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "vandoren",
 *       "email": "vandoren@vandoren.com",
 *       "username": "vandoren",
 *       "name": "Van Doren",
 *       "about": "footbl fan",
 *       "verified": false,
 *       "featured": false,
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "ranking": "2",
 *       "previousRanking": "1",
 *       "history": [{
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "funds": 100
 *       },{
 *         "date": "2014-07-03T12:22:25.058Z",
 *         "funds": 120
 *       }],
 *       "funds": 100,
 *       "stake": 0,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users')
.post(auth.facebook())
.post(function createUser(request, response, next) {
    'use strict';

    var user, password;

    password = !request.param('password') ? null : crypto
    .createHash('sha1')
    .update(request.param('password') + nconf.get('PASSWORD_SALT'))
    .digest('hex');

    user = new User({
        'slug'       : slug(request.param('name', 'me')),
        'email'      : request.param('email'),
        'username'   : request.param('username'),
        'name'       : request.param('name'),
        'facebookId' : request.facebook,
        'about'      : request.param('about'),
        'password'   : password,
        'picture'    : request.param('picture'),
        'language'   : request.param('language'),
        'apnsToken'  : request.param('apnsToken')
    });

    return user.save(function createdUser(error) {
        if (error) {
            error = new VError(error, 'error creating user');
            return next(error);
        }
        response.header('Location', '/users/' + user.slug);
        response.header('Last-Modified', user.updatedAt);
        return response.send(201, user);
    });
});

/**
 * @api {get} /users List all users
 * @apiName listUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * List all users.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Array} [emails] Emails to search.
 * @apiParam {Array} [usernames] Usernames to search.
 * @apiParam {Array} [page] .
 * @apiStructure userSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "email": "vandoren@vandoren.com",
 *       "username": "vandoren",
 *       "name": "Van Doren",
 *       "about": "footbl fan",
 *       "verified": false,
 *       "featured": false,
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "ranking": "2",
 *       "previousRanking": "1",
 *       "history": [{
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "funds": 100
 *       },{
 *         "date": "2014-07-03T12:22:25.058Z",
 *         "funds": 120
 *       }],
 *       "funds": 100,
 *       "stake": 0,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users')
.get(auth.signature())
.get(function listUser(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = User.find();
    query.skip(page);
    query.limit(pageSize);
    if (request.param('emails') && request.param('facebookIds')) {
        query.where('email').or([
            { 'email' : {'$in' : request.param('emails', [])} },
            { 'facebookId' : {'$in' : request.param('facebookIds', [])} }
        ]);
    } else if (request.param('emails')) {
        query.where('email').in(request.param('emails', []));
    } else if (request.param('facebookIds')) {
        query.where('facebookId').in(request.param('facebookIds', []));
    } else if (request.param('featured')) {
        query.where('featured').equals(true);
    }
    return query.exec(function listedUser(error, users) {
        if (error) {
            error = new VError(error, 'error finding users');
            return next(error);
        }
        return response.send(200, users);
    });
});
router
.route('/users/search')
.post(auth.signature())
.post(function listUser(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = User.find();
    query.skip(page);
    query.limit(pageSize);
    if (request.param('emails') && request.param('facebookIds')) {
        query.where('email').or([
            { 'email' : {'$in' : request.param('emails', [])} },
            { 'facebookId' : {'$in' : request.param('facebookIds', [])} }
        ]);
    } else if (request.param('emails')) {
        query.where('email').in(request.param('emails', []));
    } else if (request.param('facebookIds')) {
        query.where('facebookId').in(request.param('facebookIds', []));
    } else if (request.param('featured')) {
        query.where('featured').equals(true);
    }
    return query.exec(function listedUser(error, users) {
        if (error) {
            error = new VError(error, 'error finding users');
            return next(error);
        }
        return response.send(200, users);
    });
});

/**
 * @api {get} /users/:id Get user info
 * @apiName getUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * Get user info.
 *
 * @apiStructure userSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "email": "vandoren@vandoren.com",
 *       "username": "vandoren",
 *       "name": "Van Doren",
 *       "about": "footbl fan",
 *       "verified": false,
 *       "featured": false,
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "ranking": "2",
 *       "previousRanking": "1",
 *       "history": [{
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "funds": 100
 *       },{
 *         "date": "2014-07-03T12:22:25.058Z",
 *         "funds": 120
 *       }],
 *       "funds": 100,
 *       "stake": 0,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:id')
.get(auth.signature())
.get(auth.session())
.get(errorParser.notFound('user'))
.get(function getUser(request, response) {
    'use strict';

    var user;
    user = request.user;
    response.header('Last-Modified', user.updatedAt);
    return response.send(200, user);
});

/**
 * @api {put} /users/:id Updates user info
 * @apiName updateUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * Updates user info.
 *
 * @apiStructure userParams
 * @apiStructure userSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "password": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "email": "vandoren@vandoren.com",
 *       "username": "vandoren",
 *       "name": "Van Doren",
 *       "about": "footbl fan",
 *       "verified": false,
 *       "featured": false,
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "ranking": "2",
 *       "previousRanking": "1",
 *       "history": [{
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "funds": 100
 *       },{
 *         "date": "2014-07-03T12:22:25.058Z",
 *         "funds": 120
 *       }],
 *       "funds": 100,
 *       "stake": 0,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:id')
.put(auth.signature())
.put(auth.session())
.put(auth.facebook())
.put(errorParser.notFound('user'))
.put(function validateUpdateUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (user._id.toString() !== request.session._id.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }
    return next();
})
.put(function updateUser(request, response, next) {
    'use strict';

    var user, password;

    password = !request.param('password') ? null : crypto
    .createHash('sha1')
    .update(request.param('password') + nconf.get('PASSWORD_SALT'))
    .digest('hex');

    user = request.user;
    user.slug = slug(request.param('name', 'me'));
    user.email = request.param('email');
    user.username = request.param('username');
    user.name = request.param('name');
    user.facebookId = request.facebook ? request.facebook : user.facebookId;
    user.about = request.param('about');
    user.password = request.param('password') ? password : user.password;
    user.picture = request.param('picture');
    user.language = request.param('language');
    user.apnsToken = request.param('apnsToken');

    return user.save(function updatedUser(error) {
        if (error) {
            error = new VError(error, 'error updating user');
            return next(error);
        }
        response.header('Last-Modified', user.updatedAt);
        return response.send(200, user);
    });
});

/**
 * @api {delete} /users/:id Removes user 
 * @apiName removeUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * Removes user 
 */
router
.route('/users/:id')
.delete(auth.signature())
.delete(auth.session())
.delete(errorParser.notFound('user'))
.delete(function validateRemoveUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (user._id.toString() !== request.session._id.toString()) {
        response.header('Allow', 'GET');
        return response.send(405);
    }
    return next();
})
.delete(function removeUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    return user.remove(function removedUser(error) {
        if (error) {
            error = new VError(error, 'error removing user: "$s"', request.params.id);
            return next(error);
        }
        response.header('Last-Modified', user.updatedAt);
        return response.send(204);
    });
});

/**
 * @api {get} /users/:id/auth Get user access token
 * @apiName authUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * Get user info.
 *
 * @apiSuccess {String} token User access token
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "token": "asdpsfhysdofwe3456sdfsd",
 *     }
 */
router
.route('/users/:id/auth')
.get(auth.signature())
.get(auth.facebook())
.get(function authUser(request, response, next) {
    'use strict';

    var query, facebook, password, email, _id;
    facebook = request.facebook;
    email = request.param('email');
    _id = request.param('_id');
    password = request.param('password') ? crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex') : null;
    query = User.findOne();

    if (request.facebook) {
        query.where('facebookId').equals(facebook);
    } else if (email) {
        query.where('email').equals(email);
        query.where('password').equals(password);
    } else {
        query.where('password').equals(password);
    }
    return query.exec(function (error, user) {
        if (error) {
            error = new VError(error, 'error signing up user');
            return next(error);
        }
        if (!user) {
            return response.send(403);
        }
        return response.send(200, {
            'token' : auth.token(user)
        });
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
 */
router.param('id', auth.session());
router.param('id', function findUser(request, response, next, id) {
    'use strict';

    var query;
    query = User.findOne();
    if (id === 'me') {
        request.user = request.session;
        return next();
    }
    query.where('slug').equals(id);
    return query.exec(function foundUser(error, user) {
        if (error) {
            error = new VError(error, 'error finding user: "$s"', id);
            return next(error);
        }
        request.user = user;
        return next();
    });
});

router.use(errorParser.mongoose());

module.exports = router;