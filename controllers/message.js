'use strict';

var router, nconf, async, auth, push, crypto,
    Message;

router = require('express').Router();
nconf = require('nconf');
async = require('async');
auth = require('auth');
push = require('push');
crypto = require('crypto');

Message = require('../models/message');

/**
 * @api {POST} /rooms/:room/messages createMessage
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
 *     "country": "Brazil",
 *     "entries": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "message": "test",
 *   "createdAt": "2015-03-05T23:54:16.846Z",
 *   "updatedAt": "2015-03-05T23:54:16.847Z"
 * }
 */
router
.route('/rooms/:room/messages')
.post(auth.session())
.post(function createMessage(request, response, next) {
  async.waterfall([function (next) {
    var message;
    message = new Message();
    message.room = request.params.room;
    message.user = request.session._id;
    message.message = request.body.message;
    message.type = request.body.type;
    message.seenBy = [request.session._id];
    message.save(next);
  }, function (message, _, next) {
    response.status(201);
    response.send(message);
    next();
  }], next);
});

/**
 * @api {GET} /rooms/:room/messages listMessage
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
 *     "country": "Brazil",
 *     "entries": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "message": "test",
 *   "createdAt": "2015-03-05T23:54:16.846Z",
 *   "updatedAt": "2015-03-05T23:54:16.847Z"
 * }]
 */
router
.route('/rooms/:room/messages')
.get(auth.session())
.get(function listMessage(request, response, next) {
  async.waterfall([function (next) {
    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = (request.query.page || 0) * pageSize;
    query = Message.find();
    query.where('room').equals(request.params.room);
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
 * @api {PUT} /rooms/:room/messages/all/mark-as-read markAllAsReadMessage
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
 *     "country": "Brazil",
 *     "entries": [],
 *     "createdAt": "2015-03-05T22:44:09.131Z",
 *     "updatedAt": "2015-03-05T22:44:09.898Z"
 *   },
 *   "message": "test",
 *   "createdAt": "2015-03-05T23:54:16.846Z",
 *   "updatedAt": "2015-03-05T23:54:16.847Z"
 * }]
 */
router
.route('/rooms/:room/messages/all/mark-as-read')
.put(auth.session())
.put(function markAllAsReadMessage(request, response, next) {
  async.waterfall([function (next) {
    var query;
    query = Message.find();
    query.where('room').equals(request.params.room);
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

module.exports = router;
