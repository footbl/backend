var router, nconf, slug, async, auth, crypto, User, Prize;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
crypto = require('crypto');
User = require('../models/user');
Prize = require('../models/prize');

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
.post(function createUser(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    async.parallel([function (next) {
      var freegeoip;
      freegeoip = require('node-freegeoip');
      freegeoip.getLocation(request.ip, next);
    }, function (next) {
      var query;
      query = User.findOne();
      query.where('active').equals(false);
      query.where('facebookId').equals(request.facebook);
      query.exec(next);
    }], next);
  }, function (data, next) {
    var password, country, user;
    password = crypto.createHash('sha1').update(request.param('password') + nconf.get('PASSWORD_SALT')).digest('hex');
    country = data[0]['country_name'];
    user = data[1] || new User();
    user.slug = slug(request.param('username', 'me'));
    user.email = request.param('email');
    user.username = request.param('username');
    user.name = request.param('name');
    user.facebookId = request.facebook ? request.facebook : user.facebookId;
    user.about = request.param('about');
    user.password = request.param('password') ? password : null;
    user.picture = request.param('picture');
    user.language = request.param('language');
    user.apnsToken = request.param('apnsToken');
    user.country = country;
    user.active = true;
    user.save(next);
  }, function (user, _, next) {
    response.status(201);
    response.send(user);
    next();
  }], next);
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
 * @apiParam {Number} [page=0] The page to be displayed.
 * @apiParam {Boolean} [localRanking=false] List users close to the user in the ranking.
 * @apiParam {String []} [emails] Emails to search.
 * @apiParam {String []} [usernames] Usernames to search.
 * @apiParam {String} [name] Name to search.
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

  async.waterfall([function (next) {
    var pageSize, localRanking, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    localRanking = request.param('localRanking', false);
    if (localRanking && request.session) {
      page = (request.session.ranking || 0) - 14;
      page = page < 0 ? 0 : page;
    } else {
      page = request.param('page', 0) * pageSize;
    }
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
    } else if (request.param('name')) {
      query.where('name').equals(new RegExp(request.param('name'), 'i'));
    } else if (request.param('featured')) {
      query.where('featured').equals(true);
    } else {
      query.or([
        {'email' : {'$exists' : true}},
        {'facebookId' : {'$exists' : true}}
      ]);
    }
    query.exec(next);
  }, function (users, next) {
    response.status(200);
    response.send(users);
    next();
  }], next);
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
.route('/users/:user')
.get(auth.session())
.get(function getUser(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var user;
    user = request.user;
    response.status(200);
    response.send(user);
    next();
  }], next);
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
.route('/users/:user')
.put(auth.facebook())
.put(auth.session())
.put(auth.checkMethod('user'))
.put(function updateUser(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
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
    user.save(next);
  }, function (user, _, next) {
    response.status(200);
    response.send(user);
    next();
  }], next);
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
.route('/users/:user')
.delete(auth.session())
.delete(auth.checkMethod('user'))
.delete(function removeUser(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var user;
    user = request.user;
    user.active = false;
    user.save(next);
  }, function (user, _, next) {
    response.status(204);
    response.end();
    next();
  }], next);
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

  async.waterfall([function (next) {
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
    query.exec(next);
  }, function (user, next) {
    async.parallel([function (next) {
      response.status(user ? 200 : 403);
      response.send(user ? {'token' : auth.token(user)} : null);
      next();
    }, function (next) {
      async.waterfall([function (next) {
        var query, now, today, tomorrow;
        now = new Date();
        today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        query = Prize.findOne();
        query.where('user').equals(user ? user._id : null);
        query.where('createdAt').gte(today).lt(tomorrow);
        query.exec(next);
      }, function (prize, next) {
        if (prize || !user || user.funds >= 100) {
          return next();
        }
        prize = new Prize();
        prize.slug = Date.now();
        prize.user = user;
        prize.value = 1;
        prize.type = 'daily';
        return prize.save(next);
      }], next);
    }], next);
  }], next);
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
.route('/users/:user/recharge')
.post(auth.session())
.post(auth.checkMethod('user'))
.post(function createUser(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var user;
    user = request.user;
    user.lastRecharge = new Date();
    user.save(next);
  }, function (user, _, next) {
    response.status(200);
    response.send(user);
    next();
  }], next);
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

  async.waterfall([function (next) {
    var query, email;
    email = request.param('email');
    query = User.findOne();
    query.where('email').equals(email);
    query.exec(next);
  }, function (user, next) {
    var mandrill;
    mandrill = new (require('mandrill-api')).Mandrill(nconf.get('MANDRILL_APIKEY'));
    if (!user) {
      response.status(404);
    } else {
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
      response.status(200);
    }
    response.end();
    next();
  }], next);
});

router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    if (id === 'me') {
      query.where('_id').equals(request.session._id);
    } else {
      query.where('slug').equals(id);
    }
    query.exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

module.exports = router;