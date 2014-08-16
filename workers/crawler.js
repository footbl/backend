'use strict';
var VError, mongoose, nconf, request, async, slug, championships, teams, Championship, Match, Team, now;

VError = require('verror');
mongoose = require('mongoose');
nconf = require('nconf');
request = require('request');
async = require('async');
slug = require('slug');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

now = new Date();

championships = [
    {
        'name'               : 'Premier League',
        'country'            : 'United Kingdom',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 1,
        '365scoresCompId'    : 7
    },
    {
        'name'               : 'Primera Division',
        'country'            : 'Spain',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 2,
        '365scoresCompId'    : 0 /*@TODO falta o id da liga*/
    },
    {
        'name'               : 'Serie A',
        'country'            : 'Italy',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 3,
        '365scoresCompId'    : 0 /*@TODO falta o id da liga*/
    },
    {
        'name'               : 'Bundesliga',
        'country'            : 'Germany',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 4,
        '365scoresCompId'    : 0 /*@TODO falta o id da liga*/
    },
    {
        'name'               : 'Ligue 1',
        'country'            : 'France',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 5,
        '365scoresCompId'    : 35
    },
    {
        'name'               : 'Liga portugal',
        'country'            : 'Portugal',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 11,
        '365scoresCompId'    : 0 /*@TODO falta o id da liga*/
    },
    {
        'name'               : 'Serie A',
        'country'            : 'Brazil',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 21,
        '365scoresCompId'    : 113
    },
    {
        'name'               : 'Primera Division',
        'country'            : 'Argentina',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 10,
        '365scoresCompId'    : 72
    },
    {
        'name'               : 'MLS',
        'country'            : 'United States',
        'type'               : 'national league',
        'picture'            : '',
        'edition'            : 2014,
        '365scoresCountryId' : 18,
        '365scoresCompId'    : 104
    }
];

teams = {
    "West Ham"               : "West Ham",
    "West Bromwich"          : "W. Bromwich",
    "Tottenham"              : "Tottenham",
    "Swansea"                : "Swansea",
    "Sunderland"             : "Sunderland",
    "Stoke"                  : "Stoke",
    "Southampton"            : "Southampton",
    "Queens P.R."            : "Queens P.R.",
    "Newcastle"              : "Newcastle",
    "Manchester United"      : "Manch. Utd",
    "Manchester City"        : "Manch. City",
    "Liverpool"              : "Liverpool",
    "Leicester"              : "Leicester",
    "Hull"                   : "Hull",
    "Everton"                : "Everton",
    "Crystal Palace"         : "Crystal Palace",
    "Chelsea"                : "Chelsea",
    "Burnley"                : "Burnley",
    "Aston Villa"            : "Aston Villa",
    "Arsenal"                : "Arsenal",
    "Almeria"                : "Almeria",
    "Athletic Bilbao"        : "Athl. Bilbao",
    "Atlético Madrid"        : "Atl. Madrid",
    "Barcelona"              : "Barcelona",
    "Celta Vigo"             : "Celta Vigo",
    "Cordoba"                : "Cordoba",
    "Deportivo La Coruna"    : "D. La Coruna",
    "Eibar"                  : "Eibar",
    "Elche"                  : "Elche",
    "Espanyol"               : "Espanyol",
    "Getafe"                 : "Getafe",
    "Granada"                : "Granada",
    "Levante"                : "Levante",
    "Malaga"                 : "Malaga",
    "Rayo Vallecano"         : "R. Vallecano",
    "Real Madrid"            : "Real Madrid",
    "Real Sociedad"          : "Real Sociedad",
    "Sevilla"                : "Sevilla",
    "Valencia"               : "Valencia",
    "Villarreal"             : "Villarreal",
    "AC Milan"               : "AC Milan",
    "AS Roma"                : "AS Roma",
    "Atalanta"               : "Atalanta",
    "Cagliari"               : "Cagliari",
    "Cesena"                 : "Cesena",
    "Chievo"                 : "Chievo",
    "Empoli"                 : "Empoli",
    "Fiorentina"             : "Fiorentina",
    "Genoa"                  : "Genoa",
    "Inter Milan"            : "Inter Milan",
    "Juventus"               : "Juventus",
    "Lazio"                  : "Lazio",
    "Napoli"                 : "Napoli",
    "Palermo"                : "Palermo",
    "Parma"                  : "Parma",
    "Sampdoria"              : "Sampdoria",
    "Sassuolo"               : "Sassuolo",
    "Torino"                 : "Torino",
    "Udinese"                : "Udinese",
    "Verona"                 : "Verona",
    "Bayern Munich"          : "B. Munich",
    "Bor. Dortmund"          : "B. Dortmund",
    "Eintracht Frankfurt"    : "E. Frankfurt",
    "Hertha Berlin"          : "Hertha Berlin",
    "Augsburg"               : "Augsburg",
    "Bayer Leverkusen"       : "B. Leverkusen",
    "Bor. Monchengladbach"   : "B. Monchen.",
    "FC Koln"                : "FC Koln",
    "Freiburg"               : "Freiburg",
    "Hamburger SV"           : "Hamburger",
    "Hannover"               : "Hannover",
    "Hoffenheim"             : "Hoffenheim",
    "Mainz 05"               : "Mainz 05",
    "Paderborn"              : "Paderborn",
    "Schalke 04"             : "Schalke 04",
    "Stuttgart"              : "Stuttgart",
    "Werder Bremen"          : "W. Bremen",
    "Wolfsburg"              : "Wolfsburg",
    "Bastia"                 : "Bastia",
    "Bordeaux"               : "Bordeaux",
    "Caen"                   : "Caen",
    "Evian Tgfc"             : "Evian",
    "Guingamp"               : "Guingamp",
    "Lens"                   : "Lens",
    "Lille"                  : "Lille",
    "Lorient"                : "Lorient",
    "Lyon"                   : "Lyon",
    "Marseille"              : "Marseille",
    "Metz"                   : "Metz",
    "Monaco"                 : "Monaco",
    "Montpellier"            : "Montpellier",
    "Nantes"                 : "Nantes",
    "Nice"                   : "Nice",
    "Paris-SG"               : "Paris SG",
    "Reims"                  : "Reims",
    "Rennes"                 : "Rennes",
    "Saint-Éttiene"          : "Saint-Éttiene",
    "Toulouse"               : "Toulouse",
    "Académica"              : "Académica",
    "Arouca"                 : "Arouca",
    "Belenenses"             : "Belenenses",
    "Benfica"                : "Benfica",
    "Boavista"               : "Boavista",
    "Braga"                  : "Braga",
    "Estoril"                : "Estoril",
    "Gil Vicente"            : "Gil Vicente",
    "Marítimo"               : "Marítimo",
    "Moreirense"             : "Moreirense",
    "Nacional"               : "Nacional",
    "P. Ferreira"            : "P. Ferreira",
    "Penafiel"               : "Penafiel",
    "Porto"                  : "Porto",
    "Rio Ave"                : "Rio Ave",
    "Sporting"               : "Sporting",
    "V. Guimarães"           : "V. Guimarães",
    "V. Setúbal"             : "V. Setúbal",
    "Atletico Mineiro"       : "Atlético MG",
    "Atletico Paranaense"    : "Atlético PR",
    "Bahia"                  : "Bahia",
    "Botafogo"               : "Botafogo",
    "Chapecoense"            : "Chapecoense",
    "Corinthians"            : "Corinthians",
    "Coritiba"               : "Coritiba",
    "Criciuma"               : "Criciúma",
    "Cruzeiro"               : "Cruzeiro",
    "Figueirense"            : "Figueirense",
    "Flamengo"               : "Flamengo",
    "Fluminense"             : "Fluminense",
    "Goias"                  : "Goiás",
    "Gremio"                 : "Grêmio",
    "Internacional"          : "Internacional",
    "Palmeiras"              : "Palmeiras",
    "Santos"                 : "Santos",
    "Sao Paulo"              : "São Paulo",
    "Sport Recife"           : "Sport",
    "Vitoria"                : "Vitória",
    "Arsenal Sarandi"        : "Arsenal Sar.",
    "Atletico Rafaela"       : "Atl. Rafaela",
    "Banfield"               : "Banfield",
    "Belgrano"               : "Belgrano",
    "Boca Juniors"           : "Boca Juniors",
    "Defensa Y Justicia"     : "Defensa Y J.",
    "Estudiantes"            : "Estudiantes",
    "Gimnasia Lp"            : "Gimnasia Lp",
    "Godoy Cruz"             : "Godoy Cruz",
    "Independiente"          : "Independiente",
    "Lanus"                  : "Lanus",
    "Newells Ob"             : "Newells Ob",
    "Olimpo de Bahia Blanca" : "Olimpo",
    "Quilmes"                : "Quilmes",
    "Racing Club"            : "Racing Club",
    "River Plate"            : "River Plate",
    "Rosario Central"        : "Rosario Cen.",
    "San Lorenzo"            : "San Lorenzo",
    "Tigre"                  : "Tigre",
    "Velez Sarsfield"        : "Velez Sarsf.",
    "Chicago Fire"           : "Chicago F.",
    "Chivas USA"             : "Chivas USA",
    "Colorado Rapids"        : "Colorado R.",
    "Columbus Crew"          : "Columbus C.",
    "Dc United"              : "DC United",
    "FC Dallas"              : "FC Dallas",
    "Houston Dynamo"         : "Houston D.",
    "Los Angeles Galaxy"     : "LA Galaxy",
    "Montreal Impact"        : "Montreal I.",
    "New York Red Bulls"     : "NY Red Bulls",
    "New England Revol."     : "N. England R.",
    "Philadelphia Union"     : "Philadelphia U.",
    "Portland Timbers"       : "Portland T.",
    "Real Salt Lake"         : "R. Salt Lake",
    "San Jose"               : "San Jose E.",
    "Seattle Sounders"       : "Seattle S.",
    "Sporting Kansas City"   : "S. Kansas C.",
    "Toronto Fc"             : "Toronto FC",
    "Vancouver Whitecaps"    : "Vancouver W."
};

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
            matches = JSON.parse(body).Games || [];
            async.each(matches.filter(function (match) {
                return match.Comp === championship['365scoresCompId'];
            }), function (data, next) {
                var guest, guestId, host, hostId, round, dateMask, date, finished, elapsed, guestScore, hostScore;
                host = teams[data.Comps[0].Name];
                guest = teams[data.Comps[1].Name];
                round = data.Round || 1;
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
                        'result'        : {
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