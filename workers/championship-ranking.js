/**
 * @module
 * Updates world ranking
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
'use strict';
var mongoose, nconf, async, crypto,
    User, Wallet, Championship;

mongoose     = require('mongoose');
nconf        = require('nconf');
async        = require('async');
crypto       = require('crypto');
Wallet       = require('../models/wallet');
Championship = require('../models/championship');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

Championship.find(function (error, championships) {
    async.each(championships, function (championship, next) {
        Wallet.find({'championship' : championship._id}, function (error, wallets) {
            async.sortBy(wallets, function (wallet, next) {
                next(error, -1 * wallet.funds);
            }, function (error, wallets) {
                wallets.forEach(function (wallet, index) {
                    wallet.ranking = index + 1;
                });
                async.each(wallets, function (wallet, next) {
                    wallet.save(next);
                }, next);
            });
        });
    }, process.exit);
});