'use strict';

var router, nconf, async, auth, push, crypto,
Season;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Season = require('../models/season');

/**
 * @api {GET} /seasons listSeason
 * @apiName listSeason
 * @apiGroup Season
 *
 * @apiParam {String} [page=0] The page to be displayed.
 */
router
.route('/seasons')
.get(auth.session())
.get(function listSeason(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Season.find();
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (seasons, next) {
    response.status(200);
    response.send(seasons);
    next();
  }], next);
});

/**
 * @api {GET} /seasons/:season getSeason
 * @apiName getSeason
 * @apiGroup Season
 */
router
.route('/seasons/:season')
.get(auth.session())
.get(function getSeason(request, response, next) {
  async.waterfall([function (next) {
    var season;
    season = request.season;
    response.status(200);
    response.send(season);
    next();
  }], next);
});

router.param('season', function findSeason(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Season.findOne();
    query.where('_id').equals(id);
    query.exec(next);
  }, function (season, next) {
    request.season = season;
    next(!season ? new Error('not found') : null);
  }], next);
});

module.exports = router;
