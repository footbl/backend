/*globals describe, before, it*/
'use strict';
require('should');
describe('season', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var Season = require('../models/season');

  describe('list', function () {
    before(Season.remove.bind(Season));

    before(function (done) {
      var season = new Season();
      season._id = '563d72882cb3e53efe2827fc';
      season.sponsor = 'Barcelona FC.';
      season.gift = 'app store gift card';
      season.finishAt = '2015-03-05T22:29:47.133Z';
      season.save(done);
    });

    it('should list one season', function (done) {
      app.get('/seasons').expect(200).expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1)
      }).end(done)
    });
  });

  describe('get', function () {
    before(Season.remove.bind(Season));

    before(function (done) {
      var season = new Season();
      season._id = '563d72882cb3e53efe2827fc';
      season.sponsor = 'Barcelona FC.';
      season.gift = 'app store gift card';
      season.finishAt = '2015-03-05T22:29:47.133Z';
      season.save(done);
    });

    describe('without valid id', function () {
      it('should return', function (done) {
        app.get('/seasons/invalid').expect(404).end(done);
      });
    });

    describe('with valid id', function () {
      it('should return', function (done) {
        app.get('/seasons/563d72882cb3e53efe2827fc').expect(200).expect(function (response) {
          response.body.should.have.property('sponsor').be.equal('Barcelona FC.');
          response.body.should.have.property('gift').be.equal('app store gift card');
        }).end(done);
      });
    });
  });
});
