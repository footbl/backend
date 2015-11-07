/*globals describe, before, it*/
'use strict';
require('should');
describe('championship', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var Championship = require('../models/championship');

  describe('list', function () {
    before(Championship.remove.bind(Championship));

    before(function (done) {
      var championship = new Championship();
      championship._id = '563d72882cb3e53efe2827fc';
      championship.name = 'brasileirão';
      championship.type = 'national league';
      championship.country = 'Brazil';
      championship.save(done);
    });

    it('should list one championship', function (done) {
      app.get('/championships').expect(200).expect(function (response) {
        response.body.should.be.instanceOf(Array);
        response.body.should.have.lengthOf(1)
      }).end(done)
    });
  });

  describe('get', function () {
    before(Championship.remove.bind(Championship));

    before(function (done) {
      var championship = new Championship();
      championship._id = '563d72882cb3e53efe2827fc';
      championship.name = 'brasileirão';
      championship.type = 'national league';
      championship.country = 'Brazil';
      championship.save(done);
    });

    describe('without valid id', function () {
      it('should return', function (done) {
        app.get('/championships/invalid').expect(404).end(done);
      });
    });

    describe('with valid id', function () {
      it('should return', function (done) {
        app.get('/championships/563d72882cb3e53efe2827fc').expect(200).expect(function (response) {
          response.body.should.have.property('name').be.equal('brasileirão');
          response.body.should.have.property('type').be.equal('national league');
          response.body.should.have.property('country').be.equal('Brazil');
        }).end(done);
      });
    });
  });
});
