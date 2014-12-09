/*globals describe, before, it, after*/
var invalidMatches, now,
User, Championship, Match, Bet,
user, championship, yesterdayMatch, tomorrowMatch;

require('should');
require('../../index.js');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
Bet = require('../../models/bet');
invalidMatches = require('../../workers/invalid-matches');
now = new Date();

describe('invalid matches worker', function () {
  'use strict';

  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Match.remove.bind(Match));
  before(Bet.remove.bind(Bet));

  before(function (done) {
    user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user', 'funds' : 100, 'stake' : 0});
    user.save(done);
  });

  before(function (done) {
    championship = new Championship({
      'name'    : 'brasileirão',
      'slug'    : 'brasileirao-brasil-2014',
      'type'    : 'national league',
      'country' : 'brasil',
      'edition' : 2014
    });
    championship.save(done);
  });

  before(function (done) {
    tomorrowMatch = new Match({
      'round'        : 2,
      'date'         : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
      'finished'     : false,
      'guest'        : {
        'name'    : 'botafogo',
        'picture' : 'http://pictures.com/botafogo.png'
      },
      'host'         : {
        'name'    : 'fluminense',
        'picture' : 'http://pictures.com/fluminense.png'
      },
      'championship' : championship._id,
      'slug'         : 'round-2-fluminense-vs-botafogo'
    });
    tomorrowMatch.save(done);
  });

  before(function (done) {
    yesterdayMatch = new Match({
      'round'        : 1,
      'date'         : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
      'finished'     : false,
      'guest'        : {
        'name'    : 'botafogo',
        'picture' : 'http://pictures.com/botafogo.png'
      },
      'host'         : {
        'name'    : 'fluminense',
        'picture' : 'http://pictures.com/fluminense.png'
      },
      'championship' : championship._id,
      'slug'         : 'round-1-fluminense-vs-botafogo'
    });
    yesterdayMatch.save(done);
  });

  before(function (done) {
    new Bet({
      'slug'   : tomorrowMatch.slug + '-' + user.slug,
      'user'   : user._id,
      'match'  : tomorrowMatch._id,
      'bid'    : 10,
      'result' : 'guest'
    }).save(done);
  });

  before(function (done) {
    new Bet({
      'slug'   : yesterdayMatch.slug + '-' + user.slug,
      'user'   : user._id,
      'match'  : yesterdayMatch._id,
      'bid'    : 10,
      'result' : 'guest'
    }).save(done);
  });

  before(function (done) {
    Match.update({'_id' : tomorrowMatch._id}, {'$set' : {'finished' : true}}, done);
  });

  it('should remove', invalidMatches);

  after(function (done) {
    Match.findOne({'_id' : tomorrowMatch._id}, function (error, match) {
      (match === null).should.be.true;
      done();
    });
  });

  after(function (done) {
    Match.findOne({'_id' : yesterdayMatch._id}, function (error, match) {
      (match === null).should.be.true;
      done();
    });
  });

  after(function (done) {
    User.findOne({'_id' : user._id}, function (error, user) {
      user.should.have.property('funds').be.equal(100);
      user.should.have.property('stake').be.equal(0);
      done();
    });
  });
});