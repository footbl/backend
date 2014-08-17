/*globals describe, before, it, after*/
require('should');
var supertest, app, auth, nock,
User, Championship, Match, Team, Bet, Group, GroupMember, crawler,
user, slug;

supertest = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
nock = require('nock');
User = require('../models/user');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');
Bet = require('../models/bet');
Group = require('../models/group');
GroupMember = require('../models/group-member');
crawler = require('../workers/crawler');


nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(Infinity).reply(200, require('./crawler-mock.js'));
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=1').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=2').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=3').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=4').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=5').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=11').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=10').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=18').times(Infinity).reply(200, {Games : []});

describe('crawler', function () {
    'use strict';

    before(function (done) {
        User.remove(done);
    });

    before(function (done) {
        Championship.remove(done);
    });

    before(function (done) {
        Team.remove(done);
    });

    before(function (done) {
        Bet.remove(done);
    });

    before(function (done) {
        Match.remove(done);
    });

    before(function (done) {
        Group.remove(done);
    });

    before(function (done) {
        GroupMember.remove(done);
    });

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'user'});
        user.save(done);
    });

    it('should populate database', crawler);

    after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/teams/Flamengo');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
            response.body.should.have.property('slug').be.equal('Flamengo');
            response.body.should.have.property('name').be.equal('Flamengo');
        });
        request.end(done);
    });

    after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/championships/Serie-A-Brazil-2014/matches/round-12-Atletico-PR-vs-Fluminense');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
            response.body.should.have.property('guest').with.property('name').be.equal('Fluminense');
            response.body.should.have.property('guest').with.property('slug').be.equal('Fluminense');
            response.body.should.have.property('host').with.property('name').be.equal('Atlético PR');
            response.body.should.have.property('host').with.property('slug').be.equal('Atletico-PR');
            response.body.should.have.property('round').be.equal(12);
            response.body.should.have.property('elapsed').be.equal(null);
            response.body.should.have.property('date');
            response.body.should.have.property('finished').be.equal(true);
            response.body.should.have.property('result').with.property('guest').be.equal(3);
            response.body.should.have.property('result').with.property('host').be.equal(0);
        });
        request.end(done);
    });

    after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/championships/Serie-A-Brazil-2014/matches/round-13-Fluminense-vs-Goias');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
            response.body.should.have.property('guest').with.property('name').be.equal('Goiás');
            response.body.should.have.property('guest').with.property('slug').be.equal('Goias');
            response.body.should.have.property('host').with.property('name').be.equal('Fluminense');
            response.body.should.have.property('host').with.property('slug').be.equal('Fluminense');
            response.body.should.have.property('round').be.equal(13);
            response.body.should.have.property('elapsed').be.equal(70);
            response.body.should.have.property('date');
            response.body.should.have.property('finished').be.equal(false);
            response.body.should.have.property('result').with.property('guest').be.equal(0);
            response.body.should.have.property('result').with.property('host').be.equal(2);
        });
        request.end(done);
    });
    /*
    after(function (done) {
        var request, credentials;
        credentials = auth.credentials();
        request = supertest(app);
        request = request.get('/championships/Serie-A-Brazil-2014/matches/round-14-Atletico-MG-vs-Palmeiras');
        request.set('auth-signature', credentials.signature);
        request.set('auth-timestamp', credentials.timestamp);
        request.set('auth-transactionId', credentials.transactionId);
        request.set('auth-token', auth.token(user));
        request.expect(200);
        request.expect(function (response) {
            response.body.should.have.property('guest').with.property('name').be.equal('Palmeiras');
            response.body.should.have.property('guest').with.property('slug').be.equal('Palmeiras');
            response.body.should.have.property('host').with.property('name').be.equal('Atlético MG');
            response.body.should.have.property('host').with.property('slug').be.equal('Atletico-MG');
            response.body.should.have.property('round').be.equal(14);
            response.body.should.have.property('elapsed').be.equal(null);
            response.body.should.have.property('date');
            response.body.should.have.property('finished').be.equal(false);
            response.body.should.have.property('result').with.property('guest').be.equal(0);
            response.body.should.have.property('result').with.property('host').be.equal(0);
        });
        request.end(done);
    });*/
});