'use strict';
var mongoose, nconf, request, async,
Championship, Match, User,
championships, teams,
now, yesterday, today, tomorrow, url365;

mongoose = require('mongoose');
nconf = require('nconf');
request = require('request');
async = require('async');
Championship = require('../../models/championship');
Match = require('../../models/match');
User = require('../../models/user');
championships = require('./championships');
teams = require('./teams');
now = new Date();
yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
url365 = 'http://ws.365scores.com?action=1&Sid=1&curr_season=true&CountryID=';

function saveChampionship(championship) {
  return function (next) {
    Championship.findOneAndUpdate({'name' : championship.name}, {
      '$set' : {
        'name'    : championship.name,
        'country' : championship.country,
        'type'    : championship.type,
        'picture' : championship.picture
      }
    }, {'upsert' : true}, next);
  };
}

function getChampionshipMatches(championship) {
  return function (champ, next) {
    championship._id = champ._id;
    request({'url' : url365 + championship['365scoresCountryId'], 'json' : true}, function (error, response, body) {
      next(error, (body || {}).Games || []);
    });
  };
}

function filterChampionshipMatches(championship) {
  return function (games, next) {
    async.filter(games, function (match, next) {
      next(match.Comp === championship['365scoresCompId']);
    }, function (matches) {
      next(null, matches);
    });
  };
}

function parseMatches(matches, next) {
  async.map(matches, function (data, next) {
    var dateMask, date, events, guestScore, hostScore;
    dateMask = data.STime.split(/-|\s|:/).map(Number);
    date = new Date(dateMask[2], dateMask[1] - 1, dateMask[0], dateMask[3], dateMask[4]);
    events = data.Events || [];
    guestScore = events.filter(function (e) {
      return e.Type === 0 && e.Comp === 2;
    }).length;
    hostScore = events.filter(function (e) {
      return e.Type === 0 && e.Comp === 1;
    }).length;
    if (!teams[data.Comps[0].ID]) {
      console.log('[missing team]', data.Comps[0].ID, data.Comps[0].Name);
      return next(null, {});
    }
    if (!teams[data.Comps[1].ID]) {
      console.log('[missing team]', data.Comps[1].ID, data.Comps[1].Name);
      return next(null, {});
    }
    return next(null, {
      'guest'    : teams[data.Comps[1].ID],
      'host'     : teams[data.Comps[0].ID],
      'round'    : data.Round || 1,
      'date'     : date,
      'finished' : !data.Active && data.GT >= 90,
      'elapsed'  : data.Active ? data.GT : null,
      'result'   : {'guest' : guestScore, 'host' : hostScore}
    });
  }, next);
}

function filterInvalidMatches(matches, next) {
  async.filter(matches, function (match, next) {
    if (!match.guest) return next(false);
    if (!match.host) return next(false);
    if (match.date < yesterday && !match.finished) return next(false);
    if (match.date > tomorrow && match.finished) return next(false);
    return next(true);
  }, function (matches) {
    next(null, matches);
  });
}

function saveMatches(champ) {
  return function (matches, next) {
    async.map(matches, function (match, next) {
      match.championship = champ._id;
      Match.findOneAndUpdate({
        'guest.name'   : match.guest.name,
        'host.name'    : match.host.name,
        'round'        : match.round,
        'championship' : champ._id
      }, {'$set' : match}, {'upsert' : true}, next);
    }, next);
  };
}

module.exports = function crawler(next) {
  async.map(championships, function (championship, next) {
    async.waterfall([
      saveChampionship(championship),
      getChampionshipMatches(championship),
      filterChampionshipMatches(championship),
      parseMatches,
      filterInvalidMatches,
      saveMatches(championship)
    ], next);
  }, next);
};

if (require.main === module) {
  nconf.env();
  nconf.defaults({'MONGOLAB_URI' : 'mongodb://localhost/footbl'});
  mongoose.connect(nconf.get('MONGOLAB_URI'));

  async.whilst(function () {
    return Date.now() - now.getTime() < 1000 * 60 * 10;
  }, function (next) {
    module.exports(function () {
      setTimeout(next, 30000);
    });
  }, process.exit);
}


/*
 if (this.finshed) return next('match already finished');
 return async.waterfall([function (next) {
 this.finished = true;
 this.save(next);
 }.bind(this), function (_, __, next) {
 var Bet, query;
 Bet = require('./bet');
 query = Bet.find();
 query.where('match').equals(this._id);
 query.populate('user');
 query.exec(next);
 }.bind(this), function (bets, next) {
 async.each(bets, function (bet, next) {
 bet.user.stake -= bet.bid;
 if (bet.result === this.winner) {
 bet.user.funds += bet.bid * this.reward;
 }
 bet.user.save(next);
 }.bind(this), next);
 }.bind(this), function (next) {
 var Challenge, query;
 Challenge = require('./challenge');
 query = Challenge.find();
 query.where('match').equals(this._id);
 query.populate('challenger.user');
 query.populate('challenged.user');
 query.exec(next);
 }.bind(this), function (challenges, next) {
 async.each(challenges, function (challenge, next) {
 if (challenge.challenger.result === this.winner) challenge.challenger.user.funds += 2 * challenge.bid;
 challenge.challenger.user.stake -= challenge.bid;
 if (challenge.challenged.result === this.winner) challenge.challenged.user.funds += 2 * challenge.bid;
 challenge.challenged.user.stake -= challenge.bid;
 async.parallel([
 challenge.challenger.user.save.bind(challenge.challenger.user),
 challenge.challenged.user.save.bind(challenge.challenged.user)
 ], next);
 }.bind(this), next);
 }.bind(this), function (next) {
 next(null, this);
 }.bind(this)], next);
 * */
