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
 * @api {POST} /users createUser
 * @apiName createUser
 * @apiGroup User
 *
 * @apiParam {String} password User password.
 * @apiParam {String} [country='Brazil'] User country.
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
    var password;
    password = crypto.createHash('sha1').update(request.body.password + nconf.get('PASSWORD_SALT')).digest('hex');
    user = user && request.facebook ? user : new User();
    user.password = request.body.password ? password : null;
    user.country = request.body.country ? request.body.country : 'Brazil';
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
 * @api {GET} /users listUser
 * @apiName listUser
 * @apiGroup User
 *
 * @apiParam {Array[String]} emails Filter by emails.
 * @apiParam {Array[String]} facebookIds Filter by facebook idds.
 * @apiParam {Array[String]} usernames Filter by usernames.
 * @apiParam {Array[String]} name Filter by name.
 * @apiParam {String} [page=0] The page to be displayed.
 */
router
.route('/users')
.get(auth.populateSession())
.get(function listUser(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = User.find();
    query.populate('entries');
    query.populate('starred');
    query.sort('seasons.0.rankings.0');
    query.skip(page);
    query.limit(pageSize);
    query.where('active').ne(false);
    if (request.query.emails && request.query.facebookIds) query.where('email').or([{'email' : {'$in' : request.query.emails || []}}, {'facebookId' : {'$in' : request.query.facebookIds || []}}]);
    else if (request.query.emails) query.where('email').in(request.query.emails || []);
    else if (request.query.facebookIds) query.where('facebookId').in(request.query.facebookIds || []);
    else if (request.query.usernames) query.where('username').in(request.query.usernames || []);
    else if (request.query.name) query.where('name').equals(new RegExp(request.query.name, 'i'));
    else if (request.query.featured) query.where('featured').equals(true);
    else query.or([{'email' : {'$exists' : true}}, {'facebookId' : {'$exists' : true}}]);
    query.exec(next);
  }, function (users, next) {
    response.status(200);
    response.send(users);
    next();
  }], next);
});

/**
 * @api {GET} /users/:user getUser
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
 * @api {PUT} /users/:user updateUser
 * @apiName updateUser
 * @apiGroup User
 *
 * @apiParam {String} [email] User email.
 * @apiParam {String} [username] User username.
 * @apiParam {String} [name] User name.
 * @apiParam {String} password User password.
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
 * @api {DELETE} /users/:user removeUser
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
 * @api {GET} /users/:user/recharge rechargeUser
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
 * @api {GET} /users/me/auth authUser
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
    email = request.query.email;
    password = crypto.createHash('sha1').update(request.query.password + nconf.get('PASSWORD_SALT')).digest('hex');
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
    if (!request.user) return next();
    prize = new Prize();
    prize.user = request.user;
    prize.value = 2;
    prize.type = 'daily';
    return prize.save(next);
  }], next);
});

/**
 * @api {GET} /users/me/forgot-password forgotPassword
 * @apiName forgotPassword
 * @apiGroup User
 */
router
.route('/users/me/forgot-password')
.get(function forgotPassword(request, response, next) {
  async.waterfall([function (next) {
    var query, email;
    email = request.query.email;
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
      'message'          : {'to' : [{'email' : request.query.email}]},
      'async'            : true
    });
    response.status(200);
    response.end();
    return next();
  }], next);
});

/**
 * @api {POST} /users/:user/follow followUser
 * @apiName followUser
 * @apiGroup User
 */
router
.route('/users/:user/follow')
.post(auth.session())
.post(function followUser(request, response, next) {
  async.waterfall([function (next) {
    var user;
    user = request.session;
    user.update({'$addToSet' : {'starred' : request.session._id}}, next);
  }, function (user, _, next) {
    response.status(200);
    response.send(user);
    return next();
  }], next);
});

/**
 * @api {DELETE} /users/:user/unfollow unfollowUser
 * @apiName unfollowUser
 * @apiGroup User
 */
router
.route('/users/:user/unfollow')
.delete(auth.session())
.delete(function unfollowUser(request, response, next) {
  async.waterfall([function (next) {
    var user;
    user = request.user;
    user.update({'$pull' : {'starred' : request.session._id}}, next);
  }, function (user, _, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

/**
 * @api {GET} /users/:user/followers followersUser
 * @apiName followersUser
 * @apiGroup User
 */
router
.route('/users/:user/followers')
.get(auth.session())
.get(function followersUser(request, response, next) {
  async.waterfall([function (next) {
    var query;
    query = User.find();
    query.where('starred').equals(request.user._id);
    query.exec(next);
  }, function (users, _, next) {
    response.status(200);
    response.send(users);
    return next();
  }], next);
});

/**
 * @api {GET} /users/:user/following followingUser
 * @apiName followingUser
 * @apiGroup User
 */
router
.route('/users/:user/following')
.get(auth.session())
.get(function followingUser(request, response, next) {
  async.waterfall([function (next) {
    var user, query;
    user = request.user;
    query = User.find();
    query.where('_id').in(user.starred);
    query.exec(next);
  }, function (users, _, next) {
    response.status(200);
    response.send(users);
    return next();
  }], next);
});

router.param('user', function findUser(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('_id').equals(id);
    query.where('active').equals(true);
    query.populate('entries');
    query.exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

module.exports = router;
