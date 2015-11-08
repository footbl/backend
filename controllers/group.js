'use strict';

var router = require('express').Router();
var async = require('async');
var Group = require('../models/group');

/**
 * @api {post} /groups Creates a new group.
 * @apiName create
 * @apiGroup Group
 * @apiUse defaultHeaders
 *
 * @apiParam {String} name
 * @apiParam {String} [picture]
 */
router
.route('/groups')
.post(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    var group = new Group();
    group.name = request.body.name;
    group.code = new Date().getTime().toString(36).substring(3);
    group.owner = request.session;
    group.picture = request.body.picture;
    group.members = [request.session._id];
    group.save(next);
  }, function (group) {
    response.status(201).send(group.id);
  }], next);
});

/**
 * @api {get} /groups List all groups.
 * @apiName list
 * @apiGroup Group
 * @apiUse defaultHeaders
 * @apiUse defaultPaging
 *
 * @apiParam {String} filterByCode
 */
router
.route('/groups')
.get(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    var query = Group.find().skip((request.query.page || 0) * 20).limit(20);
    if (request.query.filterByCode) query.where('code').equals(request.query.filterByCode);
    query.exec(next);
  }, function (groups) {
    response.status(200).send(groups);
  }], next);
});

/**
 * @api {get} /groups/:id Get group.
 * @apiName get
 * @apiGroup Group
 * @apiUse defaultHeaders
 */
router
.route('/groups/:id')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  response.status(200).send(request.group);
});

/**
 * @api {put} /groups/:id Updates group.
 * @apiName update
 * @apiGroup Group
 * @apiUse defaultHeaders
 *
 * @apiParam {String} name
 * @apiParam {String} [picture]
 */
router
.route('/groups/:id')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.group.owner.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    var group = request.group;
    group.name = request.body.name;
    group.picture = request.body.picture;
    group.save(next);
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {delete} /groups/:id Removes group.
 * @apiName remove
 * @apiGroup Group
 * @apiUse defaultHeaders
 */
router
.route('/groups/:id')
.delete(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.group.owner.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    request.group.remove(next);
  }, function () {
    response.status(204).end();
  }], next);
});

/**
 * @api {put} /groups/:id/invite Invites user to group.
 * @apiName invite
 * @apiGroup Group
 * @apiUse defaultHeaders
 *
 * @apiParam {String} user
 */
router
.route('/groups/:id/invite')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  if (request.session.id !== request.group.owner.id) throw new Error('invalid method');
  async.waterfall([function (next) {
    if ((/^[0-9a-fA-F]{24}$/).test(request.body.user)) {
      request.group.update({'$addToSet' : {'members' : request.body.user}}).exec(next);
    } else {
      request.group.update({'$addToSet' : {'invites' : request.body.user}}).exec(next);
    }
  }, function () {
    response.status(200).end();
  }], next);
});

/**
 * @api {put} /groups/:id/leave Leaves group.
 * @apiName leave
 * @apiGroup Group
 * @apiUse defaultHeaders
 */
router
.route('/groups/:id/leave')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    request.group.update({'$pull' : {'members' : request.session._id}}, next);
  }, function () {
    response.status(200).end();
  }], next);
});

router.param('id', function (request, response, next, id) {
  async.waterfall([function (next) {
    Group.findOne().where('_id').equals(id).exec(next);
  }, function (group, next) {
    request.group = group;
    next(!group ? new Error('not found') : null);
  }], next);
});

module.exports = router;
