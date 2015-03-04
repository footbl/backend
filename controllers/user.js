'use strict';

var router, nconf, async, auth, push, crypto,
    User, Prize;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

User = require('../models/user');
Prize = require('../models/prize');

/**
 * @api {POST} /users
 * @apiName createUser
 * @apiGroup User
 *
 * @apiParam {String} password User password.
 * @apiParam {Array[ObjectId]} entries User entries.
 * @apiParam {Array[ObjectId]} starred User starred.
 */
router
.route('/users')
.post(auth.facebook())
.post(function createUser(request, response, next) {
  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('active').equals(false);
    query.where('facebookId').equals(request.facebook);
    query.exec(next);
  }, function (user, next) {
    var freegeoip;
    request.user = user && request.facebook ? user : new User();
    freegeoip = require('node-freegeoip');
    freegeoip.getLocation(request.ip, next);
  }, function (country, next) {
    var password, user;
    password = crypto.createHash('sha1').update(request.body.password + nconf.get('PASSWORD_SALT')).digest('hex');
    user = request.user;
    user.password = request.body.password ? password : null;
    user.country = country && country['country_name'] ? country['country_name'] : 'Brazil';
    user.active = true;
    user.save(next);
  }, function (user, _, next) {
    user.populate('entries');
    user.populate('starred');
    user.populate(next);
  }, function (user, next) {
    response.status(201);
    response.send(user);
    next();
  }], next);
});

/**
 * @api {GET} /users
 * @apiName listUser
 * @apiGroup User
 */
router
.route('/users')
.get(auth.populateSession())
.get(function listUser(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.body.page || 0) * pageSize;
    query = User.find();
    query.populate('entries');
    query.populate('starred');
    query.sort('ranking');
    query.skip(page);
    query.limit(pageSize);
    query.where('active').ne(false);
    if (request.body.emails && request.body.facebookIds) {
      query.where('email').or([
        {'email' : {'$in' : request.body.emails || []}},
        {'facebookId' : {'$in' : request.body.facebookIds || []}}
      ]);
    } else if (request.body.emails) {
      query.where('email').in(request.body.emails || []);
    } else if (request.body.facebookIds) {
      query.where('facebookId').in(request.body.facebookIds || []);
    } else if (request.body.usernames) {
      query.where('username').in(request.body.usernames || []);
    } else if (request.body.name) {
      query.where('name').equals(new RegExp(request.body.name, 'i'));
    } else if (request.body.featured) {
      query.where('featured').equals(true);
    } else {
      query.or([{'email' : {'$exists' : true}}, {'facebookId' : {'$exists' : true}}]);
    }
    query.exec(next);
  }, function (users, next) {
    response.status(200);
    response.send(users);
    next();
  }], next);
});

/**
 * @api {GET} /users/:user
 * @apiName getUser
 * @apiGroup User
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
 * @api {PUT} /users/:user
 * @apiName updateUser
 * @apiGroup User
 *
 * @apiParam {String} [email] User email.
 * @apiParam {String} [username] User username.
 * @apiParam {String} password User password.
 * @apiParam {String} [name] User name.
 * @apiParam {String} [about] User about.
 * @apiParam {String} [picture] User picture.
 * @apiParam {String} [apnsToken] User apnsToken.
 * @apiParam {Array[ObjectId]} entries User entries.
 */
router
.route('/users/:user')
.put(auth.facebook())
.put(auth.session())
.put(auth.checkMethod('user'))
.put(function updateUser(request, response, next) {
  async.waterfall([function (next) {
    var user, password;
    password = crypto.createHash('sha1').update(request.body.password + nconf.get('PASSWORD_SALT')).digest('hex');
    user = request.user;
    user.email = request.body.email;
    user.username = request.body.username;
    user.name = request.body.name;
    user.facebookId = request.facebook ? request.facebook : user.facebookId;
    user.about = request.body.about;
    user.password = request.body.password ? password : user.password;
    user.picture = request.body.picture;
    user.language = request.body.language;
    user.apnsToken = request.body.apnsToken;
    user.entries = request.body.entries;
    user.save(next);
  }, function (user, _, next) {
    user.populate('entries');
    user.populate('starred');
    user.populate(next);
  }, function (user, next) {
    response.status(200);
    response.send(user);
    next();
  }], next);
});

/**
 * @api {DELETE} /users/:user
 * @apiName removeUser
 * @apiGroup User
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
 * @api {GET} /users/:user/recharge
 * @apiName rechargeUser
 * @apiGroup User
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
 * @api {GET} /users/me/auth
 * @apiName authUser
 * @apiGroup User
 */
router
.route('/users/me/auth')
.get(auth.facebook())
.get(function authUser(request, response, next) {
  async.waterfall([function (next) {
    var query, facebook, password, email;
    facebook = request.facebook;
    email = request.body.email;
    password = crypto.createHash('sha1').update(request.body.password + nconf.get('PASSWORD_SALT')).digest('hex');
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
    request.user = user;
    response.status(user ? 200 : 403);
    response.send(user ? {'token' : auth.token(user), '_id' : user._id} : null);
    next();
  }, function (next) {
    var query, now, today, tomorrow;
    now = new Date();
    today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    query = Prize.findOne();
    query.where('user').equals(request.user ? request.user._id : null);
    query.where('createdAt').gte(today).lt(tomorrow);
    query.exec(next);
  }, function (prize, next) {
    if (prize) return next();
    prize = new Prize();
    prize.user = request.user;
    prize.value = 2;
    prize.type = 'daily';
    return prize.save(next);
  }], next);
});

/**
 * @api {GET} /users/me/forgot-password
 * @apiName forgotPassword
 * @apiGroup User
 */
router
.route('/users/me/forgot-password')
.get(function forgotPassword(request, response, next) {
  async.waterfall([function (next) {
    var query, email;
    email = request.body.email;
    query = User.findOne();
    query.where('email').equals(email);
    query.exec(next);
  }, function (user, next) {
    var mandrill;
    if (!user) return next(new Error('not found'));
    mandrill = new (require('mandrill-api')).Mandrill(nconf.get('MANDRILL_APIKEY'));
    mandrill.messages.sendTemplate({
      'template_name'    : 'password_recovery',
      'template_content' : [{'token' : auth.token(user)}],
      'message'          : {'to' : [{'email' : request.body.email}]},
      'async'            : true
    });
    response.status(200);
    response.end();
    return next();
  }], next);
});

/**
 * @api {POST} /users/:user/follow
 * @apiName followUser
 * @apiGroup User
 */
router
.route('/users/:user/follow')
.post(auth.session())
.post(function followUser(request, response, next) {
  async.waterfall([], next);
});

/**
 * @api {DELETE} /users/:user/unfollow
 * @apiName unfollowUser
 * @apiGroup User
 */
router
.route('/users/:user/unfollow')
.delete(auth.session())
.delete(function unfollowUser(request, response, next) {
  async.waterfall([], next);
});

/**
 * @api {GET} /users/:user/followers
 * @apiName followersUser
 * @apiGroup User
 */
router
.route('/users/:user/followers')
.get(auth.session())
.get(function followersUser(request, response, next) {
  async.waterfall([], next);
});

/**
 * @api {GET} /users/:user/following
 * @apiName followingUser
 * @apiGroup User
 */
router
.route('/users/:user/following')
.get(auth.session())
.get(function followingUser(request, response, next) {
  async.waterfall([], next);
});

router.param('user', function findUser(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('_id').equals(id);
    query.where('active').equals(true);
    query.populate('entries');
    query.populate('starred');
    query.exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

module.exports = router;