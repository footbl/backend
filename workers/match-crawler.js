/**
 * @module
 * Populates database with championships, teams and matches
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
'use strict';
var mongoose, nconf, async, cheerio, request, querystring,
    Team, Championship, Match,
    championships, worldCup, months;

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

championships = [
    /*{'acronym' : 'UY', 'name' : 'Primera División', 'country' : 'Uruguay', 'url' : 'http://football-data.enetpulse.com/standings.php?ttFK='},
     {'acronym' : 'CL', 'name' : 'Primera División', 'country' : 'Chile', 'url' : 'http://football-data.enetpulse.com/standings.php?ttFK='},
     {'acronym' : 'CO', 'name' : 'Primera A', 'country' : 'Colombia', 'url' : 'http://football-data.enetpulse.com/standings.php?ttFK='},
     {'acronym' : 'SA', 'name' : 'Professional League Saudi', 'country' : 'Arabia', 'url' : 'http://football-data.enetpulse.com/standings.php?ttFK='},*/
    /*{'type' : 'continental league', 'acronym' : 'International', 'name' : 'Libertadores', 'country' : 'International', 'ttFK' : '45'},*/
    worldCup = {'type' : 'world cup', 'acronym' : 'International', 'name' : 'World Cup', 'country' : 'International', 'ttFK' : '77'}/*,
    {'type' : 'national league', 'acronym' : 'BR', 'name' : 'Série A', 'country' : 'Brazil', 'ttFK' : '268'},
    championsLeague = {'type' : 'continental league', 'acronym' : 'International', 'name' : 'Champions League', 'country' : 'International', 'ttFK' : '42'},
    {'type' : 'national league', 'acronym' : 'AU', 'name' : 'A-League', 'country' : 'Australia', 'ttFK' : '113'},
    {'type' : 'national league', 'acronym' : 'NO', 'name' : 'Tippeligaen', 'country' : 'Norway', 'ttFK' : '59'},
    {'type' : 'national league', 'acronym' : 'GR', 'name' : 'Superleague', 'country' : 'Greece', 'ttFK' : '135'},
    {'type' : 'national league', 'acronym' : 'AU', 'name' : 'Bundesliga', 'country' : 'Austria', 'ttFK' : '38'},
    {'type' : 'national league', 'acronym' : 'ES', 'name' : 'Primera División', 'country' : 'Spain', 'ttFK' : '87'},
    {'type' : 'national league', 'acronym' : 'GB', 'name' : 'Premier League', 'country' : 'England', 'ttFK' : '47'},
    {'type' : 'national league', 'acronym' : 'IT', 'name' : 'Serie A', 'country' : 'Italy', 'ttFK' : '55'},
    {'type' : 'national league', 'acronym' : 'DE', 'name' : 'Bundesliga', 'country' : 'Germany', 'ttFK' : '54'},
    {'type' : 'national league', 'acronym' : 'FR', 'name' : 'Ligue 1', 'country' : 'France', 'ttFK' : '53'},
    {'type' : 'national league', 'acronym' : 'RU', 'name' : 'Premier Liga', 'country' : 'Russia', 'ttFK' : '63'},
    {'type' : 'national league', 'acronym' : 'PT', 'name' : 'Liga ZON Sagres', 'country' : 'Portugal', 'ttFK' : '61'},
    {'type' : 'national league', 'acronym' : 'NL', 'name' : 'Eredivisie', 'country' : 'Netherlands', 'ttFK' : '57'},
    {'type' : 'national league', 'acronym' : 'AR', 'name' : 'Primera División', 'country' : 'Argentina', 'ttFK' : '112'},
    {'type' : 'national league', 'acronym' : 'MX', 'name' : 'Primera División', 'country' : 'Mexico', 'ttFK' : '230'},
    {'type' : 'national league', 'acronym' : 'US', 'name' : 'Major League Soccer', 'country' : 'USA', 'ttFK' : '130'},
    {'type' : 'national league', 'acronym' : 'JP', 'name' : 'J.League', 'country' : 'Japan', 'ttFK' : '223'},
    {'type' : 'national league', 'acronym' : 'CN', 'name' : 'Chinese Super League', 'country' : 'China', 'ttFK' : '120'},
    {'type' : 'national league', 'acronym' : 'BE', 'name' : 'Jupiler Pro League', 'country' : 'Belgium', 'ttFK' : '40'},
    {'type' : 'national league', 'acronym' : 'DK', 'name' : 'Superligaen', 'country' : 'Denmark', 'ttFK' : '46'},
    {'type' : 'national league', 'acronym' : 'PL', 'name' : 'Ekstraklasa', 'country' : 'Poland', 'ttFK' : '196'},
    {'type' : 'national league', 'acronym' : 'RO', 'name' : 'Liga 1', 'country' : 'Romania', 'ttFK' : '189'},
    {'type' : 'national league', 'acronym' : 'SE', 'name' : 'Allsvenskan', 'country' : 'Sweden', 'ttFK' : '67'},
    {'type' : 'national league', 'acronym' : 'CH', 'name' : 'Super League', 'country' : 'Switzerland', 'ttFK' : '69'},
    {'type' : 'national league', 'acronym' : 'TR', 'name' : 'Super Lig', 'country' : 'Turkey', 'ttFK' : '71'},
    {'type' : 'national league', 'acronym' : 'UA', 'name' : 'Premyer Liga', 'country' : 'Ukraine', 'ttFK' : '441'}*/
];
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(string) {
    var slices, day, month, year;
    slices = string.split(' ');
    day    = slices[0].replace(',', '') * 1;
    month  = months.indexOf(slices[1]);
    year   = 2000 + (slices[2] * 1);
    return new Date(year, month, day);
}

function translateName(name) {
    if (name === 'Bosnia-Herzegovina') {
        return 'Bosnia and H.';
    } else {
        return name;
    }
}

/**
 * @method
 * @summary Checks if championship is already saved and save it
 *
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseChampionships(next) {
    async.map(championships, function (data, next) {
        Championship.findOneAndUpdate({
            'name' : data.name,
            'country' : data.acronym
        }, {'$set' : {
            'name' : data.name,
            'country' : data.acronym,
            'type' : data.type,
            'edition' : new Date().getFullYear()
        }}, {'upsert' : true}, function (error, championship) {
            if (error) {
                next(error);
            } else if (!championship) {
                next(new Error('championship not found'));
            } else {
                data._id = championship._id;
                next(null, data);
            }
        });
    }, next);
}

/**
 * @method
 * @summary Detects championship rounds
 *
 * @param championships
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseRounds(championships, next) {
    async.map(championships, function (championship, next) {
        request('http://football-data.enetpulse.com/standings.php?ttFK=' + championship.ttFK, function (error, response, body) {
            var $, iterable, scanType;
            $ = cheerio.load(body);
            championship.rounds = [];
            $('select').each(function () {
                var select = $(this);
                if (select.attr('onchange').indexOf('round') > -1) {
                    scanType = 'round';
                    iterable = select;
                }
                if (select.children().first().text().indexOf('grp.') > -1) {
                    scanType = 'oFK';
                    iterable = select;
                }
            });
            if (iterable) {
                iterable.children().each(function () {
                    var row = $(this);
                    championship.rounds.push({round : row.val(), scanType : scanType});
                });
            }
            next(error, championship);
        });
    }, next);
}

/**
 * @method
 * @summary Loads all matches from all rounds from all championships
 *
 * @param championships
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function loadRounds(championships, next) {
    async.map(championships, function (championship, next) {
        async.map(championship.rounds, function (round, next) {
            request('http://football-data.enetpulse.com/standings.php?ttFK=' + championship.ttFK + '&' + round.scanType + '=' + round.round, function (error, response, body) {
                var $, result;
                $      = cheerio.load(body);
                result = [];
                $('.livetableA tr').each(function () {
                    var row = $(this);
                    row.championship = championship._id;
                    row.round = round.round * 1;
                    result.push(row);
                });
                next(error, result);
            });
        }, function (error, pages) {
            async.reduce(pages, [], function (matches, page, next) {
                next(null, matches.concat(page));
            }, next);
        });
    }, function (error, championships) {
        async.reduce(championships, [], function (matches, championship, next) {
            next(null, matches.concat(championship));
        }, next);
    });
}

/**
 * @method
 * @summary
 *
 * @param records
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function parseMatches(records, next) {
    var date, matches;
    matches = [];
    records.forEach(function (record) {
        if (record.children().length === 2) {
            date = parseDate(record.children().next().text());
        } else if (record.children().length > 2) {
            var elapsed, time, score;
            elapsed  = record.children().first().text().replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '').split('\'');
            time     = record.children().first().text().replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '').split(':');
            score    = record.children().first().next().next().text().replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '').split(' - ');
            record.date = new Date(date);
            if (time.length > 1) {
                record.date.setUTCHours((time[0] * 1) - 2);
                record.date.setUTCMinutes(time[1] * 1);
            }
            if (elapsed.length > 1) {
                record.elapsed = elapsed[0];
            } else {
                record.elapsed = null;
            }
            matches.push({
                championship : record.championship,
                round        : record.round,
                date         : record.date,
                elapsed      : record.elapsed,
                guest        : translateName(record.children().first().next().text().replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')),
                host         : translateName(record.children().first().next().next().next().text().replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')),
                score        : {guest : !isNaN(score[0]) ? score[0] * 1 : 0, host  : !isNaN(score[1]) ? score[1] * 1 : 0},
                finished     : record.children().first().text().replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '') === 'FT'
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
        Team.findOne({'name' : match.host, 'picture' : {'$exists' : true}}, function (error, team) {
            if (error) { next(error); }
            match.host = team ? team._id : null;
            next(null, match);
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
        Team.findOneAndUpdate({'name' : match.guest, 'picture' : {'$exists' : true}}, function (error, team) {
            if (error) { next(error); }
            match.guest = team ? team._id : null;
            next(null, match);
        });
    }, next.bind({}));
}

/**
 * @method
 * @summary Completes all matches rounds
 *
 * @param matches
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function retrieveRounds(matches, next) {
    async.seq(function (next) {
        async.filter(matches, function (match, next) {
            next(match.championship.toString() === worldCup._id.toString() && match.guest && match.host);
        }, function (matches) {
            next(null, matches);
        });
    }, function (matches, next) {
        async.sortBy(matches, function (match, next) {
            next(null, match.date);
        }, next);
    }, function (matches, next) {
        var guestRound = {};
        matches.forEach(function (match) {
            if (!guestRound[match.guest]) { guestRound[match.guest] = 0; }
            if (!guestRound[match.host]) { guestRound[match.host] = 0; }
            guestRound[match.guest] += 1;
            guestRound[match.host] += 1;
            match.round = guestRound[match.guest > match.host ? match.guest : match.host];
        });
        next();
    }, function () {
        next(null, matches);
    })();
}

/**
 * @method
 * @summary
 *
 * @param matches
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
function saveMatches(matches, next) {
    async.each(matches, function (data, next) {
        Match.update({
            'guest' : data.guest,
            'host' : data.host,
            'round' : data.round,
            'championship' : data.championship
        }, {
            'guest' : data.guest,
            'host' : data.host,
            'round' : data.round,
            'championship' : data.championship,
            'elapsed' : data.elapsed
        }, {'upsert' : true}, function () {
            Match.findOne({
                'guest' : data.guest,
                'host' : data.host,
                'round' : data.round,
                'championship' : data.championship
            }, function (error, match) {
                match.finished = data.finished;
                match.result = data.score;
                if (!match.date) { match.date = data.date; }
                match.save(next);
            });
        });
    }, next);
}

async.timesSeries(20, function (n, next) {
    async.seq(parseChampionships, parseRounds, loadRounds, parseMatches, retrieveHost, retrieveGuest, retrieveRounds, saveMatches, function () {})();
    setTimeout(next, 30000);
}, process.exit);
