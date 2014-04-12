/*globals describe, before, it, after*/
var request, app, mongoose, auth, nconf,
    User, Championship, Group, Wallet,
    group, otherGroup, user, otherUser, memberUser, candidateUser, championship, wallet, otherWallet, memberWallet, candidateWallet;

require('should');

request      = require('supertest');
app          = require('../index.js');
mongoose     = require('mongoose');
nconf        = require('nconf');
auth         = require('../lib/auth');
User         = require('../models/user');
Championship = require('../models/championship');
Group        = require('../models/group');
Wallet       = require('../models/wallet');

after(function (done) {
    'use strict';

    mongoose.connection.db.dropDatabase(done);
});

describe('group controller', function () {
    'use strict';

    before(function (done) {
        user = new User({'password' : '1234', 'type' : 'admin'});
        user.save(done);
    });

    before(function (done) {
        otherUser = new User({'password' : '12345', 'type' : 'admin'});
        otherUser.save(done);
    });

    before(function (done) {
        memberUser = new User({'password' : '12345', 'type' : 'admin'});
        memberUser.save(done);
    });

    before(function (done) {
        candidateUser = new User({'password' : '12345', 'type' : 'admin'});
        candidateUser.save(done);
    });

    before(function (done) {
        championship = new Championship({'name' : 'championship'});
        championship.save(done);
    });

    before(function (done) {
        wallet = new Wallet({user : user._id, championship : championship._id});
        wallet.save(done);
    });

    before(function (done) {
        otherWallet = new Wallet({user : otherUser._id, championship : championship._id});
        otherWallet.save(done);
    });

    before(function (done) {
        memberWallet = new Wallet({user : memberUser._id, championship : championship._id});
        memberWallet.save(done);
    });

    before(function (done) {
        candidateWallet = new Wallet({user : candidateUser._id, championship : championship._id});
        candidateWallet.save(done);
    });

    before(function (done) {
        group = new Group({
            'name' : 'test',
            'championship' : championship._id,
            'owner' : user._id,
            'members' : [{user : user._id}, {user : memberUser._id}]
        });
        group.save(done);
    });

    before(function (done) {
        otherGroup = new Group({
            'name' : 'test',
            'championship' : championship._id,
            'owner' : user._id,
            'members' : [{user : user._id}, {user : memberUser._id}]
        });
        otherGroup.save(done);
    });

    describe('create', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.post('/groups');
            req = req.send(auth.credentials());
            req = req.send({championship : championship._id, name : 'test'});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid championship', function (done) {
            var req = request(app);
            req = req.post('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : 'invalid', name : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without championship', function (done) {
            var req = request(app);
            req = req.post('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'test'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req = request(app);
            req = req.post('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : championship._id});
            req = req.expect(500);
            req.end(done);
        });

        it('should create with valid credentials, championship and name', function (done) {
            var req = request(app);
            req = req.post('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({championship : championship._id, name : 'test'});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('name');
                response.body.should.have.property('owner');
                response.body.should.have.property('freeToEdit');
            });
            req.end(done);
        });
    });

    describe('list', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/groups');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should list for users without groups', function (done) {
            var req = request(app);
            req = req.get('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array).with.lengthOf(0);
            });
            req.end(done);
        });

        it('should list with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (group) {
                    group.should.have.property('_id');
                    group.should.have.property('championship');
                    group.should.have.property('name');
                    group.should.have.property('owner');
                    group.should.have.property('freeToEdit');
                });
            });
            req.end(done);
        });
    });

    describe('details', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/groups/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/groups/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error for users that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.get('/groups/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(404);
            req.end(done);
        });

        it('should return', function (done) {
            var req = request(app);
            req = req.get('/groups/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('name');
                response.body.should.have.property('owner');
                response.body.should.have.property('freeToEdit');
            });
            req.end(done);
        });
    });

    describe('update', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({name : 'name', freeToEdit : false});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without name', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({freeToEdit : false});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error without freeToEdit', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'name'});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.put('/groups/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'name', freeToEdit : false});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error with user that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.send({name : 'name', freeToEdit : false});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error with user that don\'t is owner', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(memberUser)});
            req = req.send({name : 'name', freeToEdit : false});
            req = req.expect(401);
            req.end(done);
        });

        it('should update', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({name : 'name', freeToEdit : true});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('name');
                response.body.should.have.property('owner');
                response.body.should.have.property('freeToEdit');
            });
            req.end(done);
        });

        it('should update with user that don\'t is owner when is free to edit', function (done) {
            var req = request(app);
            req = req.put('/groups/' + group._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(memberUser)});
            req = req.send({name : 'name'});
            req = req.expect(200);
            req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('championship');
                response.body.should.have.property('name');
                response.body.should.have.property('owner');
                response.body.should.have.property('freeToEdit');
            });
            req.end(done);
        });
    });

    describe('delete', function () {
        var id;

        before(function (done) {
            var req = request(app);
            req = req.get('/groups');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                id = response.body[0]._id;
            });
            req.end(done);
        });

        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.del('/groups/' + id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.del('/groups/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error for users that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.del('/groups/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(404);
            req.end(done);
        });

        it('should delete', function (done) {
            var req = request(app);
            req = req.del('/groups/' + id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req.end(done);
        });
    });

    describe('create member', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.post('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({user : candidateUser._id});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error without user', function (done) {
            var req = request(app);
            req = req.post('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(500);
            req.end(done);
        });

        it('should raise error with user that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.post('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.send({user : candidateUser._id});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error with user that don\'t is owner', function (done) {
            var req = request(app);
            req = req.post('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(memberUser)});
            req = req.send({user : candidateUser._id});
            req = req.expect(401);
            req.end(done);
        });

        it('should create with valid credentials and user', function (done) {
            var req = request(app);
            req = req.post('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({user : candidateUser._id});
            req = req.expect(201);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('user');
                response.body.should.have.property('ranking');
            });
            req.end(done);
        });
    });

    describe('list members', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/groups/invalid/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error for users that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(404);
            req.end(done);
        });

        it('should list with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.be.instanceOf(Array);
                response.body.every(function (member) {
                    member.should.have.property('_id');
                    member.should.have.property('user');
                    member.should.have.property('ranking');
                });
            });
            req.end(done);
        });
    });

    describe('details member', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members/' + memberUser._id);
            req = req.send(auth.credentials());
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid id', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error for users that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members/' + memberUser._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(404);
            req.end(done);
        });

        it('should list with valid credentials', function (done) {
            var req = request(app);
            req = req.get('/groups/' + otherGroup._id + '/members/' + memberUser._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(200);
            req = req.expect(function (response) {
                response.body.should.have.property('_id');
                response.body.should.have.property('user');
                response.body.should.have.property('ranking');
            });
            req.end(done);
        });
    });

    describe('delete member', function () {
        it('should raise error without token', function (done) {
            var req = request(app);
            req = req.del('/groups/' + otherGroup._id + '/members/' + candidateUser._id);
            req = req.send(auth.credentials());
            req = req.send({user : candidateUser._id});
            req = req.expect(401);
            req.end(done);
        });

        it('should raise error with invalid member', function (done) {
            var req = request(app);
            req = req.del('/groups/' + otherGroup._id + '/members/invalid');
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error with user that don\'t belong to the group', function (done) {
            var req = request(app);
            req = req.del('/groups/' + otherGroup._id + '/members/' + candidateUser._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(otherUser)});
            req = req.expect(404);
            req.end(done);
        });

        it('should raise error with user that don\'t is owner', function (done) {
            var req = request(app);
            req = req.del('/groups/' + otherGroup._id + '/members/' + candidateUser._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(memberUser)});
            req = req.expect(401);
            req.end(done);
        });

        it('should remove with valid credentials and user', function (done) {
            var req = request(app);
            req = req.del('/groups/' + otherGroup._id + '/members/' + candidateUser._id);
            req = req.send(auth.credentials());
            req = req.send({token : auth.token(user)});
            req = req.send({user : candidateUser._id});
            req = req.expect(200);
            req.end(done);
        });
    });
});
