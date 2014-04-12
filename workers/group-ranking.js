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

Group.find(function (error, groups) {
    async.each(groups, function (group, next) {
        async.sortBy(group.members, function (member, next) {
            var query;
            query = Wallet.findOne();
            query.where('championship').equals(group.championship);
            query.where('user').equals(member.user);
            query.exec(function (error, wallet) { next(error, (wallet ? wallet.funds - member.initialFunds : 0) * -1); });
        }, function (error, members) {
            var oldMD5, currentMD5;
            members.forEach(function (member, index) { member.ranking = index + 1; });
            oldMD5        = crypto.createHash('md5').update(JSON.stringify(group.members)).digest('hex');
            currentMD5    = crypto.createHash('md5').update(JSON.stringify(members)).digest('hex');
            group.members = members;
            if (oldMD5 !== currentMD5) { group.save(); }
            next(error);
        });
    }, process.exit);
});