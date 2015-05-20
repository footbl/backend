'use strict';

var router, nconf, async, auth, push, crypto,
Group;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Group = require('../models/group');

/**
 * @api {POST} /groups createGroup
 * @apiName createGroup
 * @apiGroup Group
 *
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture.
 */
router
.route('/groups')
.post(auth.session())
.post(function createGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = new Group();
    group.name = request.body.name;
    group.code = new Date().getTime().toString(36).substring(3);
    group.owner = request.session._id;
    group.picture = request.body.picture;
    group.members = [request.session._id];
    group.save(next);
  }, function (group, _, next) {
    group.populate('owner');
    group.populate('members');
    group.populate(next);
  }, function (group, next) {
    response.status(201);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {GET} /groups listGroup
 * @apiName listGroup
 * @apiGroup Group
 *
 * @apiParam {String} [page=0] The page to be displayed.
 */
router
.route('/groups')
.get(auth.session())
.get(function listGroup(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Group.find();
    query.populate('owner');
    query.populate('members');
    query.skip(page);
    query.limit(pageSize);
    if (request.query.featured) query.where('featured').equals(true);
    else if (request.query.code) query.where('code').equals(request.query.code);
    else query.where('members').equals(request.session._id);
    query.exec(next);
  }, function (groups, next) {
    response.status(200);
    response.send(groups);
    next();
  }], next);
});

/**
 * @api {GET} /groups/:group getGroup
 * @apiName getGroup
 * @apiGroup Group
 */
router
.route('/groups/:group')
.get(auth.session())
.get(function getGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    response.status(200);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {PUT} /groups/:group updateGroup
 * @apiName updateGroup
 * @apiGroup Group
 *
 * @apiParam {String} name Group name.
 * @apiParam {String} [picture] Group picture.
 */
router
.route('/groups/:group')
.put(auth.session())
.put(function updateGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    group.name = request.body.name;
    group.picture = request.body.picture;
    group.save(next);
  }, function (group, _, next) {
    group.populate('owner');
    group.populate('members');
    group.populate(next);
  }, function (group, next) {
    response.status(200);
    response.send(group);
    next();
  }], next);
});

/**
 * @api {DELETE} /groups/:group removeGroup
 * @apiName removeGroup
 * @apiGroup Group
 */
router
.route('/groups/:group')
.delete(auth.session())
.delete(function removeGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    group.remove(next);
  }, function (_, next) {
    response.status(204);
    response.end();
    next();
  }], next);
});

/**
 * @api {POST} /groups/:group/invite inviteGroup
 * @apiName inviteGroup
 * @apiGroup Group
 *
 * @apiParam {String} user Invited user.
 */
router
.route('/groups/:group/invite')
.post(auth.session())
.post(function inviteGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    if ((/^[0-9a-fA-F]{24}$/).test(request.body.user)) group.update({'$addToSet' : {'members' : request.body.user}}, next);
    else group.update({'$addToSet' : {'invites' : request.body.user}}, next);
  }, function (__, _, next) {
    response.status(200);
    response.end();
    next();
  }], next);
});

/**
 * @api {DELETE} /groups/:group/leave leaveGroup
 * @apiName leaveGroup
 * @apiGroup Group
 */
router
.route('/groups/:group/leave')
.delete(auth.session())
.delete(function leaveGroup(request, response, next) {
  async.waterfall([function (next) {
    var group;
    group = request.group;
    group.update({'$pull' : {'members' : request.session._id}}, next);
  }, function (group, _, next) {
    response.status(200);
    response.end();
    next();
  }], next);
});

router.param('group', function findGroup(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Group.findOne();
    query.where('_id').equals(id);
    query.populate('owner');
    query.populate('members');
    query.exec(next);
  }, function (group, next) {
    request.group = group;
    next(!group ? new Error('not found') : null);
  }], next);
});

module.exports = router;
