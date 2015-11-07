/*globals describe, before, it*/
'use strict';
require('should');
describe('challenge', function () {
  var supertest = require('supertest');
  var app = supertest(require('../index.js'));
  var User = require('../models/user');
  var Championship = require('../models/championship');
  var Match = require('../models/match');
  var Challenge = require('../models/challenge');

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

  before(function (done) {
    var user = new User();
    user._id = '563decb7a6269cb39236de99';
    user.email = 'u2@footbl.co';
    user.username = 'u2';
    user.password = require('crypto').createHash('sha1').update('1234' + require('nconf').get('PASSWORD_SALT')).digest('hex');
    user.save(done);
  });

  describe('create', function () {
    beforeEach(Challenge.remove.bind(Challenge));

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.post('/challenges').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
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
          app.post('/challenges').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
            'user'   : '563decb7a6269cb39236de98',
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
            app.post('/challenges').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
              'user'   : '563decb7a6269cb39236de98',
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
            app.post('/challenges').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).send({
              'user'   : '563decb7a6269cb39236de98',
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
        });
      });
    });
  });

  describe('list', function () {
    before(Challenge.remove.bind(Challenge));

    before(function (done) {
      var challenge = new Challenge();
      challenge._id = '563d72882cb3e53efe2827fc';
      challenge.challenger.user = '563decb2a6269cb39236de97';
      challenge.challenger.result = 'draw';
      challenge.challenged.user = '563decb7a6269cb39236de98';
      challenge.challenged.result = 'guest';
      challenge.bid = 10;
      challenge.match = '563d72882cb3e53efe2827m1';
      challenge.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/challenges').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with visible user', function () {
        it('should list one credit request', function (done) {
          app.get('/challenges').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(1)
          }).end(done)
        });
      });

      describe('without visible user', function () {
        it('should list zero credit requests', function (done) {
          app.get('/challenges').set('authorization', 'Basic ' + new Buffer('u2@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
            response.body.should.be.instanceOf(Array);
            response.body.should.have.lengthOf(0)
          }).end(done)
        });
      });
    });
  });

  describe('details', function () {
    before(Challenge.remove.bind(Challenge));

    before(function (done) {
      var challenge = new Challenge();
      challenge._id = '563d72882cb3e53efe2827fc';
      challenge.challenger.user = '563decb2a6269cb39236de97';
      challenge.challenger.result = 'draw';
      challenge.challenged.user = '563decb7a6269cb39236de98';
      challenge.challenged.result = 'guest';
      challenge.bid = 10;
      challenge.match = '563d72882cb3e53efe2827m1';
      challenge.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.get('/challenges/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.get('/challenges/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u2@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.get('/challenges/invalid').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should return', function (done) {
            app.get('/challenges/563d72882cb3e53efe2827fc').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(200).expect(function (response) {
              response.body.should.have.property('challenger');
              response.body.should.have.property('challenged');
              response.body.should.have.property('bid');
              response.body.should.have.property('match');
            }).end(done);
          });
        });
      });
    });
  });

  describe('accept', function () {
    beforeEach(Challenge.remove.bind(Challenge));

    beforeEach(function (done) {
      User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 90, 'stake' : 10}}, done);
    });

    beforeEach(function (done) {
      User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 100}}, done);
    });

    beforeEach(function (done) {
      Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : false}}, done);
    });

    beforeEach(function (done) {
      var challenge = new Challenge();
      challenge._id = '563d72882cb3e53efe2827fc';
      challenge.challenger.user = '563decb2a6269cb39236de97';
      challenge.challenger.result = 'draw';
      challenge.challenged.user = '563decb7a6269cb39236de98';
      challenge.challenged.result = 'guest';
      challenge.bid = 10;
      challenge.match = '563d72882cb3e53efe2827m1';
      challenge.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/challenges/563d72882cb3e53efe2827fc/accept').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.put('/challenges/563d72882cb3e53efe2827fc/accept').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.put('/challenges/invalid/accept').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          describe('with match started', function () {
            beforeEach(function (done) {
              User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 100}}, done);
            });

            beforeEach(function (done) {
              Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : true}}, done);
            });

            it('should raise error', function (done) {
              app.put('/challenges/563d72882cb3e53efe2827fc/accept').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(400).end(done)
            });
          });

          describe('with match unstarted', function () {
            beforeEach(function (done) {
              Match.update({'_id' : '563d72882cb3e53efe2827m1'}, {'$set' : {'finished' : false}}, done);
            });

            describe('with insufficient funds', function () {
              beforeEach(function (done) {
                User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 0}}, done);
              });

              it('should raise error', function (done) {
                app.put('/challenges/563d72882cb3e53efe2827fc/accept').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(400).end(done);
              });
            });

            describe('with sufficient funds', function () {
              beforeEach(function (done) {
                User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 100}}, done);
              });

              it('should create', function (done) {
                app.put('/challenges/563d72882cb3e53efe2827fc/accept').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(200).end(done)
              });

              after(function (done) {
                app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
                  response.body.should.have.property('funds').be.equal(90);
                  response.body.should.have.property('stake').be.equal(10);
                }).end(done);
              });

              after(function (done) {
                app.get('/users/563decb7a6269cb39236de98').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
                  response.body.should.have.property('funds').be.equal(90);
                  response.body.should.have.property('stake').be.equal(10);
                }).end(done);
              });
            });
          });
        });
      });
    });
  });

  describe('reject', function () {
    beforeEach(Challenge.remove.bind(Challenge));

    beforeEach(function (done) {
      User.update({'_id' : '563decb2a6269cb39236de97'}, {'$set' : {'funds' : 90, 'stake' : 10}}, done);
    });

    beforeEach(function (done) {
      User.update({'_id' : '563decb7a6269cb39236de98'}, {'$set' : {'funds' : 100}}, done);
    });

    beforeEach(function (done) {
      var challenge = new Challenge();
      challenge._id = '563d72882cb3e53efe2827fc';
      challenge.challenger.user = '563decb2a6269cb39236de97';
      challenge.challenger.result = 'draw';
      challenge.challenged.user = '563decb7a6269cb39236de98';
      challenge.challenged.result = 'guest';
      challenge.bid = 10;
      challenge.match = '563d72882cb3e53efe2827m1';
      challenge.save(done);
    });

    describe('without valid credentials', function () {
      it('should raise error', function (done) {
        app.put('/challenges/563d72882cb3e53efe2827fc/reject').set('authorization', 'Basic ' + new Buffer('invalid@footbl.co:1234').toString('base64')).expect(401).end(done)
      });
    });

    describe('with credentials', function () {
      describe('with other user credentials', function () {
        it('should raise error', function (done) {
          app.put('/challenges/563d72882cb3e53efe2827fc/reject').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(405).end(done);
        });
      });

      describe('with user credentials', function () {
        describe('without valid id', function () {
          it('should return', function (done) {
            app.put('/challenges/invalid/reject').expect(404).end(done);
          });
        });

        describe('with valid id', function () {
          it('should reject', function (done) {
            app.put('/challenges/563d72882cb3e53efe2827fc/reject').set('authorization', 'Basic ' + new Buffer('u1@footbl.co:1234').toString('base64')).expect(200).end(done);
          });

          after(function (done) {
            app.get('/users/563decb2a6269cb39236de97').set('authorization', 'Basic ' + new Buffer('u0@footbl.co:1234').toString('base64')).expect(function (response) {
              response.body.should.have.property('funds').be.equal(100);
              response.body.should.have.property('stake').be.equal(0);
            }).end(done);
          });
        });
      });
    });
  });
});
