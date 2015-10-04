'use strict';
var Domain, cluster, domain, nconf;
Domain = require('domain');
cluster = require('cluster');
nconf = require('nconf');
domain = Domain.create();

nconf.argv();
nconf.env();
nconf.defaults(require('./config'));

domain.on('error', function (error) {
  console.error(error.message);
  console.error(error.stack);
  console.error(JSON.stringify(error, 4, 4));
  cluster.worker.disconnect();
  setTimeout(process.exit, 5000);
});

domain.run(function () {
  var EventEmitter, express, mongoose, bodyParser, auth, app, emitter;
  EventEmitter = require('events').EventEmitter;
  express = require('express');
  mongoose = require('mongoose');
  bodyParser = require('body-parser');
  auth = require('auth');
  emitter = new EventEmitter();

  mongoose.connect(nconf.get('MONGOLAB_URI'));
  auth.connect(nconf.get('REDISTOGO_URL'), nconf.get('KEY'), require('./models/user'));

  setInterval(function () {
    var usage;
    usage = process.memoryUsage().heapUsed / 1000000;
    if (usage > 100) throw new Error('memory leak heap usage reached ' + usage + 'mB');
  }, 10000);

  app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));
  app.get('/', function (request, response) {
    response.status(200);
    response.json({'version' : nconf.get('VERSION')});
  });
  app.use('/docs', express.static(__dirname + '/docs'));

  app.use(require('./controllers/bet'));
  app.use(require('./controllers/championship'));
  app.use(require('./controllers/season'));
  app.use(require('./controllers/user'));
  app.use(require('./controllers/prize'));
  app.use(require('./controllers/group'));
  app.use(require('./controllers/match'));
  app.use(require('./controllers/message'));
  app.use(require('./controllers/credit-request'));

  app.use(function mongooseErrorParser(error, request, response, next) {
    var errors, prop;
    if (error.message === 'not found') {
      response.status(404).end();
    } else if (error.message === 'invalid signature') {
      response.status(401).end();
    } else if (error.message === 'invalid version') {
      response.status(412).end();
    } else if (error.message === 'invalid session') {
      response.status(401).end();
    } else if (error.message === 'invalid method') {
      response.status(405).end();
    } else if ([11000, 11001].lastIndexOf(error.code) > -1 || error.message === 'duplicated') {
      response.status(409).end();
    } else if (error.errors) {
      errors = {};
      for (prop in error.errors) {
        if (error.errors.hasOwnProperty(prop)) {
          errors[prop] = error.errors[prop].kind === 'user defined' ? error.errors[prop].message : error.errors[prop].kind;
        }
      }
      response.status(400).json(errors);
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
      response.status(404).end();
    } else if (error.name === 'MongoError' && error.message === 'Can\'t canonicalize query: BadValue bad skip value in query') {
      response.status(400).json({'page' : 'invalid'});
    } else {
      response.status(500).end();
      emitter.emit('error', error);
    }
    next();
  });

  app.listen(nconf.get('PORT'));
  module.exports = app;
});
