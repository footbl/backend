/*globals describe, before, it*/
'use strict';
require('should');
describe('bet', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var Championship = require('../models/championship');
  var Match = require('../models/match');
  var Bet = require('../models/bet');

  before(User.remove.bind(User));
  before(Championship.remove.bind(Championship));
  before(Match.remove.bind(Match));

  before(function (done) {
    var championship = new Championship();
    championship._id = '563d72882cb3e53efe2827c1';
    championship.name = 'brasileirão';
    championship.type = 'national league';
    championship.country = 'Brazil';
    championship.save(done);
  });

  before(function (done) {
    var match = new Match();
    match._id = '563d72882cb3e53efe2827m1';
    match.round = 1;
    match.date = new Date();
    match.guest = {'name' : 'botafogo', 'picture' : 'http://pictures.com/botafogo.png'};
    match.host = {'name' : 'fluminense', 'picture' : 'http://pictures.com/fluminense.png'};
    match.championship = '563d72882cb3e53efe2827c1';
    match.save(done);
  });

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

  describe('create', function () {
    beforeEach(Bet.remove.bind(Bet));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.post('/bets').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with valid credentials', function () {
      describe('with match started', function () {
        before(function (done) {
          User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 100}}, done);
        });

        before(function (done) {
          User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 100}}, done);
        });

        before(function (done) {
          Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : true}}, done);
        });

        it('should raise error', function (done) {
          app.post('/bets').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
            'match'  : '563d72882cb3e53efe2827m1',
            'result' : 'draw',
            'bid'    : 10
          }).expect(400).end(done)
        });
      });

      describe('with match unstarted', function () {
        beforeEach(function (done) {
          Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : false}}, done);
        });

        describe('with insufficient funds', function () {
          before(function (done) {
            User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 0}}, done);
          });

          before(function (done) {
            User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 0}}, done);
          });

          it('should raise error', function (done) {
            app.post('/bets').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
              'match'  : '563d72882cb3e53efe2827m1',
              'result' : 'draw',
              'bid'    : 10
            }).expect(400).end(done);
          });
        });

        describe('with sufficient funds', function () {
          before(function (done) {
            User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 100}}, done);
          });

          before(function (done) {
            User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 100}}, done);
          });

          it('should create', function (done) {
            app.post('/bets').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
              'match'  : '563d72882cb3e53efe2827m1',
              'result' : 'draw',
              'bid'    : 10
            }).expect(201).end(done)
          });

          after(function (done) {
            app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
              response.body.should.have.property('funds').be.equal(90);
              response.body.should.have.property('stake').be.equal(10);
            }).end(done);
          });

          after(function (done) {
            app.get('/matches/563d72882cb3e53efe2827m1').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
              response.body.should.have.property('pot').have.property('draw').be.equal(10);
            }).end(done);
          });
        });
      });
    });
  });

  describe('list', function () {
    before(Bet.remove.bind(Bet));

    before(function (done) {
      var bet = new Bet();
      bet._id = '563d72882cb3e53efe2827fc';
      bet.user = '563decb2a6269cb39236de97';
      bet.match = '563d72882cb3e53efe2827m1';
      bet.result = 'draw';
      bet.bid = 10;
      bet.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/bets').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      it('should list one bet', function (done) {
        app.get('/bets').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
          response.body.should.be.instanceOf(Array);
          response.body.should.have.lengthOf(1)
        }).end(done)
      });
    });
  });

  describe('get', function () {
    before(Bet.remove.bind(Bet));

    before(function (done) {
      var bet = new Bet();
      bet._id = '563d72882cb3e53efe2827fc';
      bet.user = '563decb2a6269cb39236de97';
      bet.match = '563d72882cb3e53efe2827m1';
      bet.result = 'draw';
      bet.bid = 10;
      bet.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('without valid id', function () {
        it('should return', function (done) {
          app.get('/bets/invalid').expect(404).end(done);
        });
      });

      describe('with valid id', function () {
        it('should return', function (done) {
          app.get('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.have.property('user');
            response.body.should.have.property('match');
            response.body.should.have.property('result');
            response.body.should.have.property('bid');
          }).end(done);
        });
      });
    });
  });

  describe('update', function () {
    beforeEach(Bet.remove.bind(Bet));

    beforeEach(function (done) {
      User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 90, 'stake' : 10}}, done);
    });

    beforeEach(function (done) {
      Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : false}}, done);
    });

    beforeEach(function (done) {
      var bet = new Bet();
      bet._id = '563d72882cb3e53efe2827fc';
      bet.user = '563decb2a6269cb39236de97';
      bet.match = '563d72882cb3e53efe2827m1';
      bet.result = 'draw';
      bet.bid = 10;
      bet.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.put('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.put('/bets/invalid').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          describe('with match started', function () {
            beforeEach(function (done) {
              User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 90}}, done);
            });

            beforeEach(function (done) {
              Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : true}}, done);
            });

            it('should raise error', function (done) {
              app.put('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(400).end(done)
            });
          });

          describe('with match unstarted', function () {
            beforeEach(function (done) {
              Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : false}}, done);
            });

            describe('with insufficient funds', function () {
              beforeEach(function (done) {
                User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 0}}, done);
              });

              it('should raise error', function (done) {
                app.put('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(400).end(done);
              });
            });

            describe('with sufficient funds', function () {
              beforeEach(function (done) {
                User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 90}}, done);
              });

              it('should update', function (done) {
                app.put('/bets/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
                  'match'  : '563d72882cb3e53efe2827m1',
                  'result' : 'guest',
                  'bid'    : 10
                }).expect(200).end(done)
              });

              after(function (done) {
                app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
                  response.body.should.have.property('funds').be.equal(90);
                  response.body.should.have.property('stake').be.equal(10);
                }).end(done);
              });

              after(function (done) {
                app.get('/matches/563d72882cb3e53efe2827m1').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
                  response.body.should.have.property('pot').have.property('draw').be.equal(0);
                  response.body.should.have.property('pot').have.property('guest').be.equal(10);
                }).end(done);
              });
            });
          });
        });
      });
    });
  });
});
