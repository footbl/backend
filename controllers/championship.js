'use strict';

var router = require('express').Router();
var async = require('async');
var Championship = require('../models/championship');

/**
 * @api {GET} /championships List all championships.
 * @apiName list
 * @apiGroup Championship
 */
router
.route('/championships')
.get(function (request, response, next) {
  async.waterfall([function (next) {
    Championship.find().skip((request.query.page || 0) * 20).limit(20).exec(next);
  }, function (championships) {
    response.status(200).send(championships);
  }], next);
});

/**
 * @api {GET} /championships/:id Get championship.
 * @apiName get
 * @apiGroup Championship
 */
router
.route('/championships/:id')
.get(function (request, response) {
  response.status(200).send(request.championship);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Championship.findOne().where('_id').equals(id).exec(next);
  }, function (championship, next) {
    request.championship = championship;
    next(!championship ? new Error('not found') : null);
  }], next);
});

module.exports = router;
