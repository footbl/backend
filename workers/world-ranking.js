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
User         = require('../models/user');
Wallet       = require('../models/wallet');
Championship = require('../models/championship');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

Championship.findOne({'type' : 'world cup'}, function (error, championship) {
    User.find(function (error, users) {
        async.sortBy(users, function (user, next) {
            var query;
            query = Wallet.findOne();
            query.where('championship').equals(championship._id);
            query.where('user').equals(user._id);
            query.exec(function (error, wallet) { next(error, (wallet ? wallet.funds : 0) * -1); });
        }, function (error, users) {
            var stack = [];
            users.forEach(function (user, index) {
                var oldRanking, currentRanking;
                oldRanking     = user.leaderboard.worldwide;
                currentRanking = index + 1;
                user.leaderboard.worldwide = currentRanking;
                if (oldRanking !== currentRanking) {
                    stack.push(user.save.bind(user));
                }
            });
            async.parallel(stack, process.exit);
        });
    });
});