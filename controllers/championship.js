var VError, router, nconf, slug, auth, Championship, Match;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
auth = require('../lib/auth');
Championship = require('../models/championship');
Match = require('../models/match');

/**
 * @api {get} /championships List all championships
 * @apiName listChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission user
 * @apiDescription
 * List all championships.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "name": "Brasileirão",
 *       "slug": "brasileirao-brasil-2014",
 *       "country" : "brasil",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "edition": 2014,
 *       "type": "national league",
 *       "rounds": 7,
 *       "currentRound" : 4,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/championships')
.get(auth.session())
.get(function listChampionship(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Championship.find();
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedChampionship(error, championships) {
    if (error) {
      error = new VError(error, 'error finding championships');
      return next(error);
    }
    return response.status(200).send(championships);
  });
});

/**
 * @api {get} /championships/:id Get championship info
 * @apiName getChampionship
 * @apiVersion 2.0.1
 * @apiGroup championship
 * @apiPermission user
 * @apiDescription
 * Get championship info.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "Brasileirão",
 *       "slug": "brasileirao-brasil-2014",
 *       "country" : "brasil",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "edition": 2014,
 *       "type": "national league",
 *       "rounds": 7,
 *       "currentRound" : 4,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/championships/:championship')
.get(auth.session())
.get(function getChampionship(request, response) {
  'use strict';

  var championship;
  championship = request.championship;
  return response.status(200).send(championship);
});

/**
 * @api {get} /championships/:championship/matches List all matches
 * @apiName listMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission user
 * @apiDescription
 * List all matches.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *       "guest": {
 *         "name": "fluminense",
 *         "slug": "fluminense",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "host": {
 *         "name": "botafogo",
 *         "slug": "botafogo",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "round": 3,
 *       "date": "2014-07-01T12:22:25.058Z",
 *       "finished": true,
 *       "elapsed": null,
 *       "result": {
 *         "guest": 0,
 *         "host" 0
 *       },
 *       "pot": {
 *         "guest": 0,
 *         "host" 0,
 *         "draw" 0
 *       },
 *       "winner": "draw",
 *       "jackpot": 0,
 *       "reward": 0,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/championships/:championship/matches')
.get(auth.session())
.get(function listMatch(request, response, next) {
  'use strict';

  var pageSize, page, query, championship;
  championship = request.championship;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Match.find();
  query.where('championship').equals(championship._id);
  query.or([
    {'round' : {'$gte' : (championship.currentRound || 1) - 3}},
    {'finished' : false}
  ]);
  query.skip(page);
  query.populate('guest');
  query.populate('host');
  query.limit(pageSize);
  return query.exec(function listedMatch(error, matches) {
    if (error) {
      error = new VError(error, 'error finding matches');
      return next(error);
    }
    return response.status(200).send(matches);
  });
});

/**
 * @api {get} /championships/:championship/matches/:match Get match info
 * @apiName getMatch
 * @apiVersion 2.0.1
 * @apiGroup match
 * @apiPermission user
 * @apiDescription
 * Get match info.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *       "guest": {
 *         "name": "fluminense",
 *         "slug": "fluminense",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "host": {
 *         "name": "botafogo",
 *         "slug": "botafogo",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "round": 3,
 *       "date": "2014-07-01T12:22:25.058Z",
 *       "finished": true,
 *       "elapsed": null,
 *       "result": {
 *         "guest": 0,
 *         "host" 0
 *       },
 *       "pot": {
 *         "guest": 0,
 *         "host" 0,
 *         "draw" 0
 *       },
 *       "winner": "draw",
 *       "jackpot": 0,
 *       "reward": 0,
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/championships/:championship/matches/:match')
.get(auth.session())
.get(function getMatch(request, response) {
  'use strict';

  var match;
  match = request.match;
  return response.status(200).send(match);
});

router.param('match', function findMatch(request, response, next, id) {
  'use strict';

  var query, championship;
  championship = request.championship;
  query = Match.findOne();
  query.where('slug').equals(id);
  query.where('championship').equals(championship._id);
  query.populate('guest');
  query.populate('host');
  return query.exec(function foundMatch(error, match) {
    if (error) {
      error = new VError(error, 'error finding match: "$s"', id);
      return next(error);
    }
    if (!match) {
      return response.status(404).end();
    }
    request.match = match;
    return next();
  });
});

router.param('championship', function findChampionship(request, response, next, id) {
  'use strict';

  var query;
  query = Championship.findOne();
  query.where('slug').equals(id);
  return query.exec(function foundChampionship(error, championship) {
    if (error) {
      error = new VError(error, 'error finding championship: "$s"', id);
      return next(error);
    }
    if (!championship) {
      return response.status(404).end();
    }
    request.championship = championship;
    return next();
  });
});

module.exports = router;