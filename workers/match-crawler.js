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

function championshipName(title) {
    return title.split(' grp. ')[0];
}

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

function loadPages(next) {
    async.times(60, loadPage, function (error, pages) {
        if (error) { return next(error); }
        return next(null, pages.reduce(function (pages, page) {
            return pages.concat(page);
        }, []));
    });
}

function parseChampionships(records, next) {
    async.map(records.filter(function (record) {
        return record.children().first().hasClass('Heading');
    }), function (record, next) {
        var championship, title;
        title        = record.children().first().text().split(' - ');
        championship = new Championship({
            'name'    : championshipName(title[1]),
            'country' : title[0]
        });
        next(null, championship);
    }, next.bind({}));
}

function saveChampionships(championships, next) {
    async.each(championships, function (championship, next) {
        return championship.save(function () {
            next();
        });
    }, next.bind({}));
}

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

function saveTeams(teams, next) {
    async.each(teams, function (team, next) {
        return team.save(function () {
            next();
        });
    }, next.bind({}));
}

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