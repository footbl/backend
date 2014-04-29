/**
 * @module
 * Update matches scores
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
'use strict';
var mongoose, nconf, async, cheerio, request, querystring,
    Team, Championship, Match;

mongoose     = require('mongoose');
nconf        = require('nconf');
async        = require('async');
cheerio      = require('cheerio');
request      = require('request');
querystring  = require('querystring');
Championship = require('../models/championship');
Match        = require('../models/match');
Team         = require('../models/team');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

/**
 * @method
 * @summary Removes garbage from championship name
 *
 * @param title
 *
 * @returns String championshipName
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function championshipName(title) {
    return title.split(' grp. ')[0];
}

/**
 * @method
 * @summary Loads HTML page from crawled website
 *
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function loadPage(next) {
    var query = querystring.encode({'showLeagues' : 'all', 'd' : '0'});
    request(nconf.get('CRAWLER_URI') + '?' + query, function (error, response, body) {
        var $, result;
        $      = cheerio.load(body);
        result = [];
        $('tr').each(function () {
            result.push($(this));
        });
        next(error, result);
    });
}

/**
 * @method
 * @summary Parse crawled table rows of matches into match objects
 *
 * @param records
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseMatches(records, next) {
    var name, country, matches;

    matches = [];
    records.forEach(function (record) {
        var heading, date, time, score;
        heading = record.children().first().hasClass('Heading');
        if (heading) {
            name    = championshipName(record.children().first().text().split(' - ')[1]);
            country = record.children().first().text().split(' - ')[0];
        } else {
            if (record.children().first().text().indexOf(':') > -1) {
                date = new Date();
                time = record.children().first().text().split(':');
                date.setSeconds(0);
                date.setUTCHours(time[0]);
                date.setUTCMinutes(time[1]);
            }
            score = record.children().first().next().next().text().split(' - ');
            matches.push({
                'round'        : 1,
                'championship' : {
                    'name'    : name,
                    'country' : country
                },
                'date'         : date,
                'guest'        : record.children().first().next().text(),
                'host'         : record.children().first().next().next().next().text(),
                'finished'     : record.children().first().text() === 'FT',
                'result'       : {
                    'guest' : Number(score[0]) || 0,
                    'host'  : Number(score[1]) || 0
                }
            });
        }
    });
    next(null, matches);
}

/**
 * @method
 * @summary Takes all matches host objectIds
 *
 * @param matches
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function retrieveHost(matches, next) {
    async.map(matches, function (match, next) {
        var query;
        query = Team.findOne();
        query.where('name').equals(match.host);
        query.exec(function (error, team) {
            if (error) { return next(error); }
            if (!team) { return next('host not found'); }
            match.host = team._id;
            return next(null, match);
        });
    }, next.bind({}));
}

/**
 * @method
 * @summary Takes all matches guest objectIds
 *
 * @param matches
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function retrieveGuest(matches, next) {
    async.map(matches, function (match, next) {
        var query;
        query = Team.findOne();
        query.where('name').equals(match.guest);
        query.exec(function (error, team) {
            if (error) { return next(error); }
            if (!team) { return next('guest not found'); }
            match.guest = team._id;
            return next(null, match);
        });
    }, next.bind({}));
}

/**
 * @method
 * @summary Takes all matches championship objectIds
 *
 * @param matches
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function retrieveChampionship(matches, next) {
    async.map(matches, function (match, next) {
        var query;
        query = Championship.findOne();
        query.where('name').equals(match.championship.name);
        query.where('country').equals(match.championship.country);
        query.exec(function (error, championship) {
            if (error) { return next(error); }
            if (!championship) { return next('championship not found'); }
            match.championship = championship._id;
            return next(null, match);
        });
    }, next.bind({}));
}

/**
 * @method
 * @summary Save all matches into database
 *
 * @param matches
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function saveMatches(matches, next) {
    async.each(matches, function (data, next) {
        var query;
        query = Match.findOne();
        query.where('host').equals(data.host);
        query.where('guest').equals(data.guest);
        query.where('championship').equals(data.championship);
        query.exec(function (error, match) {
            if (error || !match) { return next(error); }
            match.result = data.result;
            match.finished = data.finished;
            if (!match.date) { return next(); }
            return match.save(function (error) {
                next(error);
            });
        });
    }, next.bind({}));
}

async.seq(loadPage, parseMatches, retrieveHost, retrieveGuest, retrieveChampionship, saveMatches, process.exit.bind({}))();