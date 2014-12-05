'use strict';
var Domain, cluster, domain, nconf;
Domain = require('domain');
cluster = require('cluster');
nconf = require('nconf');
domain = Domain.create();

nconf.argv();
nconf.env();
nconf.defaults(require('./config'));

domain.on("error", function (error) {
  console.error(error);
  cluster.worker.disconnect();
  setTimeout(process.exit, 5000);
});

domain.run(function () {
  var EventEmitter, express, mongoose, bodyParser, methodOverride, auth, app, emitter;
  EventEmitter = require('events').EventEmitter;
  express = require('express');
  mongoose = require('mongoose');
  bodyParser = require('body-parser');
  methodOverride = require('method-override');
  auth = require('auth');
  emitter = new EventEmitter();

  mongoose.connect(nconf.get('MONGOHQ_URL'));
  auth.connect(nconf.get('REDISCLOUD_URL'), nconf.get('KEY'), require('./models/user'));

  setInterval(function () {
    var usage;
    usage = process.memoryUsage().heapUsed / 1000000;
    if (usage > 100) throw new Error('memory leak heap usage reached ' + usage + 'mB');
  }, 10000);

  app = express();
  app.use(bodyParser());
  app.use(methodOverride());
  app.enable('trust proxy');
  app.get('/', function (request, response) {
    response.send(200, {'version' : nconf.get('VERSION')});
  });
  app.use('/docs', express.static(__dirname + '/docs'));
  app.use(function (request, response, next) {
    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', request.get('Access-Control-Request-Method'));
    response.header('Access-Control-Allow-Headers', request.get('Access-Control-Request-Headers'));
    next();
  });
  app.use(auth.signature());
  app.use(require('./controllers/championship'));
  app.use(require('./controllers/user'));
  app.use(require('./controllers/featured'));
  app.use(require('./controllers/prize'));
  app.use(require('./controllers/bet'));
  app.use(require('./controllers/group'));
  app.use(require('./controllers/group-member'));
  app.use(require('./controllers/message'));
  app.use(require('./controllers/credit-request'));
  app.use(require('./controllers/entry'));
  app.use(function (error, request, response, next) {
    var errors, prop;
    if (error.message === 'not found') {
      response.status(404).end();
    } else if (error.message === 'invalid signature') {
      response.status(401).end();
    } else if (error.message === 'invalid session') {
      response.status(401).end();
    } else if (error.message === 'invalid method') {
      response.status(405).end();
    } else if ([11000, 11001].lastIndexOf(error.code) > -1) {
      response.status(409).end();
    } else if (error.errors) {
      errors = {};
      for (prop in error.errors) {
        if (error.errors.hasOwnProperty(prop)) {
          errors[prop] = error.errors[prop].type === 'user defined' ? error.errors[prop].message : error.errors[prop].type;
        }
      }
      response.status(400).send(errors);
    } else {
      response.status(500).end();
      emitter.emit('error', error);
    }
    next();
  });
  app.listen(nconf.get('PORT'));
  module.exports = app;
});
