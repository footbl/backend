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

/**
 * @api {GET} /championships
 * @apiName listChampionship
 * @apiGroup Championship
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
 * @api {GET} /championships/:championship
 * @apiName getChampionship
 * @apiGroup Championship
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