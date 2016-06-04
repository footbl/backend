'use strict';

var router = require('express').Router();
var async = require('async');
var Badge = require('../models/badge');

/**
 * @api {GET} /badges List all badges.
 * @apiName list
 * @apiGroup Badge
 * 
 * @apiParam {ObjectId} filterByUser
 */
router
.route('/badges')
.get(function (request, response, next) {
  async.waterfall([function (next) {
    var query = Badge.find().skip((request.query.page || 0) * 20).limit(20)
    if (request.query.filterByUser) query.where('user').equals(request.query.filterByUser);
    query.exec(next);
  }, function (badges) {
    response.status(200).send(badges);
  }], next);
});

/**
 * @api {GET} /badges/:id Get badge.
 * @apiName get
 * @apiGroup Badge
 */
router
.route('/badges/:id')
.get(function (request, response) {
  response.status(200).send(request.badge);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Badge.findOne().where('_id').equals(id).exec(next);
  }, function (badge, next) {
    request.badge = badge;
    next(!badge ? new Error('not found') : null);
  }], next);
});

module.exports = router;
