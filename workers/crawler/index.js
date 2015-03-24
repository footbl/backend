'use strict';
var mongoose, nconf, request, async, slug,
    Championship, Match, Bet, User,
    championships, teams,
    now, today, tomorrow, yesterday;

mongoose = require('mongoose');
nconf = require('nconf');
request = require('request');
async = require('async');
slug = require('slug');
Championship = require('../../models/championship');
Match = require('../../models/match');
Bet = require('../../models/bet');
User = require('../../models/user');
championships = require('./championships');
teams = require('./teams');
now = new Date();
yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

function parseChampionship(championship) {
  return {
    'slug'    : slug(championship.name) + '-' + slug(championship.country) + '-' + championship.edition,
    'name'    : championship.name,
    'country' : championship.country,
    'type'    : championship.type,
    'picture' : championship.picture,
    'edition' : championship.edition,
    'rounds'  : championship.rounds
  };
}

function parseMatch(data, next) {
  var dateMask = data.STime.split(/-|\s|:/).map(Number);
  if (!teams[data.Comps[0].ID]) {
    console.log('[team not found]', data.Comps[0].Name);
    return next(null, {});
  }
  if (!teams[data.Comps[1].ID]) {
    console.log('[team not found]', data.Comps[1].Name);
    return next(null, {});
  }
  return next(null, {
    'slug'     : 'round-' + (data.Round || 1) + '-' + slug(teams[data.Comps[0].ID].name) + '-vs-' + slug(teams[data.Comps[1].ID].name),
    'guest'    : teams[data.Comps[1].ID],
    'host'     : teams[data.Comps[0].ID],
    'round'    : data.Round || 1,
    'date'     : new Date(dateMask[2], dateMask[1] - 1, dateMask[0], dateMask[3], dateMask[4]),
    'finished' : !data.Active && data.GT >= 90,
    'elapsed'  : data.Active ? data.GT : null,
    'result'   : {
      'guest' : (data.Events || []).filter(function (event) {
        return event.Type === 0 && event.Comp === 2;
      }).length,
      'host'  : (data.Events || []).filter(function (event) {
        return event.Type === 0 && event.Comp === 1;
      }).length
    }
  });
}

module.exports = function crawler(next) {
  async.map(championships, function (championship, next) {
    async.waterfall([function (next) {
      Championship.findOneAndUpdate({
        'slug' : slug(championship.name) + '-' + slug(championship.country) + '-' + championship.edition
      }, {'$set' : parseChampionship(championship)}, {'upsert' : true}, next);
    }, function (champ, next) {
      async.waterfall([function (next) {
        request({
          'url'  : 'http://ws.365scores.com?action=1&Sid=1&curr_season=true&CountryID=' + championship['365scoresCountryId'],
          'json' : true
        }, next);
      }, function (response, body, next) {
        async.filter((body || {}).Games || [], function (match, next) {
          next(match.Comp === championship['365scoresCompId']);
        }, function (results) {
          next(null, results);
        });
      }, function (matches, next) {
        async.map(matches, parseMatch, next);
      }, function (matches, next) {
        async.filter(matches, function (match, next) {
          if (!match.guest) return next(false);
          if (!match.host) return next(false);
          if (match.date < yesterday && !match.finished) return next(false);
          if (match.date > tomorrow && match.finished) return next(false);
          return next(true);
        }, function (results) {
          next(null, results);
        });
      }, function (matches, next) {
        async.map(matches, function (match, next) {
          match.championship = champ._id;
          match.guest.slug = slug(match.guest.name);
          match.host.slug = slug(match.host.name);
          Match.findOneAndUpdate({
            'slug'         : match.slug,
            'championship' : champ._id
          }, {'$set' : match}, {'upsert' : true}, next);
        }, next);
      }, function (matches, next) {
        async.filter(matches, function (match, next) {
          return next(match.finished);
        }, function (results) {
          next(null, results);
        });
      }, function (matches, next) {
        async.each(matches, function (match, next) {
          async.parallel([function (next) {
            async.waterfall([function (next) {
              var query;
              query = Bet.find();
              query.where('match').equals(match._id);
              query.where('payed').ne(true);
              query.exec(next);
            }, function (bets, next) {
              async.each(bets, function (bet, next) {
                async.parallel([function (next) {
                  Bet.update({'_id' : bet._id}, {'$set' : {'payed' : true}}, next);
                }, function (next) {
                  User.update({'_id' : bet.user}, {
                    '$inc' : {
                      'stake' : -bet.bid,
                      'funds' : (bet.result === match.winner) ? bet.bid * match.reward : 0
                    }
                  }, next);
                }], next);
              }, next);
            }], next);
          }, function (next) {
            Championship.collection.update({
              '$or' : [
                {'_id' : match.championship, 'currentRound' : {'$lt' : match.round}},
                {'_id' : match.championship, 'currentRound' : {'$exists' : false}}
              ]
            }, {'$set' : {'currentRound' : match.round}}, next);
          }], next);
        }, next);
      }], next);
    }], next);
  }, next);
};

if (require.main === module) {
  nconf.argv();
  nconf.env();
  nconf.defaults(require('../../config'));
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  async.whilst(function () {
    return Date.now() - now.getTime() < 1000 * 60 * 10;
  }, function (next) {
    module.exports(function (error) {
      if (error) {
        console.error(error);
      }
      setTimeout(next, 30000);
    });
  }, process.exit);
}