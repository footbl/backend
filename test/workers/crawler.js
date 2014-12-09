/*globals describe, before, it, after*/
var supertest,
User, Championship, Match, Bet, crawler, nock, now;

require('should');
require('../../index.js');
User = require('../../models/user');
Championship = require('../../models/championship');
Match = require('../../models/match');
Bet = require('../../models/bet');
crawler = require('../../workers/crawler');
nock = require('nock');
now = new Date();

nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=1').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=2').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=3').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=4').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=5').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=11').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=10').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=18').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=19').times(Infinity).reply(200, {Games : []});

describe('crawler', function () {
  'use strict';

  beforeEach(User.remove.bind(User));
  beforeEach(Bet.remove.bind(Bet));
  beforeEach(Championship.remove.bind(Championship));
  beforeEach(Match.remove.bind(Match));

  describe('first match crawl', function () {
    before(function (done) {
      nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(1).reply(200, {
        "Games" : [
          {
            "Comp"   : 113,
            "ID"     : 513645,
            "Season" : 7,
            "Active" : false,
            "GT"     : -1,
            "STime"  : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
            "Comps"  : [
              {"ID" : 1216, "Name" : "Fluminense", "CID" : 21, "SID" : 1 },
              {"ID" : 1212, "Name" : "Coritiba", "CID" : 21, "SID" : 1 }
            ],
            "Round"  : 14,
            "Winner" : -1
          }
        ]
      });
      done();
    });

    it('should crawl', crawler);

    after(function (done) {
      Match.findOne(function (error, match) {
        match.should.have.property('slug').be.equal('round-14-Fluminense-vs-Coritiba');
        match.should.have.property('round').be.equal(14);
        match.should.have.property('date');
        match.should.have.property('elapsed').be.equal(null);
        match.should.have.property('pot').with.property('guest').be.equal(0);
        match.should.have.property('pot').with.property('host').be.equal(0);
        match.should.have.property('pot').with.property('draw').be.equal(0);
        match.should.have.property('result').with.property('guest').be.equal(0);
        match.should.have.property('result').with.property('host').be.equal(0);
        match.should.have.property('finished').be.equal(false);
        match.should.have.property('host').with.property('name').be.equal('Fluminense');
        match.should.have.property('host').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Fluminense_nhyvvj.png');
        match.should.have.property('guest').with.property('name').be.equal('Coritiba');
        match.should.have.property('guest').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Coritiba_gmhywc.png');
        done();
      });
    });
  });

  describe('match start', function () {
    before(function (done) {
      nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(1).reply(200, {
        "Games" : [
          {
            "Comp"   : 113,
            "ID"     : 513645,
            "Season" : 7,
            "Active" : true,
            "GT"     : 1,
            "STime"  : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
            "Comps"  : [
              {"ID" : 1216, "Name" : "Fluminense", "CID" : 21, "SID" : 1 },
              {"ID" : 1212, "Name" : "Coritiba", "CID" : 21, "SID" : 1 }
            ],
            "Round"  : 14,
            "Winner" : -1
          }
        ]
      });
      done();
    });

    it('should crawl', crawler);

    after(function (done) {
      Match.findOne(function (error, match) {
        match.should.have.property('slug').be.equal('round-14-Fluminense-vs-Coritiba');
        match.should.have.property('round').be.equal(14);
        match.should.have.property('date');
        match.should.have.property('elapsed').be.equal(1);
        match.should.have.property('pot').with.property('guest').be.equal(0);
        match.should.have.property('pot').with.property('host').be.equal(0);
        match.should.have.property('pot').with.property('draw').be.equal(0);
        match.should.have.property('result').with.property('guest').be.equal(0);
        match.should.have.property('result').with.property('host').be.equal(0);
        match.should.have.property('finished').be.equal(false);
        match.should.have.property('host').with.property('name').be.equal('Fluminense');
        match.should.have.property('host').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Fluminense_nhyvvj.png');
        match.should.have.property('guest').with.property('name').be.equal('Coritiba');
        match.should.have.property('guest').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Coritiba_gmhywc.png');
        done();
      });
    });
  });

  describe('first match goal', function () {
    before(function (done) {
      nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(1).reply(200, {
        "Games" : [
          {
            "Comp"   : 113,
            "ID"     : 513645,
            "Season" : 7,
            "Active" : true,
            "GT"     : 10,
            "STime"  : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
            "Comps"  : [
              {"ID" : 1216, "Name" : "Fluminense", "CID" : 21, "SID" : 1 },
              {"ID" : 1212, "Name" : "Coritiba", "CID" : 21, "SID" : 1 }
            ],
            "Round"  : 14,
            "Winner" : -1,
            "Events" : [
              {"Type" : 0, "SType" : 0, "Num" : 1, "Comp" : 1, "GT" : 10, "Player" : "Cicero"}
            ]
          }
        ]
      });
      done();
    });

    it('should crawl', crawler);

    after(function (done) {
      Match.findOne(function (error, match) {
        match.should.have.property('slug').be.equal('round-14-Fluminense-vs-Coritiba');
        match.should.have.property('round').be.equal(14);
        match.should.have.property('date');
        match.should.have.property('elapsed').be.equal(10);
        match.should.have.property('pot').with.property('guest').be.equal(0);
        match.should.have.property('pot').with.property('host').be.equal(0);
        match.should.have.property('pot').with.property('draw').be.equal(0);
        match.should.have.property('result').with.property('guest').be.equal(0);
        match.should.have.property('result').with.property('host').be.equal(1);
        match.should.have.property('finished').be.equal(false);
        match.should.have.property('host').with.property('name').be.equal('Fluminense');
        match.should.have.property('host').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Fluminense_nhyvvj.png');
        match.should.have.property('guest').with.property('name').be.equal('Coritiba');
        match.should.have.property('guest').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Coritiba_gmhywc.png');
        done();
      });
    });
  });

  describe('match end', function () {
    before(function (done) {
      nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(1).reply(200, {
        "Games" : [
          {
            "Comp"   : 113,
            "ID"     : 513645,
            "Season" : 7,
            "Active" : false,
            "GT"     : 90,
            "STime"  : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
            "Comps"  : [
              {"ID" : 1216, "Name" : "Fluminense", "CID" : 21, "SID" : 1 },
              {"ID" : 1212, "Name" : "Coritiba", "CID" : 21, "SID" : 1 }
            ],
            "Round"  : 14,
            "Winner" : -1,
            "Events" : [
              {"Type" : 0, "SType" : 0, "Num" : 1, "Comp" : 1, "GT" : 10, "Player" : "Cicero"}
            ]
          }
        ]
      });
      done();
    });

    it('should crawl', crawler);

    after(function (done) {
      Match.findOne(function (error, match) {
        match.should.have.property('slug').be.equal('round-14-Fluminense-vs-Coritiba');
        match.should.have.property('round').be.equal(14);
        match.should.have.property('date');
        match.should.have.property('elapsed').be.equal(null);
        match.should.have.property('pot').with.property('guest').be.equal(0);
        match.should.have.property('pot').with.property('host').be.equal(0);
        match.should.have.property('pot').with.property('draw').be.equal(0);
        match.should.have.property('result').with.property('guest').be.equal(0);
        match.should.have.property('result').with.property('host').be.equal(1);
        match.should.have.property('finished').be.equal(true);
        match.should.have.property('host').with.property('name').be.equal('Fluminense');
        match.should.have.property('host').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Fluminense_nhyvvj.png');
        match.should.have.property('guest').with.property('name').be.equal('Coritiba');
        match.should.have.property('guest').with.property('picture').be.equal('http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Coritiba_gmhywc.png');
        done();
      });
    });

    after(function (done) {
      Championship.findOne({'country' : 'Brazil'}, function (error, championship) {
        championship.should.have.property('currentRound').be.equal(14);
        done();
      });
    })
  });

  describe('rewards', function () {
    var drawBetter, guestBetter, hostBetter, id;

    beforeEach(function (done) {
      drawBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'draw-better'});
      drawBetter.save(done);
    });

    beforeEach(function (done) {
      guestBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'guest-better'});
      guestBetter.save(done);
    });

    beforeEach(function (done) {
      hostBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'host-better'});
      hostBetter.save(done);
    });

    beforeEach(function (done) {
      nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(1).reply(200, {
        "Games" : [
          {
            "Comp"   : 113,
            "Season" : 7,
            "Active" : false,
            "GT"     : -1,
            "STime"  : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
            "Comps"  : [
              {"ID" : 1216, "Name" : "Fluminense", "CID" : 21, "SID" : 1 },
              {"ID" : 1212, "Name" : "Coritiba", "CID" : 21, "SID" : 1 }
            ],
            "Round"  : 14,
            "Winner" : -1
          }
        ]
      });
      done();
    });

    beforeEach(crawler);

    beforeEach(function (done) {
      Match.findOne(function (error, match) {
        id = match._id;
        done();
      });
    });

    beforeEach(function (done) {
      new Bet({
        'slug'   : 'teste-draw-better',
        'user'   : drawBetter._id,
        'match'  : id,
        'bid'    : 50,
        'result' : 'draw'
      }).save(done);
    });

    beforeEach(function (done) {
      new Bet({
        'slug'   : 'teste-guest-better',
        'user'   : guestBetter._id,
        'match'  : id,
        'bid'    : 50,
        'result' : 'guest'
      }).save(done);
    });

    beforeEach(function (done) {
      new Bet({
        'slug'   : 'teste-host-better',
        'user'   : hostBetter._id,
        'match'  : id,
        'bid'    : 50,
        'result' : 'host'
      }).save(done);
    });

    beforeEach(function (done) {
      nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(1).reply(200, {
        "Games" : [
          {
            "Comp"   : 113,
            "ID"     : 513645,
            "Season" : 7,
            "Active" : false,
            "GT"     : 90,
            "STime"  : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
            "Comps"  : [
              {"ID" : 1216, "Name" : "Fluminense", "CID" : 21, "SID" : 1 },
              {"ID" : 1212, "Name" : "Coritiba", "CID" : 21, "SID" : 1 }
            ],
            "Round"  : 14,
            "Winner" : -1,
            "Events" : [
              {"Type" : 0, "SType" : 0, "Num" : 1, "Comp" : 1, "GT" : 10, "Player" : "Cicero"}
            ]
          }
        ]
      });
      done();
    });

    it('should give rewards', crawler);

    afterEach(function (done) {
      User.findOne({'_id' : drawBetter._id}, function (error, user) {
        user.should.have.property('funds').be.equal(50);
        user.should.have.property('stake').be.equal(0);
        done();
      });
    });

    afterEach(function (done) {
      User.findOne({'_id' : guestBetter._id}, function (error, user) {
        user.should.have.property('funds').be.equal(50);
        user.should.have.property('stake').be.equal(0);
        done();
      });
    });

    afterEach(function (done) {
      User.findOne({'_id' : hostBetter._id}, function (error, user) {
        user.should.have.property('funds').be.equal(200);
        user.should.have.property('stake').be.equal(0);
        done();
      });
    });
  });
});