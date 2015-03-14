'use strict';

var router, nconf, async, auth, push, crypto,
    Championship;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Championship = require('../models/championship');

/**
 * @api {GET} /championships listChampionship
 * @apiName listChampionship
 * @apiGroup Championship
 *
 * @apiExample HTTP/1.1 200
 * [{
 *   "_id": "54f8d8db89b71fc5d9dd47c1",
 *   "name": "brasileirão",
 *   "type": "national league",
 *   "country": "Brazil",
 *   "createdAt": "2015-03-05T22:29:47.133Z",
 *   "updatedAt": "2015-03-05T22:29:47.135Z"
 * }]
 */
router
.route('/championships')
.get(auth.session())
.get(function listChampionship(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
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
 * @api {GET} /championships/:championship getChampionship
 * @apiName getChampionship
 * @apiGroup Championship
 *
 * @apiExample HTTP/1.1 200
 * {
 *   "_id": "54f8d8db89b71fc5d9dd47c1",
 *   "name": "brasileirão",
 *   "type": "national league",
 *   "country": "Brazil",
 *   "createdAt": "2015-03-05T22:29:47.133Z",
 *   "updatedAt": "2015-03-05T22:29:47.135Z"
 * }
 */
router
.route('/championships/:championship')
.get(auth.session())
.get(function getChampionship(request, response, next) {
  async.waterfall([function (next) {
    var championship;
    championship = request.championship;
    response.status(200);
    response.send(championship);
    next();
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
