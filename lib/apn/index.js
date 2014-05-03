/**
 * @module
 * Manages apns connection
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
var apn, nconf, stream;

apn    = require('apn');
nconf  = require('nconf');
stream = new apn.Connection({
    'gateway'    : nconf.get('APNS_GATEWAY'),
    'cert'       : require('fs').readFileSync(__dirname + '/certificates/' + nconf.get('APNS_CERT')),
    'key'        : require('fs').readFileSync(__dirname + '/certificates/' + nconf.get('APNS_KEY')),
    'passphrase' : nconf.get('APNS_PASSPHRASE')
});

/**
 * @method
 * @summary Sends a push notification.
 *
 * @param token
 * @param alert
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
exports.push = function (token, alert) {
    'use strict';

    var device, notification;
    device = new apn.Device(token);
    notification = new apn.Notification();
    notification.sound = "1.aiff";
    notification.alert = alert;
    stream.pushNotification(notification, device);
};