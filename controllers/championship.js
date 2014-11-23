var router, nconf, slug, async, auth, push, Championship, Match;

router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
push = require('push');
Championship = require('../models/championship');
Match = require('../models/match');

/**
 * @api {get} /championships List all championships.
 * @apiName listChampionship
 * @apiVersion 2.2.0
 * @apiGroup championship
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "name": "Brasileirão",
 *  "slug": "brasileirao-brasil-2014",
 *  "country" : "brasil",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "edition": 2014,
 *  "type": "national league",
 *  "rounds": 7,
 *  "currentRound" : 4,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/championships')
.get(auth.session())
.get(function listChampionship(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Championship.find();
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (championships, next) {
    response.status(200);
    response.send(championships);
    next();
  }], next);
});

/**
 * @api {get} /championships/:championship Get championship.
 * @apiName getChampionship
 * @apiVersion 2.2.0
 * @apiGroup championship
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "name": "Brasileirão",
 *  "slug": "brasileirao-brasil-2014",
 *  "country" : "brasil",
 *  "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *  "edition": 2014,
 *  "type": "national league",
 *  "rounds": 7,
 *  "currentRound" : 4,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/championships/:championship')
.get(auth.session())
.get(function getChampionship(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var championship;
    championship = request.championship;
    response.status(200);
    response.send(championship);
    next();
  }], next);
});

/**
 * @api {get} /championships/:championship/matches List all matches.
 * @apiName listMatch
 * @apiVersion 2.2.0
 * @apiGroup match
 * @apiPermission user
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * [{
 *  "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *  "guest": {
 *    "name": "fluminense",
 *    "slug": "fluminense",
 *    "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "host": {
 *    "name": "botafogo",
 *    "slug": "botafogo",
 *    "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "round": 3,
 *  "date": "2014-07-01T12:22:25.058Z",
 *  "finished": true,
 *  "elapsed": null,
 *  "result": {
 *    "guest": 0,
 *    "host" 0
 *  },
 *  "pot": {
 *    "guest": 0,
 *    "host" 0,
 *    "draw" 0
 *  },
 *  "winner": "draw",
 *  "jackpot": 0,
 *  "reward": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }]
 */
router
.route('/championships/:championship/matches')
.get(auth.session())
.get(function listMatch(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
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
    query.exec(next)
  }, function (matches, next) {
    async.series([function (next) {
      return async.each(matches, function (match, next) {
        match.findBet(request.session._id, next);
      }, next);
    }, function (next) {
      response.status(200);
      response.send(matches);
      next();
    }], next);
  }], next);
});

/**
 * @api {get} /championships/:championship/matches/:match Get match.
 * @apiName getMatch
 * @apiVersion 2.2.0
 * @apiGroup match
 * @apiPermission user
 *
 * @apiSuccessExample
 * HTTP/1.1 200 Ok
 * {
 *  "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *  "guest": {
 *    "name": "fluminense",
 *    "slug": "fluminense",
 *    "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "host": {
 *    "name": "botafogo",
 *    "slug": "botafogo",
 *    "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *    "createdAt": "2014-07-01T12:22:25.058Z",
 *    "updatedAt": "2014-07-01T12:22:25.058Z"
 *  },
 *  "round": 3,
 *  "date": "2014-07-01T12:22:25.058Z",
 *  "finished": true,
 *  "elapsed": null,
 *  "result": {
 *    "guest": 0,
 *    "host" 0
 *  },
 *  "pot": {
 *    "guest": 0,
 *    "host" 0,
 *    "draw" 0
 *  },
 *  "winner": "draw",
 *  "jackpot": 0,
 *  "reward": 0,
 *  "createdAt": "2014-07-01T12:22:25.058Z",
 *  "updatedAt": "2014-07-01T12:22:25.058Z"
 * }
 */
router
.route('/championships/:championship/matches/:match')
.get(auth.session())
.get(function getMatch(request, response, next) {
  'use strict';

  async.waterfall([function (next) {
    var match;
    match = request.match;
    match.findBet(request.session._id, next);
  }, function (next) {
    var match;
    match = request.match;
    response.status(200);
    response.send(match);
    next();
  }], next);
});

router.param('match', function findMatch(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = Match.findOne();
    query.where('championship').equals(request.championship._id);
    query.where('slug').equals(id);
    query.populate('guest');
    query.populate('host');
    query.exec(next);
  }, function (match, next) {
    request.match = match;
    next(!match ? new Error('not found') : null);
  }], next);
});

router.param('championship', function findChampionship(request, response, next, id) {
  'use strict';

  async.waterfall([function (next) {
    var query;
    query = Championship.findOne();
    query.where('slug').equals(id);
    query.exec(next);
  }, function (championship, next) {
    request.championship = championship;
    next(!championship ? new Error('not found') : null);
  }], next);
});

module.exports = router;