/**
 * @module
 * Send match about to end notification
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
'use strict';
var mongoose, nconf, async, crypto, date,
    User, Wallet, Match;

mongoose = require('mongoose');
nconf    = require('nconf');
async    = require('async');
crypto   = require('crypto');
User     = require('../models/user');
Wallet   = require('../models/wallet');
Match    = require('../models/match');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

date = new Date();
date.setMinutes(date.getMinutes() - 80);

var query;
query = Match.find();
query.where('date').lt(date);
query.where('finished').equals(false);
query.exec(function (error, matches) {
    async.reduce(matches, function (championships, match, next) {
        if (championships.indexOf(match.championship.toString()) === -1) {
            championships.push(match.championship.toString());
        }
        next(null, championships);
    }, function (error, championships) {
        async.each(championships, function (championship, next) {
            var query;
            query = Wallet.find();
            query.where('championship').equals(championship);
            query.populate('user');
            query.exec(function (error, wallets) {
                async.each(wallets, function (wallet, next) {
                    if (wallet.user.apnsToken) {
                        require('../lib/apn').push(wallet.user.apnsToken, {
                            'loc-key' : 'NOTIFICATION_ROUND_END',
                            'loc-args' : [wallet.user.username]
                        });
                    }
                    next();
                }, next);
            });
        }, function (error) {

        });
    });
});