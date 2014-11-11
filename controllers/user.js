var VError, router, nconf, slug, async, freegeoip, mandrill, crypto, auth, User;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
freegeoip = require('node-freegeoip');
mandrill = new (require('mandrill-api')).Mandrill(nconf.get('MANDRILL_APIKEY'));
crypto = require('crypto');
auth = require('auth');
User = require('../models/user');

/**
 * @api {post} /users Creates a new user.
 * @apiName createUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * To create a user, the client must detect which kind of users will be created. There are three types of user, a
 * anonymous user, a facebook user and a registered user.
 * If the client is creating a anonymous user, a random password must be created by the client and stored in the device.
 * The password must be sent to the server and will be stored as a sha1 hash together with a salt.
 * If the client is creating a facebook user, the client must call the facebook sdk, and retrieve the user access token,
 * email and username. The facebook access token must be sent in the header 'facebook-token', and the other data must be
 * sent in the request body.
 * And if the client is creating a registered user, all the user data must be sent in the request body.
 * If the user has a username, a slug for identification will be created based on the user username, otherwise, the user
 * will be identified as me.
 *
 * @apiParam {String} [email] User email
 * @apiParam {String} [username] User username
 * @apiParam {String} password User password
 * @apiParam {String} [name] User name
 * @apiParam {String} [about] User about
 * @apiParam {String} [picture] User picture
 * @apiParam {String} [apnsToken] User apnsToken
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
.post(function detectUserCountry(request, response, next) {
  'use strict';

  var property;
  property = 'country_name';
  freegeoip.getLocation(request.ip, function detectedUserCountry(error, location) {
    if (error) {
      error = new VError(error, 'error finding user country');
      return next(error);
    }
    request.country = location[property];
    return next();
  });
})
.post(function createUser(request, response, next) {
  'use strict';

  var query;
  query = User.findOne();
  query.where('active').equals(false);
  query.where('facebookId').equals(request.facebook);
  return query.exec(function retrievedInactiveUserToCreate(error, user) {
    if (error) {
      error = new VError(error, 'error finding inactive user to create user');
      return next(error);
    }
    if (!user) {
      user = new User({});
    }
    user.slug = slug(request.param('username', 'me'));
    user.email = request.param('email');
    user.username = request.param('username');
    user.name = request.param('name');
    user.facebookId = request.facebook ? request.facebook : user.facebookId;
    user.about = request.param('about');
    user.password = request.param('password') ? crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex') : null;
    user.picture = request.param('picture');
    user.language = request.param('language');
    user.apnsToken = request.param('apnsToken');
    user.country = request.country;
    user.active = true;
    return user.save(function createdUser(error) {
      if (error) {
        error = new VError(error, 'error activating user');
        return next(error);
      }
      return response.status(201).send(user);
    });
  });
});

/**
 * @api {get} /users List all users
 * @apiName listUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * This route is used to search for users in the database, a user can be searched by the facebook id, email or username.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiParam {Array} [emails] Emails to search.
 * @apiParam {Array} [usernames] Usernames to search.
 * @apiParam {Array} [page].
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
    return response.status(200).send(users);
  });
});

/**
 * @api {get} /users/:id Get user info
 * @apiName getUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * This route returns the user info. To get the user details the user slug must placed in the route, and if it's a
 * anonymous account, the 'me' slug must be used. Notice that for anonymous users, the ser account information its only
 * accessible by the account owner using the 'me' slug.
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
  return response.status(200).send(user);
});

/**
 * @api {put} /users/:id Updates user info
 * @apiName updateUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * To update a user info, the client must detect if is changing the user to a facebook registered user or a registered
 * user. Or if the the client is keeping its old type.
 * If the the user is a facebook user or is changing to a facebook user, the client must call the facebook sdk and
 * retrieve the user facebook access token, and send it to the server in the 'facebook-token' header and also the
 * 'auth-token' generated in the auth route.
 * If the user is only a registered user, the client should only send the 'auth-token' generated in the auth route.
 * To access this endpoint the client can use the user slug generated on the user username or can only use the 'me'
 * slug..
 *
 * @apiParam {String} [email] User email
 * @apiParam {String} [username] User username
 * @apiParam {String} [password] User password
 * @apiParam {String} [name] User name
 * @apiParam {String} [about] User about
 * @apiParam {String} [picture] User picture
 * @apiParam {String} [apnsToken] User apnsToken
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
.put(auth.facebook())
.put(auth.session())
.put(function validateUpdateUser(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (user._id.toString() !== request.session._id.toString()) {
    return response.status(405).end();
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
  return user.save(function updatedUser(error) {
    if (error) {
      error = new VError(error, 'error updating user');
      return next(error);
    }
    return response.status(200).send(user);
  });
});

/**
 * @api {delete} /users/:id Removes user
 * @apiName removeUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission user
 * @apiDescription
 * This route deactivates a user in the system, if in the future a user tries to register with the deactivated user, the
 * user will be reactivated.
 */
router
.route('/users/:id')
.delete(auth.session())
.delete(function validateRemoveUser(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (user._id.toString() !== request.session._id.toString()) {
    return response.status(405).end()
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
    return response.status(204).end();
  });
});

/**
 * @api {get} /users/me/auth Get user access token
 * @apiName authUser
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * To sign in a user, the client must detect if the user is a anonymous user, or a facebook user or a registered user.
 * If it's a anonymous user, the client must send the random generated password stored in the client in the request
 * body. If it's a facebook user, the client must call the facebook sdk and retrieve the user token and send it in the
 * 'facebook-token' header. If it's aregistered user the client must send the email and password.
 *
 * @apiParam {String} [email] User email
 * @apiParam {String} [password] User password
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "token": "asdpsfhysdofwe3456sdfsd",
 *     }
 */
router
.route('/users/me/auth')
.get(auth.facebook())
.get(function authUser(request, response, next) {
  'use strict';

  var query, facebook, password, email;
  facebook = request.facebook;
  email = request.param('email');
  password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
  query = User.findOne();
  query.where('active').ne(false);
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
      return response.status(403).end();
    }
    return response.status(200).send({
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
 * This route will update the user's last recharge to the current date, so, only the bets with date higher than the new
 * date will impact in the user funds.
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
    return response.status(405).end()
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
    return response.status(200).send(user);
  });
});

/**
 * @api {get} /users/me/forgot-password Send user email to recover password
 * @apiName forgotPassword
 * @apiVersion 2.0.1
 * @apiGroup user
 * @apiPermission none
 * @apiDescription
 * To recover a user password, the client must send the user email and a email will be send to the user with a new
 * password.
 *
 * @apiParam {String} [email] User email
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
      return response.status(404).end();
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
    return response.status(200).send();
  });
});

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
      return response.status(404).end();
    }
    request.user = user;
    return next();
  });
});

module.exports = router;