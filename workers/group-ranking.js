/**
 * @module
 * Updates groups rankings
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
'use strict';
var mongoose, nconf, async, crypto,
    Championship, User, Group, Wallet;

mongoose     = require('mongoose');
nconf        = require('nconf');
async        = require('async');
crypto       = require('crypto');
Group        = require('../models/group');
Wallet       = require('../models/wallet');
Championship = require('../models/championship');
User         = require('../models/user');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

var query;
query = Group.find();
query.populate('championship');
query.populate('members.user');
query.exec(function (error, groups) {
    async.each(groups, function (group, next) {
        var round;

        if (!group.championship.roundFinished) { return next(); }
        round = group.championship.currentRound - 1;

        return async.sortBy(group.members.filter(function (member) {
            return member.user && (member.user.username || member.user.facebookId || member.user.email);
        }), function (member, next) {
            var query;
            query = Wallet.findOne();
            query.where('championship').equals(group.championship);
            query.where('user').equals(member.user);
            query.exec(function (error, wallet) {
                while (member.rounds.length <= round) {
                    member.rounds.push({ranking : Infinity, funds : 100});
                }
                member.rounds[round].funds = wallet ? wallet.funds : 100;
                next(error, member.rounds[round].funds * -1);
            });
        }, function (error, members) {
            members.forEach(function (member, index) {
                member.rounds[round].ranking = index + 1;
            });
            group.members = members;
            console.log(group.members);
            group.save(function (error) {
                console.log(error);
                next();
            });
        });
    }, process.exit);
});