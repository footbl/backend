'use strict';

var router, nconf, slug, async, auth, push, User, Featured;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
User = require('../models/user');
Featured = require('../models/featured');

router.use(function findFeaturedUser(request, response, next) {
  var user;
  user = request.param('featured');
  if (!user) return next();
  return async.waterfall([function (next) {
    var query;
    query = User.findOne();
    query.where('slug').equals(user);
    query.exec(next);
  }, function (user, next) {
    request.featuredUser = user;
    return next();
  }], next);
});

/**
 * @api {post} /users/:user/featured Creates a new featured.
 * @apiName createFeatured
 * @apiVersion 2.2.0
 * @apiGroup featured
 * @apiPermission user
 *
 * @apiParam {String} featured Featured user slug.
 *
 * @apiErrorExample
 * HTTP/1.1 400 Bad Request
 * {
 *   "featured": "required"
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
 *  "featured": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "user": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/featured')
.post(auth.session())
.post(auth.checkMethod('user'))
.post(function createFeatured(request, response, next) {
  async.waterfall([function (next) {
    var featured;
    featured = new Featured({
      'slug'     : request.featuredUser ? request.featuredUser.slug : null,
      'featured' : request.featuredUser,
      'user'     : request.session._id
    });
    featured.save(next);
  }, function (featured, _, next) {
    featured.populate('featured');
    featured.populate('user');
    featured.populate(next);
  }, function (featured, next) {
    response.status(201);
    response.send(featured);
    next();
  }], next);
});

/**
 * @api {get} /users/:user/featured List all user featured.
 * @apiName listFeatured
 * @apiVersion 2.2.0
 * @apiGroup featured
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "vandoren",
 *  "featured": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "user": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/users/:user/featured')
.get(auth.session())
.get(function listFeatured(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Featured.find();
    query.where('user').equals(request.user._id);
    query.populate('featured');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (featured, next) {
    response.status(200);
    response.send(featured);
    next();
  }], next);
});

/**
 * @api {get} /users/:user/fans List all user fans.
 * @apiName listFans
 * @apiVersion 2.2.0
 * @apiGroup featured
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "vandoren",
 *  "featured": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "user": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/users/:user/fans')
.get(auth.session())
.get(function listFans(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Featured.find();
    query.where('featured').equals(request.user._id);
    query.populate('featured');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (featured, next) {
    response.status(200);
    response.send(featured);
    next();
  }], next);
});

/**
 * @api {get} /users/:user/featured/:featured Get featured.
 * @apiName getFeatured
 * @apiVersion 2.2.0
 * @apiGroup featured
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "vandoren",
 *  "featured": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "user": {
 *    "slug": "vandoren",
 *    "email": "vandoren@vandoren.com",
 *    "username": "vandoren",
 *    "ranking": "2",
 *    "previousRanking": "1",
 *    "funds": 100,
 *    "stake": 0,
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/users/:user/featured/:featured')
.get(auth.session())
.get(function getFeatured(request, response, next) {
  async.waterfall([function (next) {
    var featured;
    featured = request.featured;
    response.status(200);
    response.send(featured);
    next();
  }], next);
});

/**
 * @api {delete} /users/:user/featured/:featured Removes featured.
 * @apiName removeFeatured
 * @apiVersion 2.2.0
 * @apiGroup featured
 * @apiPermission user
 *
 * @apiErrorExample
 * HTTP/1.1 405 Method Not Allowed
 *
 * @apiSuccessExample
 * HTTP/1.1 204 Empty
 */
router
.route('/users/:user/featured/:featured')
.delete(auth.session())
.delete(auth.checkMethod('user'))
.delete(function removeFeatured(request, response, next) {
  async.waterfall([function (next) {
    var featured;
    featured = request.featured;
    featured.remove(next);
  }, function (_, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

router.param('featured', function findFeatured(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Featured.findOne();
    query.where('user').equals(request.user._id);
    query.where('slug').equals(id);
    query.populate('featured');
    query.populate('user');
    query.exec(next);
  }, function (featured, next) {
    request.featured = featured;
    next(!featured ? new Error('not found') : null);
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