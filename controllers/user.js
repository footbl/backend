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
var VError, router, nconf, slug, async, freegeoip, mandrill, crypto, auth, User, Championship, Entry;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
freegeoip = require('node-freegeoip');
mandrill = new (require('mandrill-api')).Mandrill(nconf.get('MANDRILL_APIKEY'));
crypto = require('crypto');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');
Entry = require('../models/entry');

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
.post(function validateIfUserIsInactiveAccountToCreate(request, response, next) {
    'use strict';

    var query;
    if (!request.facebook) {
        return next();
    }
    query = User.findOne();
    query.where('active').equals(false);
    query.where('facebookId').equals(request.facebook);
    return query.exec(function retrievedInactiveUserToCreate(error, user) {
        if (error) {
            error = new VError(error, 'error finding inactive user to create user');
            return next(error);
        }
        if (!user) {
            return next();
        }
        user.slug = slug(request.param('username', 'me'));
        user.email = request.param('email');
        user.username = request.param('username');
        user.name = request.param('name');
        user.facebookId = request.facebook ? request.facebook : user.facebookId;
        user.about = request.param('about');
        user.password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
        user.picture = request.param('picture');
        user.language = request.param('language');
        user.apnsToken = request.param('apnsToken');
        user.active = true;
        return user.save(function (error) {
            if (error) {
                error = new VError(error, 'error activating user');
                return next(error);
            }
            return response.send(201, user);
        });
    });
})
.post(function createUser(request, response, next) {
    'use strict';

    var user, password;
    password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
    user = new User({
        'slug'       : slug(request.param('username', 'me')),
        'email'      : request.param('email'),
        'username'   : request.param('username'),
        'name'       : request.param('name'),
        'facebookId' : request.facebook,
        'about'      : request.param('about'),
        'password'   : request.param('password') ? password : null,
        'picture'    : request.param('picture'),
        'language'   : request.param('language'),
        'apnsToken'  : request.param('apnsToken')
    });
    async.series([user.save.bind(user), function (next) {
        async.waterfall([function (next) {
            freegeoip.getLocation(request.ip, next);
        }, function (location, next) {
            var query, property;
            property = 'country_name';
            query = Championship.find();
            query.or([
                {'country' : location[property]},
                {'country' : 'United Kingdom'}
            ]);
            query.exec(next);
        }, function (championships, next) {
            var championship, entry;
            if (championships.length === 2) {
                championship = championships[0].country === 'United Kingdom' ? championships[1] : championships[0];
            } else if (championships.length === 1) {
                championship = championships[0];
            } else {
                return next();
            }
            entry = new Entry({
                'slug'         : championship ? championship.slug : null,
                'championship' : championship._id,
                'user'         : user._id
            });
            return entry.save(next);
        }], next);
    }], function (error) {
        if (error) {
            error = new VError(error, 'error creating user');
            return next(error);
        }
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
.get(function listUser(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = User.find();
    query.sort('ranking');
    query.skip(page);
    query.limit(pageSize);
    query.where('active').ne(false);
    if (request.param('emails') && request.param('facebookIds')) {
        query.where('email').or([
            { 'email' : {'$in' : request.param('emails', [])} },
            { 'facebookId' : {'$in' : request.param('facebookIds', [])} }
        ]);
    } else if (request.param('emails')) {
        query.where('email').in(request.param('emails', []));
    } else if (request.param('facebookIds')) {
        query.where('facebookId').in(request.param('facebookIds', []));
    } else if (request.param('usernames')) {
        query.where('username').in(request.param('usernames', []));
    } else if (request.param('featured')) {
        query.where('featured').equals(true);
    } else {
        query.or([
            {'email' : {'$exists' : true}},
            {'facebookId' : {'$exists' : true}}
        ]);
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
.get(auth.session())
.get(function getUser(request, response) {
    'use strict';

    var user;
    user = request.user;
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
.put(auth.session())
.put(function validateUpdateUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (user._id.toString() !== request.session._id.toString()) {
        return response.send(405);
    }
    return next();
})
.put(function updateUser(request, response, next) {
    'use strict';

    var user, password;
    password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
    user = request.user;
    user.slug = slug(request.param('username', 'me'));
    user.email = request.param('email');
    user.username = request.param('username');
    user.name = request.param('name');
    user.facebookId = request.facebook ? request.facebook : user.facebookId;
    user.about = request.param('about');
    user.password = request.param('password') ? password : user.password;
    user.picture = request.param('picture');
    user.language = request.param('language');
    user.apnsToken = request.param('apnsToken');
    user.active = true;
    return user.save(function updatedUser(error) {
        if (error) {
            error = new VError(error, 'error updating user');
            return next(error);
        }
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
.delete(auth.session())
.delete(function validateRemoveUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (user._id.toString() !== request.session._id.toString()) {
        return response.send(405);
    }
    return next();
})
.delete(function removeUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    user.active = false;
    return user.save(function removedUser(error) {
        if (error) {
            error = new VError(error, 'error removing user: "$s"', request.params.id);
            return next(error);
        }
        return response.send(204);
    });
});

/**
 * @api {get} /users/me/auth Get user access token
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
.route('/users/me/auth')
.get(function authUser(request, response, next) {
    'use strict';

    var query, facebook, password, email;
    facebook = request.facebook;
    email = request.param('email');
    password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
    query = User.findOne();
    if (facebook) {
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
 * @api {post} /users/:id/recharge Recharges user funds.
 * @apiName rechargeUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * Recharges user funds.
 *
 * @apiStructure userParams
 * @apiStructure userSuccess
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
.route('/users/:id/recharge')
.post(auth.session())
.post(function validateRechargeUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (user._id.toString() !== request.session._id.toString()) {
        return response.send(405);
    }
    return next();
})
.post(function createUser(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    user.lastRecharge = new Date();
    return user.save(function (error) {
        if (error) {
            error = new VError(error, 'error recharging user: "$s"', user._id);
            return next(error);
        }
        return response.send(200, user);
    });
});

/**
 * @api {get} /users/me/forgot-password Send user email to recover password
 * @apiName forgotPassword
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * Send user email to recover password
 */
router
.route('/users/me/forgot-password')
.get(function forgotPassword(request, response, next) {
    'use strict';

    var query, email;
    email = request.param('email');
    query = User.findOne();
    query.where('email').equals(email);
    return query.exec(function (error, user) {
        if (error) {
            error = new VError(error, 'error finding user');
            return next(error);
        }
        if (!user) {
            return response.send(404);
        }
        mandrill.messages.send({
            'message' : {
                'html'       : [
                    '<p>Forgot password</p>',
                    '<p>to change your password <a href="footbl://forgot-password?token=' + auth.token(user) + '">click here.</a><p>',
                    '<p>footbl | wanna bet?<p>'
                ].join('\n'),
                'subject'    : 'footbl - password recovery',
                'from_name'  : 'footbl',
                'from_email' : 'noreply@footbl.co',
                'to'         : [
                    {
                        'email' : request.param('email', ''),
                        'type'  : 'to'
                    }
                ]
            },
            'async'   : true
        });
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
        if (!user) {
            return response.send(404);
        }
        request.user = user;
        return next();
    });
});

module.exports = router;