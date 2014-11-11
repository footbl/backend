var VError, router, nconf, slug, async, auth, User, Featured;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
User = require('../models/user');
Featured = require('../models/featured');

router.use(function findFeaturedUser(request, response, next) {
  'use strict';

  var query, user;
  user = request.param('featured');
  if (!user) {
    return next();
  }
  query = User.findOne();
  query.where('slug').equals(user);
  return query.exec(function (error, user) {
    if (error) {
      error = new VError(error, 'error finding featured: "$s"', user);
      return next(error);
    }
    request.featuredUser = user;
    return next();
  });
});

/**
 * @api {post} /users/:user/featured Creates a new featured.
 * @apiName createFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Creates a new featured.
 *
 * @apiParam {String} featured Featured user
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "featured": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "vandoren",
 *       "featured": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/featured')
.post(auth.session())
.post(function validateUserToCreate(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (request.session._id.toString() !== user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.post(function createFeatured(request, response, next) {
  'use strict';

  var featured;
  featured = new Featured({
    'slug'     : request.featuredUser ? request.featuredUser.slug : null,
    'featured' : request.featuredUser,
    'user'     : request.session._id
  });
  return async.series([featured.save.bind(featured), function (next) {
    featured.populate('featured');
    featured.populate('user');
    featured.populate(next);
  }], function createdFeature(error) {
    if (error) {
      error = new VError(error, 'error creating featured: "$s"', featured._id);
      return next(error);
    }
    return response.status(201).send(featured);
  });
});

/**
 * @api {get} /users/:user/featured List all featured
 * @apiName listFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * List all featured.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "featured": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/featured')
.get(auth.session())
.get(function listFeatured(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Featured.find();
  query.where('user').equals(request.user._id);
  query.populate('featured');
  query.populate('user');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedFeatured(error, featured) {
    if (error) {
      error = new VError(error, 'error finding featured');
      return next(error);
    }
    return response.status(200).send(featured);
  });
});

/**
 * @api {get} /users/:user/fans List all user fans
 * @apiName listFans
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * List all featured.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "featured": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/fans')
.get(auth.session())
.get(function listFans(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Featured.find();
  query.where('featured').equals(request.user._id);
  query.populate('featured');
  query.populate('user');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedFeatured(error, featured) {
    if (error) {
      error = new VError(error, 'error finding featured');
      return next(error);
    }
    return response.status(200).send(featured);
  });
});

/**
 * @api {get} /users/:user/featured/:id Get featured info
 * @apiName getFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Get featured info.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "featured": {
 *         "slug": "vandoren",
 *         "email": "vandoren@vandoren.com",
 *         "username": "vandoren",
 *         "name": "Van Doren",
 *         "about": "footbl fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "2",
 *         "previousRanking": "1",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/featured/:id')
.get(auth.session())
.get(function getFeatured(request, response) {
  'use strict';

  var featured;
  featured = request.featured;
  return response.status(200).send(featured);
});

/**
 * @api {delete} /users/:user/featured/:id Removes featured
 * @apiName removeFeatured
 * @apiVersion 2.0.1
 * @apiGroup featured
 * @apiPermission user
 * @apiDescription
 * Removes featured
 */
router
.route('/users/:user/featured/:id')
.delete(auth.session())
.delete(function validateUserToRemove(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (request.session._id.toString() !== user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.delete(function removeFeatured(request, response, next) {
  'use strict';

  var featured;
  featured = request.featured;
  return featured.remove(function removedFeatured(error) {
    if (error) {
      error = new VError(error, 'error removing featured: "$s"', request.params.id);
      return next(error);
    }
    return response.status(204).end();
  });
});

router.param('id', function findFeatured(request, response, next, id) {
  'use strict';

  var query;
  query = Featured.findOne();
  query.where('user').equals(request.user._id);
  query.where('slug').equals(id);
  query.populate('featured');
  query.populate('user');
  query.exec(function foundFeatured(error, featured) {
    if (error) {
      error = new VError(error, 'error finding featured: "$s"', id);
      return next(error);
    }
    if (!featured) {
      return response.status(404).end();
    }
    request.featured = featured;
    return next();
  });
});

router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
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