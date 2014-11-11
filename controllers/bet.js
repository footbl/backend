var VError, router, nconf, slug, async, auth, Championship, Match, Team, Bet, User;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('auth');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');
Bet = require('../models/bet');
User = require('../models/user');

/**
 * @api {post} /championships/:championship/matches/:match/bets Creates a new bet in database.
 * @apiName createBet
 * @apiVersion 2.0.1
 * @apiGroup bet
 * @apiPermission user
 * @apiDescription
 * Creates a new bet in database.
 *
 * @apiParam {Number} bid Bet bid
 * @apiParam {String} result Bet result
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "bid": "required",
 *       "result": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "vandoren",
 *       "user": {
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
 *       "match": {
 *         "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *         "guest": {
 *           "name": "fluminense",
 *           "slug": "fluminense",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "host": {
 *           "name": "botafogo",
 *           "slug": "botafogo",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "round": 3,
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "finished": true,
 *         "elapsed": null,
 *         "result": {
 *           "guest": 0,
 *           "host" 0
 *         },
 *         "pot": {
 *           "guest": 0,
 *           "host" 0,
 *           "draw" 0
 *         },
 *         "winner": "draw",
 *         "jackpot": 0,
 *         "reward": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/championships/:championship/matches/:match/bets')
.post(auth.session())
.post(function createBet(request, response, next) {
  'use strict';

  var bet;
  bet = new Bet({
    'slug'   : request.match.slug + '-' + request.session.slug,
    'user'   : request.session._id,
    'match'  : request.match._id,
    'bid'    : request.param('bid'),
    'result' : request.param('result')
  });
  return async.series([bet.save.bind(bet), function (next) {
    bet.populate('user');
    bet.populate('match');
    bet.populate(next);
  }, function (next) {
    bet.match.populate('guest');
    bet.match.populate('host');
    bet.match.populate(next);
  }, function (next) {
    Match.update({'_id' : request.match._id}, {'$inc' : {
      'pot.guest' : bet.result === 'guest' ? bet.bid : 0,
      'pot.host'  : bet.result === 'host' ? bet.bid : 0,
      'pot.draw'  : bet.result === 'draw' ? bet.bid : 0
    }}, next);
  }], function createdBet(error) {
    if (error) {
      error = new VError(error, 'error creating bet: "$s"', bet._id);
      return next(error);
    }
    return response.status(201).send(bet);
  });
});

/**
 * @api {get} /championships/:championship/matches/:match/bets List all bets in database
 * @apiName listBet
 * @apiVersion 2.0.1
 * @apiGroup bet
 * @apiPermission user
 * @apiDescription
 * List all bets in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "user": {
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
 *       "match": {
 *         "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *         "guest": {
 *           "name": "fluminense",
 *           "slug": "fluminense",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "host": {
 *           "name": "botafogo",
 *           "slug": "botafogo",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "round": 3,
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "finished": true,
 *         "elapsed": null,
 *         "result": {
 *           "guest": 0,
 *           "host" 0
 *         },
 *         "pot": {
 *           "guest": 0,
 *           "host" 0,
 *           "draw" 0
 *         },
 *         "winner": "draw",
 *         "jackpot": 0,
 *         "reward": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "bid": 50,
 *       "result": "draw",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/championships/:championship/matches/:match/bets')
.get(auth.session())
.get(function listBet(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Bet.find();
  query.where('match').equals(request.match._id);
  query.populate('user');
  query.populate('match');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedBet(error, bets) {
    if (error) {
      error = new VError(error, 'error finding bets');
      return next(error);
    }
    return Team.populate(bets, {'path' : 'match.guest match.host'}, function (error) {
      if (error) {
        error = new VError(error, 'error populating bets');
        return next(error);
      }
      return response.status(200).send(bets);
    });
  });
});

/**
 * @api {get} /championships/:championship/matches/:match/bets/:id Get bet info in database
 * @apiName getBet
 * @apiVersion 2.0.1
 * @apiGroup bet
 * @apiPermission user
 * @apiDescription
 * Get bet info in database.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "user": {
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
 *       "match": {
 *         "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *         "guest": {
 *           "name": "fluminense",
 *           "slug": "fluminense",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "host": {
 *           "name": "botafogo",
 *           "slug": "botafogo",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "round": 3,
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "finished": true,
 *         "elapsed": null,
 *         "result": {
 *           "guest": 0,
 *           "host" 0
 *         },
 *         "pot": {
 *           "guest": 0,
 *           "host" 0,
 *           "draw" 0
 *         },
 *         "winner": "draw",
 *         "jackpot": 0,
 *         "reward": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "bid": 50,
 *       "result": "draw",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/championships/:championship/matches/:match/bets/:id')
.get(auth.session())
.get(function getBet(request, response) {
  'use strict';

  var bet;
  bet = request.bet;
  return response.status(200).send(bet);
});

/**
 * @api {put} /championships/:championship/matches/:match/bets/:id Updates bet info in database
 * @apiName updateBet
 * @apiVersion 2.0.1
 * @apiGroup bet
 * @apiPermission user
 * @apiDescription
 * Updates bet info in database.
 *
 * @apiParam {Number} bid Bet bid
 * @apiParam {String} result Bet result
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "bid": "required",
 *       "result": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "vandoren",
 *       "user": {
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
 *       "match": {
 *         "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *         "guest": {
 *           "name": "fluminense",
 *           "slug": "fluminense",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "host": {
 *           "name": "botafogo",
 *           "slug": "botafogo",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "round": 3,
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "finished": true,
 *         "elapsed": null,
 *         "result": {
 *           "guest": 0,
 *           "host" 0
 *         },
 *         "pot": {
 *           "guest": 0,
 *           "host" 0,
 *           "draw" 0
 *         },
 *         "winner": "draw",
 *         "jackpot": 0,
 *         "reward": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "bid": 50,
 *       "result": "draw",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/championships/:championship/matches/:match/bets/:id')
.put(auth.session())
.put(function validateUserToUpdate(request, response, next) {
  'use strict';

  var bet;
  bet = request.bet;
  if (request.session._id.toString() !== bet.user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.put(function updateBet(request, response, next) {
  'use strict';

  var bet, oldResult, oldBid;
  bet = request.bet;
  oldBid = bet.bid;
  oldResult = bet.result;
  bet.bid = request.param('bid');
  bet.result = request.param('result');
  return async.series([bet.save.bind(bet), function (next) {
    bet.populate('user');
    bet.populate('match');
    bet.populate(next);
  }, function (next) {
    bet.match.populate('guest');
    bet.match.populate('host');
    bet.match.populate(next);
  }, function (next) {
    Match.update({'_id' : request.match._id}, {'$inc' : {
      'pot.guest' : (bet.result === 'guest' ? bet.bid : 0) - (oldResult === 'guest' ? oldBid : 0),
      'pot.host'  : (bet.result === 'host' ? bet.bid : 0) - (oldResult === 'host' ? oldBid : 0),
      'pot.draw'  : (bet.result === 'draw' ? bet.bid : 0) - (oldResult === 'draw' ? oldBid : 0)
    }}, next);
  }], function updatedBet(error) {
    if (error) {
      error = new VError(error, 'error updating bet: "$s"', bet._id);
      return next(error);
    }
    return response.status(200).send(bet);
  });
});

/**
 * @api {delete} /championships/:championship/matches/:match/bets/:id Removes bet from database
 * @apiName removeBet
 * @apiVersion 2.0.1
 * @apiGroup bet
 * @apiPermission user
 * @apiDescription
 * Removes bet from database
 */
router
.route('/championships/:championship/matches/:match/bets/:id')
.delete(auth.session())
.delete(function validateUserToRemove(request, response, next) {
  'use strict';

  var bet;
  bet = request.bet;
  if (request.session._id.toString() !== bet.user._id.toString()) {
    return response.status(405).end()
  }
  return next();
})
.delete(function removeBet(request, response, next) {
  'use strict';

  var bet, oldResult, oldBid;
  bet = request.bet;
  oldBid = bet.bid;
  oldResult = bet.result;
  return async.series([bet.remove.bind(bet), function (next) {
    Match.update({'_id' : request.match._id}, {'$inc' : {
      'pot.guest' : -(oldResult === 'guest' ? oldBid : 0),
      'pot.host'  : -(oldResult === 'host' ? oldBid : 0),
      'pot.draw'  : -(oldResult === 'draw' ? oldBid : 0)
    }}, next);
  }], function removedBet(error) {
    if (error) {
      error = new VError(error, 'error updating bet: "$s"', bet._id);
      return next(error);
    }
    return response.status(204).end();
  });
});

/**
 * @api {get} /user/:id/bets List all bets in database
 * @apiName listUserBet
 * @apiVersion 2.0.1
 * @apiGroup bet
 * @apiPermission user
 * @apiDescription
 * List all bets in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "vandoren",
 *       "user": {
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
 *       "match": {
 *         "slug": "brasilerao-brasil-2014-3-fluminense-vs-botafogo"
 *         "guest": {
 *           "name": "fluminense",
 *           "slug": "fluminense",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "host": {
 *           "name": "botafogo",
 *           "slug": "botafogo",
 *           "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *           "createdAt": "2014-07-01T12:22:25.058Z",
 *           "updatedAt": "2014-07-01T12:22:25.058Z"
 *         },
 *         "round": 3,
 *         "date": "2014-07-01T12:22:25.058Z",
 *         "finished": true,
 *         "elapsed": null,
 *         "result": {
 *           "guest": 0,
 *           "host" 0
 *         },
 *         "pot": {
 *           "guest": 0,
 *           "host" 0,
 *           "draw" 0
 *         },
 *         "winner": "draw",
 *         "jackpot": 0,
 *         "reward": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "bid": 50,
 *       "result": "draw",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/bets')
.get(auth.session())
.get(function listUserBets(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Bet.find();
  query.where('user').equals(request.user._id);
  query.populate('user');
  query.populate('match');
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedUserBet(error, bets) {
    if (error) {
      error = new VError(error, 'error finding bets');
      return next(error);
    }
    return Team.populate(bets, {'path' : 'match.guest match.host'}, function (error) {
      if (error) {
        error = new VError(error, 'error populating bets');
        return next(error);
      }
      return response.status(200).send(bets);
    });
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

router.param('id', auth.session());
router.param('id', function findBet(request, response, next, id) {
  'use strict';

  var query;
  query = Bet.findOne();
  query.populate('user');
  query.populate('match');
  query.where('match').equals(request.match._id);
  if (id === 'mine') {
    query.where('user').equals(request.session._id);
  } else {
    query.where('slug').equals(id);
  }
  query.exec(function foundBet(error, bet) {
    if (error) {
      error = new VError(error, 'error finding bet: "$s"', id);
      return next(error);
    }
    if (!bet) {
      return response.status(404).end();
    }
    bet.match.populate('guest');
    bet.match.populate('host');
    return bet.match.populate(function (error) {
      if (error) {
        error = new VError(error, 'error populating bet: "$s"', bet._id);
        return next(error);
      }
      request.bet = bet;
      return next();
    });
  });
});

router.param('match', function findMatch(request, response, next, id) {
  'use strict';

  var query;
  query = Match.findOne();
  query.where('championship').equals(request.championship._id);
  query.where('slug').equals(id);
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