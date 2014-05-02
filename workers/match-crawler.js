/**
 * @module
 * Populates database with championships, teams and matches
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
 * @param day
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function loadPage(day, next) {
    var query = querystring.encode({'showLeagues' : 'all', 'd' : day});
    request(nconf.get('CRAWLER_URI') + '?' + query, function (error, response, body) {
        var $, result;
        $      = cheerio.load(body);
        result = [];
        $('tr').each(function () {
            var row = $(this);
            row.day = day;
            result.push(row);
        });
        next(error, result);
    });
}

/**
 * @method
 * @summary Loads all HTML pages from the next 2 months
 *
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function loadPages(next) {
    async.times(60, loadPage, function (error, pages) {
        if (error) { return next(error); }
        return next(null, pages.reduce(function (pages, page) {
            return pages.concat(page);
        }, []));
    });
}

/**
 * @method
 * @summary Parse crawled table rows of chamionships into championship objects
 *
 * @param records
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseChampionships(records, next) {
    async.map(records.filter(function (record) {
        return record.children().first().hasClass('Heading');
    }), function (record, next) {
        var championship, title, date;
        date         = new Date();
        title        = record.children().first().text().split(' - ');
        championship = new Championship({
            'name'    : championshipName(title[1]),
            'country' : title[0],
            'year'    : date.getFullYear()
        });
        next(null, championship);
    }, next.bind({}));
}

/**
 * @method
 * @summary Save all championships into database
 *
 * @param championships
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function saveChampionships(championships, next) {
    async.each(championships, function (championship, next) {
        return championship.save(function () {
            next();
        });
    }, next.bind({}));
}

/**
 * @method
 * @summary Parse crawled table rows of matches into team objects of the host team
 *
 * @param records
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseHostTeams(records, next) {
    async.map(records.filter(function (record) {
        return !record.children().first().hasClass('Heading');
    }), function (record, next) {
        var team = new Team({
            'name' : record.children().first().next().text()
        });
        next(null, team);
    }, next.bind({}));
}

/**
 * @method
 * @summary Parse crawled table rows of matches into team objects of the guest team
 *
 * @param records
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseGuestTeams(records, next) {
    async.map(records.filter(function (record) {
        return !record.children().first().hasClass('Heading');
    }), function (record, next) {
        var team = new Team({
            'name' : record.children().first().next().next().next().text()
        });
        next(null, team);
    }, next.bind({}));
}

/**
 * @method
 * @summary Save all teams into database
 *
 * @param teams
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function saveTeams(teams, next) {
    async.each(teams, function (team, next) {
        return team.save(function () {
            next();
        });
    }, next.bind({}));
}

/**
 * @method
 * @summary Parse crawled table rows of matches into match objects
 * When crawling system matches, the crawler don't care for the match result, only the matches which haven't started are
 * crawled in this fase. Another crawler will take care of the result.
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
        var heading, date, time;
        heading = record.children().first().hasClass('Heading');
        if (heading) {
            name    = championshipName(record.children().first().text().split(' - ')[1]);
            country = record.children().first().text().split(' - ')[0];
        } else if (record.children().first().text().indexOf(':') > -1) {
            date = new Date();
            time = record.children().first().text().split(':');
            date.setDate(date.getDate() + record.day);
            date.setUTCHours(time[0]);
            date.setUTCMinutes(time[1]);
            matches.push({
                'round'        : 1,
                'championship' : {
                    'name'    : name,
                    'country' : country
                },
                'date'         : date,
                'guest'        : record.children().first().next().text(),
                'host'         : record.children().first().next().next().next().text()
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
            if (error || match) { return next(error); }

            match = new Match(data);
            return match.save(function (error) {
                next(error);
            });
        });
    }, next.bind({}));
}

async.seq(
    async.seq(loadPages, parseChampionships, saveChampionships),
    async.seq(loadPages, parseHostTeams, saveTeams),
    async.seq(loadPages, parseGuestTeams, saveTeams),
    async.seq(loadPages, parseMatches, retrieveHost, retrieveGuest, retrieveChampionship, saveMatches),
    process.exit.bind({})
)();