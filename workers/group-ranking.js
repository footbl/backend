/**
 * @module
 * Updates groups rankings
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
'use strict';
var mongoose, nconf, async, crypto,
    Group, Wallet;

mongoose = require('mongoose');
nconf    = require('nconf');
async    = require('async');
crypto   = require('crypto');
Group    = require('../models/group');
Wallet   = require('../models/wallet');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

var query;
query = Group.find();
query.populate('championship');
query.exec(function (error, groups) {
    async.each(groups, function (group, next) {
        var round;

        if (!group.championship.roundFinished) { return next(); }
        round = group.championship.currentRound;

        return async.sortBy(group.members, function (member, next) {
            var query;
            query = Wallet.findOne();
            query.where('championship').equals(group.championship);
            query.where('user').equals(member.user);
            query.exec(function (error, wallet) {
                member.rounds[round].points = wallet ? (wallet.funds / member.initialFunds) * 100 : 100;
                next(error, member.rounds[round].points * -1);
            });
        }, function (error, members) {
            members.forEach(function (member, index) {
                member.rounds[round].ranking = index + 1;
            });
            group.members = members;
            group.save(next);
        });
    }, process.exit);
});