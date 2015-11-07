/*globals describe, before, it*/
'use strict';
require('should');
describe('group', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var Group = require('../models/group');

  before(User.remove.bind(User));

  before(function (done) {
    var user = new User();
    user._id = '563decb2a6269cb39236de97';
    user.email = 'owner@footbl.co';
    user.username = 'owner';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de98';
    user.email = 'u1@footbl.co';
    user.username = 'u1';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('create', function () {
    beforeEach(Group.remove.bind(Group));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.post('/groups').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      it('should create', function (done) {
        app.post('/groups').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).send({'name' : 'teste'}).expect(201).end(done)
      });
    });
  });

  describe('list', function () {
    before(Group.remove.bind(Group));

    before(function (done) {
      var group = new Group();
      group._id = '563d72882cb3e53efe2827fc';
      group.name = 'teste';
      group.code = new Date().getTime().toString(36).substring(3);
      group.owner = '563decb2a6269cb39236de97';
      group.picture = 'picture';
      group.members = ['563decb2a6269cb39236de97'];
      group.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/groups').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      it('should list one group', function (done) {
        app.get('/groups').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1)
        }).end(done)
      });
    });
  });

  describe('get', function () {
    before(Group.remove.bind(Group));

    before(function (done) {
      var group = new Group();
      group._id = '563d72882cb3e53efe2827fc';
      group.name = 'teste';
      group.code = new Date().getTime().toString(36).substring(3);
      group.owner = '563decb2a6269cb39236de97';
      group.picture = 'picture';
      group.members = ['563decb2a6269cb39236de97'];
      group.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('without valid id', function () {
        it('should return', function (done) {
          app.get('/groups/invalid').expect(404).end(done);
        });
      });

      describe('with valid id', function () {
        it('should return', function (done) {
          app.get('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.have.property('name').be.equal('teste');
            response.body.should.have.property('code');
            response.body.should.have.property('owner');
            response.body.should.have.property('picture').be.equal('picture');
          }).end(done);
        });
      });
    });
  });

  describe('update', function () {
    beforeEach(Group.remove.bind(Group));

    beforeEach(function (done) {
      var group = new Group();
      group._id = '563d72882cb3e53efe2827fc';
      group.name = 'teste';
      group.code = new Date().getTime().toString(36).substring(3);
      group.owner = '563decb2a6269cb39236de97';
      group.picture = 'picture';
      group.members = ['563decb2a6269cb39236de97'];
      group.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      describe('without owner credentials', function () {
        it('should raise error', function (done) {
          app.put('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(405).end(done)
        });
      });

      describe('with owner credentials', function () {
        describe('without valid id', function () {
          it('should raise error', function (done) {
            app.put('/groups/invalid').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(404).end(done)
          });
        });

        describe('with valid id', function () {
          it('should update', function (done) {
            app.put('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).send({'name' : 'teste'}).expect(200).end(done)
          });
        });
      });
    });
  });

  describe('invite', function () {
    beforeEach(Group.remove.bind(Group));

    beforeEach(function (done) {
      var group = new Group();
      group._id = '563d72882cb3e53efe2827fc';
      group.name = 'teste';
      group.code = new Date().getTime().toString(36).substring(3);
      group.owner = '563decb2a6269cb39236de97';
      group.picture = 'picture';
      group.members = ['563decb2a6269cb39236de97'];
      group.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/groups/563d72882cb3e53efe2827fc/invite').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      describe('without owner credentials', function () {
        it('should raise error', function (done) {
          app.put('/groups/563d72882cb3e53efe2827fc/invite').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(405).end(done)
        });
      });

      describe('with owner credentials', function () {
        describe('without valid id', function () {
          it('should raise error', function (done) {
            app.put('/groups/invalid/invite').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(404).end(done)
          });
        });

        describe('with valid id', function () {
          describe('registered user', function () {
            it('should invite', function (done) {
              app.put('/groups/563d72882cb3e53efe2827fc/invite').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).send({'user' : '563decb7a6269cb39236de98'}).expect(200).end(done)
            });
          });

          describe('unregistered user', function () {
            it('should invite', function (done) {
              app.put('/groups/563d72882cb3e53efe2827fc/invite').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).send({'user' : 'ungestired@footbl.co'}).expect(200).end(done)
            });
          });
        });
      });
    });
  });

  describe('leave', function () {
    beforeEach(Group.remove.bind(Group));

    beforeEach(function (done) {
      var group = new Group();
      group._id = '563d72882cb3e53efe2827fc';
      group.name = 'teste';
      group.code = new Date().getTime().toString(36).substring(3);
      group.owner = '563decb2a6269cb39236de97';
      group.picture = 'picture';
      group.members = ['563decb2a6269cb39236de97', '563decb7a6269cb39236de98'];
      group.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/groups/563d72882cb3e53efe2827fc/leave').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      describe('without valid id', function () {
        it('should raise error', function (done) {
          app.put('/groups/invalid/leave').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(404).end(done)
        });
      });

      describe('with valid id', function () {
        it('should leave', function (done) {
          app.put('/groups/563d72882cb3e53efe2827fc/leave').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(200).end(done)
        });
      });
    });
  });

  describe('delete', function () {
    beforeEach(Group.remove.bind(Group));

    beforeEach(function (done) {
      var group = new Group();
      group._id = '563d72882cb3e53efe2827fc';
      group.name = 'teste';
      group.code = new Date().getTime().toString(36).substring(3);
      group.owner = '563decb2a6269cb39236de97';
      group.picture = 'picture';
      group.members = ['563decb2a6269cb39236de97'];
      group.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.del('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      describe('without owner credentials', function () {
        it('should raise error', function (done) {
          app.del('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(405).end(done)
        });
      });

      describe('with owner credentials', function () {
        describe('without valid id', function () {
          it('should raise error', function (done) {
            app.del('/groups/invalid').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(404).end(done)
          });
        });

        describe('with valid id', function () {
          it('should delete', function (done) {
            app.del('/groups/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('owner@footbl.co:1234').toString('base64')).expect(204).end(done)
          });
        });
      });
    });
  });
});
