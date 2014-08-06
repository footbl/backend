'use strict';
var express, mongoose, nconf, bodyParser, methodOverride, auth,
app;

express = require('express');
mongoose = require('mongoose');
nconf = require('nconf');
bodyParser = require('body-parser');
methodOverride = require('method-override');
auth = require('./lib/auth');

nconf.argv();
nconf.env();
nconf.defaults(require('./config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

app = express();
app.use(bodyParser());
app.use(methodOverride());
app.get('/', function (request, response) {
    response.send(200, {'version' : nconf.get('VERSION')});
});
app.use('/docs', express.static(__dirname + '/docs'));
app.use(auth.signature());
app.use(auth.facebook());
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
app.use(require('./controllers/user'));
app.use(require('./controllers/featured'));
app.use(require('./controllers/championship'));
app.use(require('./controllers/match'));
app.use(require('./controllers/bet'));
app.use(require('./controllers/team'));
app.use(require('./controllers/group'));
app.use(require('./controllers/group-member'));
app.use(function (error, request, response, next) {
    var errors, prop;
    if (error && error.cause && error.cause()) {
        if (error.cause().code === 11000) {
            return response.send(409);
        }
        if (error.cause().errors) {
            errors = {};
            for (prop in error.cause().errors) {
                if (error.cause().errors.hasOwnProperty(prop)) {
                    errors[prop] = error.cause().errors[prop].type;
                }
            }
            return response.send(400, errors);
        }
        if (error.message.indexOf('match already started') > -1) {
            return response.send(400);
        }
        if (error.message.indexOf('insufficient funds') > -1) {
            return response.send(400);
        }
    }
    console.error(error);
    response.send(500);
    return process.exit();
});
app.listen(nconf.get('PORT'));

module.exports = app;