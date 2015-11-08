'use strict';
if (process.env.NEW_RELIC_LICENSE_KEY) require('newrelic');
var Domain, cluster, domain, nconf, async;
Domain = require('domain');
cluster = require('cluster');
nconf = require('nconf');
domain = Domain.create();
async = require('async');

nconf.env();
nconf.defaults({
  'MONGOLAB_URI'    : 'mongodb://localhost/footbl',
  'MANDRILL_APIKEY' : 'tbBa-7QGpKRaN8o0ehSDRw',
  'PORT'            : 8080,
  'PASSWORD_SALT'   : 'MQE*zaHAVyt|nt#B&1RvN]`~exu@4&L/k a-,IS&Qz.|0`za~4YBqbNrL +L>J/0',
  'VERSION'         : '3.0.0'
});

/** @apiDefine defaultHeaders
 *
 *  @apiHeader {String} authorization User credentials in the format 'Basic <user_email>:<user_password>' encoded in base 64.
 */

/** @apiDefine defaultPaging
 *
 *  @apiParam {Number} [page=0] Page to display.
 */

domain.on('error', function (error) {
  console.error(error.message);
  console.error(error.stack);
  cluster.worker.disconnect();
  setTimeout(process.exit, 5000);
});

domain.run(function () {
  var express, mongoose, rollbar, helmet,
  bodyParser, compression, responseTime, timeout, basicAuth, crypto, User,
  app, emitter;

  setInterval(function memoryUsageControl() {
    var usage;
    usage = process.memoryUsage().heapUsed / 1000000;
    if (usage > 100 && process.env.NODE_ENV !== 'test') emitter.emit('error', new Error('memory leak heap usage reached ' + usage + 'mB'));
  }, 10000);

  express = require('express');
  mongoose = require('mongoose');
  rollbar = require('rollbar');
  helmet = require('helmet');
  bodyParser = require('body-parser');
  compression = require('compression');
  responseTime = require('response-time');
  timeout = require('connect-timeout');
  basicAuth = require('basic-auth');
  crypto = require('crypto');
  emitter = new (require('events').EventEmitter)();
  mongoose.connect(nconf.get('MONGOLAB_URI'));
  User = require('./models/user');

  app = express();
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.noCache());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));
  app.use(compression());
  app.use(responseTime());
  app.use('/docs', express.static(__dirname + '/docs'));
  app.use(timeout('30s'));

  app.use(function (request, response, next) {
    async.waterfall([function (next) {
      var credentials, email, password, query;
      credentials = basicAuth(request);
      email = credentials ? credentials.name : '';
      password = crypto.createHash('sha1').update((credentials ? credentials.pass : '') + nconf.get('PASSWORD_SALT')).digest('hex');
      query = User.findOne();
      if ((/^[0-9a-fA-F]{24}$/).test(email)) {
        query.where('_id').equals(email);
      } else {
        query.where('email').equals(email);
      }
      query.where('password').equals(password);
      query.exec(next);
    }, function (user, next) {
      request.session = user;
      next();
    }], next);
  });

  app.get('/', function (request, response) {
    response.status(200).send({'version' : nconf.get('VERSION')});
  });

  app.use(require('./controllers/bet'));
  app.use(require('./controllers/championship'));
  app.use(require('./controllers/challenge'));
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
    } else if (error.message === 'invalid ctype') {
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
      next(error);
    }
  });

  if (nconf.get('ROLLBAR_ACCESS_TOKEN')) app.use(rollbar.errorHandler(nconf.get('ROLLBAR_ACCESS_TOKEN'), {'environment' : nconf.get('ENV')}));

  app.use(function (error, request, response, next) {
    response.status(500).end();
    emitter.emit('error', error);
    next();
  });

  app.listen(nconf.get('PORT'));
  module.exports = app;
});
