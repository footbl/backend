/*globals describe, before, it, after*/
require('should');
var request, app, auth,
User, Championship, Match, Team, Bet, Group, GroupMember, ranking, previousRanking,
user, groupOwner, otherUser, guestBetter, hostBetter, drawBetter, slug;

request = require('supertest');
app = require('../index.js');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');
Bet = require('../models/bet');
Group = require('../models/group');
GroupMember = require('../models/group-member');
ranking = require('../workers/group-ranking');
previousRanking = require('../workers/group-previous-ranking');

describe('group ranking', function () {
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

    before(function (done) {
        groupOwner = new User({'password' : '1234', 'slug' : 'group-owner'});
        groupOwner.save(done);
    });

    before(function (done) {
        guestBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'guest-better', 'email' : 'guest-better@footbl.co'});
        guestBetter.save(done);
    });

    before(function (done) {
        hostBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'host-better', 'email' : 'other-better@footbl.co'});
        hostBetter.save(done);
    });

    before(function (done) {
        drawBetter = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'draw-better', 'email' : 'draw-better@footbl.co'});
        drawBetter.save(done);
    });

    before(function (done) {
        otherUser = new User({'password' : '1234', 'type' : 'admin', 'slug' : 'other-user'});
        otherUser.save(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/groups');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(groupOwner));
        req = req.send({'name' : 'college buddies'});
        req = req.send({'freeToEdit' : true});
        req.expect(function (response) {
            slug = response.body.slug;
        });
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/groups/' + slug + '/members');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(groupOwner));
        req = req.send({'group' : slug});
        req = req.send({'user' : drawBetter.slug});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/groups/' + slug + '/members');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(groupOwner));
        req = req.send({'group' : slug});
        req = req.send({'user' : guestBetter.slug});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/groups/' + slug + '/members');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(groupOwner));
        req = req.send({'group' : slug});
        req = req.send({'user' : hostBetter.slug});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/championships');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'brasileirão'});
        req = req.send({'type' : 'national league'});
        req = req.send({'country' : 'brasil'});
        req = req.send({'edition' : 2014});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/teams');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'fluminense'});
        req = req.send({'picture' : 'http://pictures.com/fluminense.png'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/teams');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'name' : 'botafogo'});
        req = req.send({'picture' : 'http://pictures.com/botafogo.png'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/championships/brasileirao-brasil-2014/matches');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'guest' : 'botafogo'});
        req = req.send({'host' : 'fluminense'});
        req = req.send({'round' : '1'});
        req = req.send({'date' : new Date(2014, 10, 10)});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(drawBetter));
        req = req.send({'bid' : 20});
        req = req.send({'result' : 'draw'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(guestBetter));
        req = req.send({'bid' : 30});
        req = req.send({'result' : 'guest'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.post('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo/bets');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(hostBetter));
        req = req.send({'bid' : 40});
        req = req.send({'result' : 'host'});
        req.end(done);
    });

    before(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.put('/championships/brasileirao-brasil-2014/matches/round-1-fluminense-vs-botafogo');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req = req.send({'guest' : 'botafogo'});
        req = req.send({'host' : 'fluminense'});
        req = req.send({'round' : '1'});
        req = req.send({'date' : new Date(2014, 10, 10)});
        req = req.send({'score' : {'guest' : 1, 'host' : 2}});
        req = req.send({'finished' : true});
        req.end(done);
    });

    it('should sort', ranking);

    it('should update previous ranking', previousRanking);

    after(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.get('/groups/' + slug + '/members/host-better');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req.expect(function (response) {
            response.body.should.have.property('ranking').be.equal(1);
            response.body.should.have.property('previousRanking').be.equal(1);
        });
        req.end(done);
    });

    after(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.get('/groups/' + slug + '/members/draw-better');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req.expect(function (response) {
            response.body.should.have.property('ranking').be.equal(3);
            response.body.should.have.property('previousRanking').be.equal(3);
        });
        req.end(done);
    });

    after(function (done) {
        var req, credentials;
        credentials = auth.credentials();
        req = request(app);
        req = req.get('/groups/' + slug + '/members/guest-better');
        req = req.set('auth-signature', credentials.signature);
        req = req.set('auth-timestamp', credentials.timestamp);
        req = req.set('auth-transactionId', credentials.transactionId);
        req = req.set('auth-token', auth.token(user));
        req.expect(function (response) {
            response.body.should.have.property('ranking').be.equal(4);
            response.body.should.have.property('previousRanking').be.equal(4);
        });
        req.end(done);
    });
});