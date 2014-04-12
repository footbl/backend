'use strict';
var mongoose, nconf, async, cheerio, request, querystring,
    Team, Championship, Match,
    query, championships, matches;

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

query         = querystring.encode({'showLeagues' : 'all', 'd' : '0'});
championships = [];
matches       = [];

request(nconf.get('CRAWLER_URI') + '?' + query, function (error, response, body) {
    var $;

    $ = cheerio.load(body);
    $('tr').each(function () {
        var tr, heading,
            date, time, title;

        tr      = $(this);
        heading = tr.children().first().hasClass('Heading');

        if (heading) {
            title = tr.children().first().text().split(' - ');

            championships.push({
                'name'    : title[1],
                'country' : title[0]
            });
        } else if (tr.children().first().text() !== 'FT') {
            date = new Date();
            time = tr.children().first().text().split(':');
            date.setSeconds(0);
            date.setUTCHours(time[0]);
            date.setUTCMinutes(time[1]);

            matches.push({
                'date'         : date,
                'championship' : championships[championships.length - 1],
                'guest'        : tr.children().first().next().text(),
                'host'         : tr.children().first().next().next().next().text()
            });
        }
    });

    console.log(matches);
});