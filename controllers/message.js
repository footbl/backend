'use strict';

var router, nconf, async, auth, push, crypto,
    Message, Group;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Message = require('../models/message');
Group = require('../models/group');

/**
 * @api {POST} /groups/:group/messages createMessage
 * @apiName createMessage
 * @apiGroup Message
 *
 * @apiParam {String} [message] Message message.
 * @apiParam {String} [type] Message type.
 *
 * @apiExample HTTP/1.1 201
 * {
 *   "_id": "54f8eca8b00be0dbdc112dda",
 *   "user": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "message": "test",
 *   "seenBy": [],
 *   "createdAt": "2015-03-05T23:54:16.846Z",
 *   "updatedAt": "2015-03-05T23:54:16.847Z"
 * }
 */
router
.route('/groups/:group/messages')
.post(auth.session())
.post(function createMessage(request, response, next) {
  async.waterfall([function (next) {
    var message;
    message = new Message();
    message.group = request.group._id;
    message.user = request.session._id;
    message.message = request.body.message;
    message.type = request.body.type;
    message.seenBy = [request.session._id];
    message.save(next);
  }, function (message, _, next) {
    response.status(201);
    response.send(message);
    async.filter(request.group.members, function (member, next) {
      next(member.notifications);
    }, function (members) {
      next(null, members);
    });
  }, function (members, next) {
    async.each(request.group.members, function (member, next) {
      push(nconf.get('ZEROPUSH_TOKEN'), {
        'device' : member.user.apnsToken,
        'alert'  : {
          'loc-key'  : 'NOTIFICATION_GROUP_MESSAGE',
          'loc-args' : [request.session.username, request.group._id]
        }
      }, next);
    }, next);
  }], next);
});

/**
 * @api {GET} /groups/:group/messages listMessage
 * @apiName listMessage
 * @apiGroup Message
 *
 * @apiExample HTTP/1.1 200
 * [{
 *   "_id": "54f8eca8b00be0dbdc112dda",
 *   "user": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "message": "test",
 *   "seenBy": [],
 *   "createdAt": "2015-03-05T23:54:16.846Z",
 *   "updatedAt": "2015-03-05T23:54:16.847Z"
 * }]
 */
router
.route('/groups/:group/messages')
.get(auth.session())
.get(function listMessage(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Message.find();
    query.where('group').equals(request.group._id);
    query.sort('-createdAt');
    query.populate('user');
    if (request.body.unreadMessages) query.where('seenBy').ne(request.session._id);
    query.skip(page);
    query.limit(pageSize);
    query.exec(next);
  }, function (messages, next) {
    response.status(200);
    response.send(messages);
    next();
  }], next);
});

/**
 * @api {PUT} /groups/:group/messages/all/mark-as-read markAllAsReadMessage
 * @apiName markAllAsReadMessage
 * @apiGroup Message
 *
 * @apiExample HTTP/1.1 200
 * [{
 *   "_id": "54f8eca8b00be0dbdc112dda",
 *   "user": {
 *     "_id": "54f8dc3944fb8faeda457409",
 *     "username": "roberval",
 *     "verified": false,
 *     "featured": false,
 *     "ranking": null,
 *     "previousRanking": null,
 *     "history": [],
 *     "active": true,
 *     "country": "Brazil",
 *     "stake": 0,
 *     "funds": 100,
 *     "entries": [],
 *     "starred": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "message": "test",
 *   "seenBy": [],
 *   "createdAt": "2015-03-05T23:54:16.846Z",
 *   "updatedAt": "2015-03-05T23:54:16.847Z"
 * }]
 */
router
.route('/groups/:group/messages/all/mark-as-read')
.put(auth.session())
.put(function markAllAsReadMessage(request, response, next) {
  async.waterfall([function (next) {
    var query, group;
    query = Message.find();
    group = request.group;
    query.where('group').equals(group._id);
    query.exec(next);
  }, function (messages, next) {
    async.map(messages, function (message, next) {
      message.seenBy.push(request.session._id);
      message.save(next);
    }, next);
  }, function (messages, next) {
    response.status(200);
    response.send(messages);
    next();
  }], next);
});

router.param('group', function findGroup(request, response, next, id) {
  async.waterfall([function (next) {
    var query;
    query = Group.findOne();
    query.where('_id').equals(id);
    query.exec(next);
  }, function (group, next) {
    request.group = group;
    next(!group ? new Error('not found') : null);
  }], next);
});

module.exports = router;