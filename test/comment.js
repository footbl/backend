var request, app, mongoose, auth, nconf,
    User, Team, Championship, Match,
    user, guest, visitor, championship, match;

require('should');

request      = require('supertest');
app          = require('../index.js');
mongoose     = require('mongoose');
nconf        = require('nconf');
auth         = require('../lib/auth');
User         = require('../models/user');
Team         = require('../models/team');
Championship = require('../models/championship');
Match        = require('../models/match');

before(function (done) {
    mongoose.connect(nconf.get('MONGOHQ_URL'), function () {
        mongoose.connection.db.dropDatabase(done);
    });
});

describe('comment controller', function () {
    'use strict';

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    before(function (done) {
        guest = new Team({'name' : 'guest', 'picture' : 'guest_picture'});
        guest.save(done);
    });

    before(function (done) {
        visitor = new Team({'name' : 'visitor', 'picture' : 'visitor_picture'});
        visitor.save(done);
    });

    before(function (done) {
        championship = new Championship({'name' : 'championship'});
        championship.save(done);
    });

    before(function (done) {
        match = new Match({'guest' : guest._id, 'visitor' : visitor._id, 'date' : new Date(), 'championship' : championship._id});
        match.save(done);
    });

    describe('create', function () {
        it('should raise error without date', function (done) {
            done();
        });

        it('should raise error without message', function (done) {
            done();
        });

        it('should create with valid credentials, name, picture', function (done) {
            done();
        });
    });

    describe('list', function () {
        it('should list valid credentials', function (done) {
            done();
        });
    });

    describe('details', function () {
        it('should raise error with invalid id', function (done) {
            done();
        });

        it('should return', function (done) {
            done();
        });
    });

    describe('update', function () {
        it('should raise error without date', function (done) {
            done();
        });

        it('should raise error without message', function (done) {
            done();
        });

        it('should raise error with invalid id', function (done) {
            done();
        });

        it('should update', function (done) {
            done();
        });
    });

    describe('delete', function () {
        it('should raise error with invalid id', function (done) {
            done();
        });

        it('should delete', function (done) {
            done();
        });
    });
});
