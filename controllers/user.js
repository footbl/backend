'use strict';

var router, nconf, slug, async, auth, push, crypto, User, Prize;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');
User = require('../models/user');
Prize = require('../models/prize');

/**
 * @api {post} /users Creates a new user.
 * @apiName createUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission none
 *
 * @apiParam {String} [username] User username, used for public profile.
 * @apiParam {String} [email] User email.
 * @apiParam {String} [name] User name.
 * @apiParam {String} [about] User about, should contain user self description.
 * @apiParam {String} password User password.
 * @apiParam {String} [picture] User picture, the client must save it first in the cloudinary and only send the uri.
 * @apiParam {String} [language] User language.
 * @apiParam {String} [apnsToken] User pans token, for apple push notification.
 *
 * @apiErrorExample
 * HTTP/1.1 400 Bad Request
 * {
 *   "password": "required"
 * }
 *
 * @apiErrorExample
 * HTTP/1.1 409 Conflict
 *
 * @apiSuccessExample
 * HTTP/1.1 201 Created
 * {
 *  "slug": "vandoren",
 *  "email": "vandoren@vandoren.com",
 *  "username": "vandoren",
 *  "name": "Van Doren",
 *  "about": "footbl fan",
 *  "verified": false,
 *  "featured": false,
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "ranking": "2",
 *  "previousRanking": "1",
 *  "history": [{
 *    "date": "2014-07-01T12:22:25.058Z",
 *    "funds": 100
 *  },{
 *    "date": "2014-07-03T12:22:25.058Z",
 *    "funds": 120
 *  }],
 *  "country": "Brazil",
 *  "funds": 100,
 *  "stake": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users')
.post(auth.facebook())
.post(function createUser(request, response, next) {
  async.waterfall([function (next) {
    async.parallel([function (next) {
      var freegeoip;
      freegeoip = require('node-freegeoip');
      freegeoip.getLocation(request.ip, function (error, data) {
        next(null, data && data['country_name'] ? data['country_name'] : 'Brazil');
      });
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
    country = data[0];
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
 * @api {get} /users List all users.
 * @apiName listUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission none
 *
 * @apiParam {String} [emails] Filter users in the emails list.
 * @apiParam {String} [facebookIds] Filter users in the facebook ids list.
 * @apiParam {String} [usernames] Filter users in the usernames list.
 * @apiParam {String} [name] Filter users with name matching in regular expression with the given name.
 * @apiParam {String} [featured] Filter only featured account users.
 * @apiParam {String} [localRanking] Filter user local ranking.
 *
 * @apiParam {Number} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "vandoren",
 *  "email": "vandoren@vandoren.com",
 *  "username": "vandoren",
 *  "name": "Van Doren",
 *  "about": "footbl fan",
 *  "verified": false,
 *  "featured": false,
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "ranking": "2",
 *  "previousRanking": "1",
 *  "history": [{
 *    "date": "2014-07-01T12:22:25.058Z",
 *    "funds": 100
 *  },{
 *    "date": "2014-07-03T12:22:25.058Z",
 *    "funds": 120
 *  }],
 *  "country": "Brazil",
 *  "funds": 100,
 *  "stake": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/users')
.get(auth.populateSession())
.get(function listUser(request, response, next) {
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
 * @api {get} /users/:user Get user.
 * @apiName getUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "vandoren",
 *  "email": "vandoren@vandoren.com",
 *  "username": "vandoren",
 *  "name": "Van Doren",
 *  "about": "footbl fan",
 *  "verified": false,
 *  "featured": false,
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "ranking": "2",
 *  "previousRanking": "1",
 *  "history": [{
 *    "date": "2014-07-01T12:22:25.058Z",
 *    "funds": 100
 *  },{
 *    "date": "2014-07-03T12:22:25.058Z",
 *    "funds": 120
 *  }],
 *  "country": "Brazil",
 *  "funds": 100,
 *  "stake": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user')
.get(auth.session())
.get(function getUser(request, response, next) {
  async.waterfall([function (next) {
    var user;
    user = request.user;
    response.status(200);
    response.send(user);
    next();
  }], next);
});

/**
 * @api {put} /users/:user Updates user.
 * @apiName updateUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission user
 *
 * @apiParam {String} [username] User username, used for public profile.
 * @apiParam {String} [email] User email.
 * @apiParam {String} [name] User name.
 * @apiParam {String} [about] User about, should contain user self description.
 * @apiParam {String} [password] User password.
 * @apiParam {String} [picture] User picture, the client must save it first in the cloudinary and only send the uri.
 * @apiParam {String} [language] User language.
 * @apiParam {String} [apnsToken] User pans token, for apple push notification.
 *
 * @apiErrorExample
 * HTTP/1.1 400 Bad Request
 * {
 *   "password": "required"
 * }
 *
 * @apiErrorExample
 * HTTP/1.1 409 Conflict
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 201 Created
 * {
 *  "slug": "vandoren",
 *  "email": "vandoren@vandoren.com",
 *  "username": "vandoren",
 *  "name": "Van Doren",
 *  "about": "footbl fan",
 *  "verified": false,
 *  "featured": false,
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "ranking": "2",
 *  "previousRanking": "1",
 *  "history": [{
 *    "date": "2014-07-01T12:22:25.058Z",
 *    "funds": 100
 *  },{
 *    "date": "2014-07-03T12:22:25.058Z",
 *    "funds": 120
 *  }],
 *  "country": "Brazil",
 *  "funds": 100,
 *  "stake": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user')
.put(auth.facebook())
.put(auth.session())
.put(auth.checkMethod('user'))
.put(function updateUser(request, response, next) {
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
 * @api {delete} /users/:user Removes user.
 * @apiName removeUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 204 Empty
 */
router
.route('/users/:user')
.delete(auth.session())
.delete(auth.checkMethod('user'))
.delete(function removeUser(request, response, next) {
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
 * @api {get} /users/me/auth Get user access token.
 * @apiName authUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission none
 *
 * @apiParam {String} [email] User email.
 * @apiParam {String} [password] User password.
 *
 * @apiErrorExample
 * HTTP/1.1 403 Forbidden
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *   "token": "asdpsfhysdofwe3456sdfsd",
 * }
 */
router
.route('/users/me/auth')
.get(auth.facebook())
.get(function authUser(request, response, next) {
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
        if (prize || !user) return next();
        prize = new Prize();
        prize.slug = Date.now();
        prize.user = user;
        prize.value = 2;
        prize.type = 'daily';
        return prize.save(next);
      }], next);
    }], next);
  }], next);
});

/**
 * @api {post} /users/:user/recharge Recharges user funds.
 * @apiName rechargeUser
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "vandoren",
 *  "email": "vandoren@vandoren.com",
 *  "username": "vandoren",
 *  "name": "Van Doren",
 *  "about": "footbl fan",
 *  "verified": false,
 *  "featured": false,
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "ranking": "2",
 *  "previousRanking": "1",
 *  "history": [{
 *    "date": "2014-07-01T12:22:25.058Z",
 *    "funds": 100
 *  },{
 *    "date": "2014-07-03T12:22:25.058Z",
 *    "funds": 120
 *  }],
 *  "country": "Brazil",
 *  "funds": 100,
 *  "stake": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/recharge')
.post(auth.session())
.post(auth.checkMethod('user'))
.post(function rechargeUser(request, response, next) {
  async.waterfall([function (next) {
    var user;
    user = request.user;
    user.funds = 100;
    user.save(next);
  }, function (user, _, next) {
    response.status(200);
    response.send(user);
    next();
  }], next);
});

/**
 * @api {get} /users/me/forgot-password Send user email to recover password.
 * @apiName forgotPassword
 * @apiVersion 2.2.0
 * @apiGroup user
 * @apiPermission none
 *
 * @apiParam {String} [email] User email.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Created
 */
router
.route('/users/me/forgot-password')
.get(function forgotPassword(request, response, next) {
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