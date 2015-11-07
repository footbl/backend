'use strict';

var router = require('express').Router();
var async = require('async');
var Match = require('../models/match');

/**
 * @api {GET} /matches List all matches.
 * @apiName list
 * @apiGroup Match
 *
 * @apiParam {ObjectId} filterByChampionship
 * @apiParam {Number} filterByRound
 */
router
.route('/matches')
.get(function (request, response, next) {
  async.waterfall([function (next) {
    var query = Match.find().skip((request.query.page || 0) * 20).limit(20);
    if (request.query.filterByChampionship) query.where('championship').equals(request.query.filterByChampionship);
    if (request.query.filterByRound) query.where('round').equals(request.query.filterByRound);
    query.exec(next);
  }, function (matches) {
    response.status(200).send(matches);
  }], next);
});

/**
 * @api {GET} /matches/:id Get match.
 * @apiName get
 * @apiGroup Match
 */
router
.route('/matches/:id')
.get(function (request, response) {
  response.status(200).send(request.match);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Match.findOne().where('_id').equals(id).exec(next);
  }, function (match, next) {
    request.match = match;
    next(!match ? new Error('not found') : null);
  }], next);
});

module.exports = router;
