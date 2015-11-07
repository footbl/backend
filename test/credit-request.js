/*globals describe, before, it*/
'use strict';
require('should');
describe('credit request', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var CreditRequest = require('../models/credit-request');

  before(User.remove.bind(User));

  before(function (done) {
    var user = new User();
    user._id = '563decb2a6269cb39236de97';
    user.email = 'u0@footbl.co';
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

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de99';
    user.email = 'u2@footbl.co';
    user.username = 'u2';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('create', function () {
    beforeEach(CreditRequest.remove.bind(CreditRequest));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.post('/credit-requests').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      describe('registered user', function () {
        it('should create', function (done) {
          app.post('/credit-requests').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({'user' : '563decb7a6269cb39236de98'}).expect(201).end(done)
        });
      });

      describe('unregistered user', function () {
        it('should create', function (done) {
          app.post('/credit-requests').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({'user' : '1234'}).expect(201).end(done)
        });
      });
    });
  });

  describe('list', function () {
    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var creditRequest = new CreditRequest();
      creditRequest._id = '563d72882cb3e53efe2827fc';
      creditRequest.creditedUser = '563decb2a6269cb39236de97';
      creditRequest.chargedUser = '563decb7a6269cb39236de98';
      creditRequest.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/credit-requests').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with visible user', function () {
        it('should list one credit request', function (done) {
          app.get('/credit-requests').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(1)
          }).end(done)
        });
      });

      describe('without visible user', function () {
        it('should list zero credit requests', function (done) {
          app.get('/credit-requests').set('authorization', 'Basic ' + new Buffer('u2@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(0)
          }).end(done)
        });
      });
    });
  });

  describe('details', function () {
    before(CreditRequest.remove.bind(CreditRequest));

    before(function (done) {
      var creditRequest = new CreditRequest();
      creditRequest._id = '563d72882cb3e53efe2827fc';
      creditRequest.creditedUser = '563decb2a6269cb39236de97';
      creditRequest.chargedUser = '563decb7a6269cb39236de98';
      creditRequest.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/credit-requests/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.get('/credit-requests/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u2@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.get('/credit-requests/invalid').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should return', function (done) {
            app.get('/credit-requests/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
              response.body.should.have.property('creditedUser');
              response.body.should.have.property('chargedUser');
            }).end(done);
          });
        });
      });
    });
  });

  describe('approve', function () {
    beforeEach(CreditRequest.remove.bind(CreditRequest));

    beforeEach(function (done) {
      User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 0}}, done);
    });

    beforeEach(function (done) {
      User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 200}}, done);
    });

    beforeEach(function (done) {
      var creditRequest = new CreditRequest();
      creditRequest._id = '563d72882cb3e53efe2827fc';
      creditRequest.creditedUser = '563decb2a6269cb39236de97';
      creditRequest.chargedUser = '563decb7a6269cb39236de98';
      creditRequest.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/credit-requests/563d72882cb3e53efe2827fc/approve').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.put('/credit-requests/563d72882cb3e53efe2827fc/approve').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.put('/credit-requests/invalid/approve').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should approve', function (done) {
            app.put('/credit-requests/563d72882cb3e53efe2827fc/approve').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(200).end(done);
          });

          after(function (done) {
            app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
              response.body.should.have.property('funds').be.equal(100);
            }).end(done);
          });

          after(function (done) {
            app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(function (response) {
              response.body.should.have.property('funds').be.equal(100);
            }).end(done);
          });
        });
      });
    });
  });

  describe('reject', function () {
    beforeEach(CreditRequest.remove.bind(CreditRequest));

    beforeEach(function (done) {
      User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 0}}, done);
    });

    beforeEach(function (done) {
      User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 200}}, done);
    });

    beforeEach(function (done) {
      var creditRequest = new CreditRequest();
      creditRequest._id = '563d72882cb3e53efe2827fc';
      creditRequest.creditedUser = '563decb2a6269cb39236de97';
      creditRequest.chargedUser = '563decb7a6269cb39236de98';
      creditRequest.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/credit-requests/563d72882cb3e53efe2827fc/reject').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.put('/credit-requests/563d72882cb3e53efe2827fc/reject').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.put('/credit-requests/invalid/reject').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should reject', function (done) {
            app.put('/credit-requests/563d72882cb3e53efe2827fc/reject').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(200).end(done);
          });
        });
      });
    });
  });
});
