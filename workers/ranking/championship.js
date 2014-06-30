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
Wallet       = require('../../models/wallet');
Championship = require('../../models/championship');
User         = require('../../models/user');

nconf.argv();
nconf.env();
nconf.defaults(require('../../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

var query;
query = Championship.find();
query.exec(function (error, championships) {
    async.each(championships, function (championship, next) {
        var round, query;
        round = championship.currentRound - 1;
        query = Wallet.find();
        query.where('championship').equals(championship._id);
        query.populate('user');
        query.populate('bets.match');
        return query.exec(function (error, wallets) {
            async.sortBy(wallets.filter(function (wallet) {
                return wallet.user && (wallet.user.username || wallet.user.facebookId || wallet.user.email);
            }), function (wallet, next) {
                while (wallet.rounds.length <= round) {
                    wallet.rounds.push({ranking : Infinity, funds : 100});
                }
                wallet.rounds[round].funds = wallet ? wallet.funds : 100;
                wallet.rounds[round].date  = new Date();
                next(error, wallet.rounds[round].funds * -1);
            }, function (error, wallets) {
                wallets.forEach(function (wallet, index) {
                    wallet.rounds[round].ranking = index + 1;
                });
                async.each(wallets, function (wallet, next) {
                    Wallet.update({_id : wallet._id}, {$set : {rounds : wallet.rounds}}, next);
                }, next);
            });
        });
    }, process.exit);
});