var matchApi, teamApi,
    Championship, Match, Team,
    nconf, mongoose, async, championship;

mongoose = require('mongoose');
nconf    = require('nconf');
async    = require('async');

nconf.argv();
nconf.env();
nconf.defaults(require('../../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

matchApi     = require('./match');
teamApi      = require('./team');
Championship = require('../../models/championship');
Match        = require('../../models/match');
Team         = require('../../models/team');

async.timesSeries(20, function (n, next) {
    async.seq(function (next) {
        teamApi.find(next);
    }, function (teams, next) {
        async.each(teams, function (team, next) {
            Team.update({'name' : team.name}, {'name' : team.name, 'picture' : team.logo}, {'upsert' : true}, next);
        }, next);
    }, function (next) {
        Championship.findOneAndUpdate({
            'name'    : "World Cup"
        }, {'$set' : {
            'country' : "International",
            'edition' : 2014,
            'name'    : "World Cup",
            'picture' : "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
            'type'    : "world cup"
        }}, {
            'upsert' : true
        }, function (error, champ) {
            if (error) { process.exit(); }
            championship = champ;
            next();
        });
    }, function (next) {
        async.parallel([matchApi.findPreGame, matchApi.findInProgress, matchApi.findInFinal], next);
    }, function (results, next) {
        async.reduce(results, [], function (memo, item, next) {
            next(null, memo.concat(item));
        }, next);
    }, function (matches, next) {
        async.map(matches, function (match, next) {
            teamApi.findById(match.awayTeamId, function (error, team) {
                if (error) { next(error); }
                Team.findOne({'name' : team.name}, function (error, team) {
                    if (error) { next(error); }
                    match.guest = team ? team._id : null;
                    next(null, match);
                });
            });
        }, next);
    }, function (matches, next) {
        async.map(matches, function (match, next) {
            teamApi.findById(match.homeTeamId, function (error, team) {
                if (error) { process.exit(); }
                Team.findOne({'name' : team.name}, function (error, team) {
                    if (error) { next(error); }
                    match.host = team ? team._id : null;
                    next(null, match);
                });
            });
        }, next);
    }, function (matches, next) {
        async.map(matches, function (match, next) {
            match.championship = championship._id;
            next(null, match);
        }, next);
    }, function (matches, next) {
        var guestRound;
        guestRound = {};
        matches.sort(function (a, b) {
            if (a.startTime > b.startTime) return 1;
            if (a.startTime < b.startTime) return -1;
            return 0;
        }).forEach(function (match) {
                if (!guestRound[match.guest]) { guestRound[match.guest] = 0; }
                if (!guestRound[match.host]) { guestRound[match.host] = 0; }
                guestRound[match.guest] += 1;
                guestRound[match.host] += 1;
                match.round = guestRound[match.guest > match.host ? match.guest : match.host];
            });
        next(null, matches);
    }, function (matches, next) {
        async.each(matches, function (match, next) {
            var elapsed;
            if (match.currentGameMinute) {
                elapsed = match.currentGameMinute;
            } else if (new Date() > new Date(match.startTime) && match.status === 'Pre-game') {
                elapsed = 90;
            } else {
                elapsed = null;
            }
            Match.update({
                'guest'        : match.guest,
                'host'         : match.host,
                'round'        : match.round,
                'championship' : match.championship
            }, {
                'guest'        : match.guest,
                'host'         : match.host,
                'round'        : match.round,
                'championship' : match.championship,
                'elapsed'      : elapsed,
                'date'         : match.startTime,
                'finished'     : match.status === 'Final',
                'result'       : {
                    'guest' : match.awayScore,
                    'host'  : match.homeScore
                }
            }, {
                'upsert' : true
            }, next);
        }, next);
    }, function () {
        setTimeout(next, 30000);
    })();
}, process.exit);