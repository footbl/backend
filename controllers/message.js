'use strict';

var router = require('express').Router();
var async = require('async');
var Message = require('../models/message');

/**
 * @api {post} /messages Creates a message.
 * @apiName create
 * @apiGroup Message
 *
 * @apiParam {String} rom
 * @apiParam {String} [message]
 * @apiParam {String} [type]
 * @apiParam {ObjectId[]} visibleTo
 */
router
.route('/messages')
.post(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    var message = new Message();
    message.user = request.session;
    message.room = request.body.room;
    message.message = request.body.message;
    message.type = request.body.type;
    message.seenBy = [request.session];
    message.visibleTo = (request.body.visibleTo || []).concat(request.session);
    message.save(next);
  }, function (message) {
    response.status(201).send(message.id);
  }], next);
});

/**
 * @api {get} /messages List all messages.
 * @apiName list
 * @apiGroup Message
 */
router
.route('/messages')
.get(function (request, response) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    Message.find()
    .where('visibleTo').equals(request.session.id)
    .skip((request.query.page || 0) * 20).limit(20).exec(next);
  }, function (messages) {
    response.status(200).send(messages);
  }]);
});

/**
 * @api {put} /messages/all/mark-as-read Mark all messages as read.
 * @apiName markAllAsRead
 * @apiGroup Message
 *
 * @apiParam {String} rom
 */
router
.route('/messages/all/mark-as-read')
.put(function (request, response, next) {
  if (!request.session) throw new Error('invalid session');
  async.waterfall([function (next) {
    var query = Message.find()
    .where('visibleTo').equals(request.session.id);
    if (request.body.room) query.where('room').equals(request.body.room);
    query.exec(next);
  }, function (messages, next) {
    async.map(messages, function (message, next) {
      message.update({'$addToSet' : {'seenBy' : request.session.id}}).exec(next);
    }, next);
  }, function () {
    response.status(200).end();
  }], next);
});

module.exports = router;
