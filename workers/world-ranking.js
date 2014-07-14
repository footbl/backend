'use strict';
var mongoose, nconf, async, User;

mongoose = require('mongoose');
nconf = require('nconf');
async = require('async');
User = require('../models/user');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

module.exports = function (next) {
    async.waterfall([function (next) {
        var query;
        query = User.find();
        query.or([
            {'email' : {'$exists' : true}},
            {'facebookId' : {'$exists' : true}}
        ]);
        query.exec(next);
    }, function (users, next) {
        async.sortBy(users, function (user, next) {
            next(null, user.funds * -1);
        }, next);
    }, function (users, next) {
        var ranking;
        ranking = 1;
        async.eachSeries(users, function (user, next) {
            user.ranking = ranking;
            ranking += 1;
            user.save(next);
        }, next);
    }], next);
};

if (require.main === module) {
    mongoose.connect(nconf.get('MONGOHQ_URL'));
    module.exports(process.exit);
}