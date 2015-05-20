'use strict';

var router, nconf, async, auth, push, crypto,
Championship, Match;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Championship = require('../models/championship');
Match = require('../models/match');

/**
 * @api {GET} /championships/:championship/matches listMatch
 * @apiName listMatch
 * @apiGroup Match
 *
 * @apiParam {String} [page=0] The page to be displayed.
 */
router
.route('/championships/:championship/matches')
.get(auth.session())
.get(function listMatch(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query, championship;
    championship = request.championship;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Match.find();
    query.where('championship').equals(championship._id);
    query.or([{'round' : {'$gte' : (championship.currentRound || 1) - 3}}, {'finished' : false}]);
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (matches, next) {
    response.status(200);
    response.send(matches);
    next();
  }], next);
});

/**
 * @api {GET} /championships/:championship/matches/:match getMatch
 * @apiName getMatch
 * @apiGroup Match
 */
router
.route('/championships/:championship/matches/:match')
.get(auth.session())
.get(function getMatch(request, response, next) {
  async.waterfall([function (next) {
    var match;
    match = request.match;
    response.status(200);
    response.send(match);
    next();
  }], next);
});

router.param('match', function findMatch(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Match.findOne();
    query.where('championship').equals(request.championship._id);
    query.where('_id').equals(id);
    query.exec(next);
  }, function (match, next) {
    request.match = match;
    next(!match ? new Error('not found') : null);
  }], next);
});

router.param('championship', function findChampionship(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Championship.findOne();
    query.where('_id').equals(id);
    query.exec(next);
  }, function (championship, next) {
    request.championship = championship;
    next(!championship ? new Error('not found') : null);
  }], next);
});

module.exports = router;
