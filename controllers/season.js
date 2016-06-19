'use strict';

var router = require('express').Router();
var async = require('async');
var Season = require('../models/season');

/**
 * @api {GET} /seasons List all seasons.
 * @apiName list
 * @apiGroup Season
 * @apiUse defaultPaging
 */
router
.route('/seasons')
.get(function (request, response, next) {
  async.waterfall([function (next) {
    Season.find().skip((request.query.page || 0) * 20).limit(20).sort({'finishAt' : -1}).exec(next);
  }, function (seasons) {
    response.status(200).send(seasons);
  }], next);
});

/**
 * @api {GET} /seasons/:id Get season.
 * @apiName get
 * @apiGroup Season
 */
router
.route('/seasons/:id')
.get(function (request, response) {
  response.status(200).send(request.season);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Season.findOne().where('_id').equals(id).exec(next);
  }, function (season, next) {
    request.season = season;
    next(!season ? new Error('not found') : null);
  }], next);
});

module.exports = router;
