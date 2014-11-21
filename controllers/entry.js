var router, nconf, slug, async, auth, User, Championship, Entry;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
User = require('../models/user');
Championship = require('../models/championship');
Entry = require('../models/entry');

router.use(function findChampionship(request, response, next) {
  'use strict';

  var championship;
  championship = request.param('championship');
  if (!championship) {
    return next();
  }
  async.waterfall([function (next) {
    var query;
    query = Championship.findOne();
    query.where('slug').equals(championship);
    query.exec(next);
  }, function (championship, next) {
    request.championship = championship;
    next();
  }], next);
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
 * @apiParam {Number} [order] Entry order
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
 *       "order": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/entries')
.post(auth.session())
.post(auth.checkMethod('user'))
.post(function createEntry(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var entry;
    entry = new Entry({
      'slug'         : request.championship ? request.championship.slug : null,
      'championship' : request.championship,
      'user'         : request.session._id,
      'order'        : request.param('order')
    });
    entry.save(next);
  }, function (entry, _, next) {
    entry.populate('championship');
    entry.populate('user');
    entry.populate(next);
  }, function (entry, next) {
    response.status(201);
    response  .send(entry);
    next();
  }], next);
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
 *       "order": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/entries')
.get(auth.session())
.get(function listEntry(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Entry.find();
    query.where('user').equals(request.user._id);
    query.populate('championship');
    query.populate('user');
    query.sort('order');
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (entries, next) {
    response.status(200);
    response.send(entries);
    next();
  }], next);
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
 *       "order": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/entries/:entry')
.get(auth.session())
.get(function getEntry(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var entry;
    entry = request.entry;
    response.status(200);
    response.send(entry);
    next();
  }], next);
});

/**
 * @api {put} /users/:user/entries/:id Updates a entry in database
 * @apiName updateEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Updates a entry in database.
 *
 * @apiParam {String} championship Entry championship
 * @apiParam {Number} [order] Entry order
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "championship": "required"
 *     }
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
 *       "order": 1,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/entries/:entry')
.put(auth.session())
.put(auth.checkMethod('user'))
.put(function updateEntry(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var entry;
    entry = request.entry;
    entry.championship = request.championship;
    entry.slug = request.championship ? request.championship.slug : null;
    entry.order = request.param('order');
    entry.save(next);
  }, function (entry, _, next) {
    entry.populate('championship');
    entry.populate('user');
    entry.populate(next);
  }, function (entry, next) {
    response.status(200);
    response.send(entry);
    next();
  }], next);
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
.route('/users/:user/entries/:entry')
.delete(auth.session())
.delete(auth.checkMethod('user'))
.delete(function removeEntry(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var entry;
    entry = request.entry;
    entry.remove(next);
  }, function (_, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

router.param('entry', function findEntry(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = Entry.findOne();
    query.where('user').equals(request.user._id);
    query.where('slug').equals(id);
    query.populate('championship');
    query.populate('user');
    query.exec(next);
  }, function (entry, next) {
    request.entry = entry;
    next(!entry ? new Error('not found') : null);
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