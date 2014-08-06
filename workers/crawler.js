'use strict';
var VError, mongoose, nconf, request, async, slug, championships, Championship, Match, Team, now;

VError = require('verror');
mongoose = require('mongoose');
nconf = require('nconf');
request = require('request');
async = require('async');
slug = require('slug');
championships = [];
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

now = new Date();

championships.push({
    'name'               : 'brasileirão',
    'country'            : 'brasil',
    'type'               : 'national league',
    'picture'            : '',
    'edition'            : 2014,
    '365scoresCountryId' : 21,
    '365scoresCompId'    : 113
});

module.exports = function (next) {
    async.map(championships, function (championship, next) {
        async.waterfall([function (next) {
            Championship.findOneAndUpdate({
                'name'    : championship.name,
                'country' : championship.country,
                'type'    : championship.type,
                'edition' : championship.edition
            }, {'$set' : {
                'slug'    : slug(championship.name) + '-' + slug(championship.country) + '-' + championship.edition,
                'name'    : championship.name,
                'country' : championship.country,
                'type'    : championship.type,
                'edition' : championship.edition
            }}, {'upsert' : true}, next);
        }, function (champ, next) {
            championship._id = champ._id;
            request('http://ws.365scores.com?action=1&Sid=1&curr_season=true&CountryID=' + championship['365scoresCountryId'], next);
        }, function (response, body, next) {
            var matches;
            matches = JSON.parse(body).Games;
            async.each(matches.filter(function (match) {
                return match.Comp === championship['365scoresCompId'];
            }), function (data, next) {
                var guest, guestId, host, hostId, round, dateMask, date, finished, elapsed, guestScore, hostScore;
                host = data.Comps[0].Name;
                guest = data.Comps[1].Name;
                round = data.Round;
                dateMask = data.STime.split(/-|\s|:/).map(Number);
                date = new Date(dateMask[2], dateMask[1] - 1, dateMask[0], dateMask[3], dateMask[4]);
                finished = !data.Active && data.GT !== -1;
                elapsed = data.Active ? data.GT : null;
                hostScore = (data.Events || []).filter(function (event) {
                    return event.Type === 0 && event.Comp === 1;
                }).length;
                guestScore = (data.Events || []).filter(function (event) {
                    return event.Type === 0 && event.Comp === 2;
                }).length;
                async.waterfall([function (next) {
                    Team.findOneAndUpdate({
                        'name' : guest
                    }, {'$set' : {
                        'slug' : slug(guest),
                        'name' : guest
                    }}, {'upsert' : true}, next);
                }, function (team, next) {
                    guestId = team._id;
                    next();
                }, function (next) {
                    Team.findOneAndUpdate({
                        'name' : host
                    }, {'$set' : {
                        'slug' : slug(host),
                        'name' : host
                    }}, {'upsert' : true}, next);
                }, function (team, next) {
                    hostId = team._id;
                    next();
                }, function (next) {
                    Match.findOneAndUpdate({
                        'guest'        : guestId,
                        'host'         : hostId,
                        'round'        : round,
                        'championship' : championship._id
                    }, {'$set' : {
                        'slug'         : 'round-' + round + '-' + slug(host) + '-vs-' + slug(guest),
                        'guest'        : guestId,
                        'host'         : hostId,
                        'round'        : round,
                        'championship' : championship._id,
                        'date'         : date,
                        'finished'     : finished,
                        'elapsed'      : elapsed,
                        'score'        : {
                            'guest' : guestScore,
                            'host'  : hostScore
                        }
                    }}, {'upsert' : true}, next);
                }], next);
            }, next);
        }], next);
    }, next);
};

if (require.main === module) {
    mongoose.connect(nconf.get('MONGOHQ_URL'));
    async.whilst(function () {
        return Date.now() - now.getTime() < 1000 * 60 * 10;
    }, module.exports, process.exit);
}