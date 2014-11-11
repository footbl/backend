var VError, router, nconf, slug, async, auth, User, Championship, Entry;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
User = require('../models/user');
Championship = require('../models/championship');
Entry = require('../models/entry');

router.use(auth.signature());
router.use(auth.session());

router.use(function findChampionship(request, response, next) {
  'use strict';

  var query, championship;
  championship = request.param('championship');
  if (!championship) {
    return next();
  }
  query = Championship.findOne();
  query.where('slug').equals(championship);
  return query.exec(function (error, championship) {
    if (error) {
      error = new VError(error, 'error finding championship: "$s"', championship);
      return next(error);
    }
    request.championship = championship;
    return next();
  });
});

/**
 * @api {post} /users/:user/entries Creates a new entry in database.
 * @apiName createEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Creates a new entry in database.
 *
 * @apiParam {String} championship Entry championship
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "championship": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "brasileirao-brasil-2014",
 *       "championship": {
 *         "name": "Brasileirão",
 *         "slug": "brasileirao-brasil-2014",
 *         "country" : "brasil",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "edition": 2014,
 *         "type": "national league",
 *         "rounds": 7,
 *         "currentRound" : 4,
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
.route('/users/:user/entries')
.post(auth.signature())
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
.post(function createEntry(request, response, next) {
  'use strict';

  var entry;
  entry = new Entry({
    'slug'         : request.championship ? request.championship.slug : null,
    'championship' : request.championship,
    'user'         : request.session._id
  });
  return async.series([entry.save.bind(entry), function (next) {
    entry.populate('championship');
    entry.populate('user');
    entry.populate(next);
  }], function createdEntry(error) {
    if (error) {
      error = new VError(error, 'error creating entry');
      return next(error);
    }
    return response.status(201).send(entry);
  });
});

/**
 * @api {get} /users/:user/entries List all entries in database
 * @apiName listEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * List all entries in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "brasileirao-brasil-2014",
 *       "championship": {
 *         "name": "Brasileirão",
 *         "slug": "brasileirao-brasil-2014",
 *         "country" : "brasil",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "edition": 2014,
 *         "type": "national league",
 *         "rounds": 7,
 *         "currentRound" : 4,
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
.route('/users/:user/entries')
.get(auth.signature())
.get(auth.session())
.get(function listEntry(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Entry.find();
  query.where('user').equals(request.user._id);
  query.populate('championship');
  query.populate('user');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedEntry(error, entries) {
    if (error) {
      error = new VError(error, 'error finding entries');
      return next(error);
    }
    return response.status(200).send(entries);
  });
});

/**
 * @api {get} /users/:user/entries/:id Get entry info in database
 * @apiName getEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Get entry info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "brasileirao-brasil-2014",
 *       "championship": {
 *         "name": "Brasileirão",
 *         "slug": "brasileirao-brasil-2014",
 *         "country" : "brasil",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "edition": 2014,
 *         "type": "national league",
 *         "rounds": 7,
 *         "currentRound" : 4,
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
.route('/users/:user/entries/:id')
.get(auth.signature())
.get(auth.session())
.get(function getEntry(request, response) {
  'use strict';

  var entry;
  entry = request.entry;
  return response.status(200).send(entry);
});

/**
 * @api {delete} /users/:user/entries/:id Removes entry from database
 * @apiName removeEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Removes entry from database
 */
router
.route('/users/:user/entries/:id')
.delete(auth.signature())
.delete(auth.session())
.delete(function validateEntryToDelete(request, response, next) {
  'use strict';

  var user;
  user = request.user;
  if (request.session._id.toString() !== user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.delete(function removeEntry(request, response, next) {
  'use strict';

  var entry;
  entry = request.entry;
  return entry.remove(function removedEntry(error) {
    if (error) {
      error = new VError(error, 'error removing entry: "$s"', request.params.id);
      return next(error);
    }
    return response.status(204).end();
  });
});

router.param('id', function findEntry(request, response, next, id) {
  'use strict';

  var query;
  query = Entry.findOne();
  query.where('user').equals(request.user._id);
  query.where('slug').equals(id);
  query.populate('championship');
  query.populate('user');
  query.exec(function foundEntry(error, entry) {
    if (error) {
      error = new VError(error, 'error finding entry: "$s"', id);
      return next(error);
    }
    if (!entry) {
      return response.status(404).end();
    }
    request.entry = entry;
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