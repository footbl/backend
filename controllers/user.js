'use strict';

var router = require('express').Router();
var async = require('async');
var User = require('../models/user');

/**
 * @api {post} /users Creates a new user.
 * @apiName create
 * @apiGroup User
 *
 * @apiParam {String} password
 * @apiParam {String} [country='Brazil']
 */
router
.route('/users')
.post(function (request, response, next) {
  async.waterfall([function (next) {
    var password = require('crypto').createHash('sha1').update(request.body.password + require('nconf').get('PASSWORD_SALT')).digest('hex');
    var user = new User();
    user.password = request.body.password ? password : null;
    user.country = request.body.country ? request.body.country : 'BR';
    user.active = true;
    user.save(next);
  }, function (user) {
    response.status(201).send(user.id);
  }], next);
});

/**
 * @api {get} /users List all users.
 * @apiName list
 * @apiGroup User
 * @apiUse defaultHeaders
 * @apiUse defaultPaging
 */
router
.route('/users')
.get(function (request, response, next) {
  async.waterfall([function (next) {
    var query = User.find().skip((request.query.page || 0) * 20).limit(20);
    if (request.query.filterByEmail) query.where('email').equals(request.query.filterByEmail);
    if (request.query.filterByUsername) query.where('username').equals(request.query.filterByUsername);
    if (request.query.filterByName) query.where('name').equals(request.query.filterByName);
    if (request.query.filterByCountry) query.where('country').equals(request.query.filterByCountry);
    if (request.query.filterByFeatured) query.where('featured').equals(true);
    query.exec(next);
  }, function (users) {
    response.status(200).send(users);
  }], next);
});

/**
 * @api {get} /users/:id Get user.
 * @apiName get
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  response.status(200).send(request.user);
});

/**
 * @api {put} /users/:id Update user.
 * @apiName update
 * @apiGroup User
 * @apiUse defaultHeaders
 *
 * @apiParam {String} [email]
 * @apiParam {String} [username]
 * @apiParam {String} [facebook]
 * @apiParam {String} [about]
 * @apiParam {String} [password]
 * @apiParam {String} [picture]
 * @apiParam {String} [apnsToken]
 */
router
.route('/users/:id')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var password = require('crypto').createHash('sha1').update(request.body.password + require('nconf').get('PASSWORD_SALT')).digest('hex');
    var user = request.user;
    user.email = request.body.email;
    user.username = request.body.username;
    user.name = request.body.name;
    user.facebook = request.facebook ? request.facebook : user.facebook;
    user.about = request.body.about;
    user.password = request.body.password ? password : user.password;
    user.picture = request.body.picture;
    user.apnsToken = request.body.apnsToken;
    user.save(next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {delete} /users/:id Remove user.
 * @apiName remove
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id')
.delete(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var user = request.user;
    user.active = false;
    user.save(next);
  }, function () {
    response.status(204).end();
  }], next);
});

/**
 * @api {put} /users/:id/recharge Recharge user.
 * @apiName recharge
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id/recharge')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.user.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var user = request.user;
    user.funds = 100;
    user.save(next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {get} /users/me/forgot-password Forgot password.
 * @apiName forgotPassword
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/me/forgot-password')
.get(function (request, response, next) {
  next();
});

/**
 * @api {put} /users/:id/follow Follow user.
 * @apiName follow
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id/follow')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    request.session.update({'$addToSet' : {'starred' : request.session.id}}, next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {put} /users/:id/unfollow Unfollow user.
 * @apiName unfollow
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id/unfollow')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    request.user.update({'$pull' : {'starred' : request.session._id}}, next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {get} /users/:id/followers Followers user.
 * @apiName followers
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id/followers')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    User.find().where('starred').equals(request.user._id).exec(next);
  }, function (users) {
    response.status(200).send(users);
  }], next);
});

/**
 * @api {get} /users/:id/following Following user.
 * @apiName following
 * @apiGroup User
 * @apiUse defaultHeaders
 */
router
.route('/users/:id/following')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    User.find().where('_id').in(request.user.starred).exec(next);
  }, function (users) {
    response.status(200).send(users);
  }], next);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    User.findOne().where('_id').equals((id === 'me' && request.session) ? request.session._id  : id).exec(next);
  }, function (user, next) {
    request.user = user;
    next(!user ? new Error('not found') : null);
  }], next);
});

module.exports = router;
