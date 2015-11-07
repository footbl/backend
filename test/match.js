/*globals describe, before, it*/
'use strict';
require('should');
describe('match', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var Championship = require('../models/championship');
  var Match = require('../models/match');

  before(Championship.remove.bind(Championship));

  before(function (done) {
    var championship = new Championship();
    championship._id = '563d72882cb3e53efe2827fc';
    championship.name = 'brasileirão';
    championship.type = 'national league';
    championship.country = 'Brazil';
    championship.save(done);
  });

  describe('list', function () {
    before(Match.remove.bind(Match));

    before(function (done) {
      var match = new Match();
      match._id = '563d72882cb3e53efe2827fd';
      match.round = 1;
      match.date = new Date();
      match.guest = {'name' : 'botafogo', 'picture' : 'http://pictures.com/botafogo.png'};
      match.host = {'name' : 'fluminense', 'picture' : 'http://pictures.com/fluminense.png'};
      match.championship = '563d72882cb3e53efe2827fc';
      match.save(done);
    });

    it('should list one match', function (done) {
      app.get('/matches').expect(200).expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1)
      }).end(done)
    });
  });

  describe('get', function () {
    before(Match.remove.bind(Match));

    before(function (done) {
      var match = new Match();
      match._id = '563d72882cb3e53efe2827fd';
      match.round = 1;
      match.date = new Date();
      match.guest = {'name' : 'botafogo', 'picture' : 'http://pictures.com/botafogo.png'};
      match.host = {'name' : 'fluminense', 'picture' : 'http://pictures.com/fluminense.png'};
      match.championship = '563d72882cb3e53efe2827fc';
      match.save(done);
    });

    describe('without valid id', function () {
      it('should return', function (done) {
        app.get('/matches/invalid').expect(404).end(done);
      });
    });

    describe('with valid id', function () {
      it('should return', function (done) {
        app.get('/matches/563d72882cb3e53efe2827fd').expect(200).expect(function (response) {
          response.body.should.have.property('guest').with.property('name').be.equal('botafogo');
          response.body.should.have.property('guest').with.property('picture').be.equal('http://pictures.com/botafogo.png');
          response.body.should.have.property('host').with.property('name').be.equal('fluminense');
          response.body.should.have.property('host').with.property('picture').be.equal('http://pictures.com/fluminense.png');
          response.body.should.have.property('round').be.equal(1);
          response.body.should.have.property('date');
          response.body.should.have.property('finished').be.equal(false);
          response.body.should.have.property('result').with.property('guest').be.equal(0);
          response.body.should.have.property('result').with.property('host').be.equal(0);
        }).end(done);
      });
    });
  });
});
