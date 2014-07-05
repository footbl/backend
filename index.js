'use strict';
var express, mongoose, nconf, bodyParser, methodOverride,
    app;

express        = require('express');
mongoose       = require('mongoose');
nconf          = require('nconf');
bodyParser     = require('body-parser');
methodOverride = require('method-override');

nconf.argv();
nconf.env();
nconf.defaults(require('./config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));

app = express();
app.use(bodyParser());
app.use(methodOverride());
app.use(function (request, response, next) {
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');
    next();
});
app.options('/*', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', request.get('Access-Control-Request-Method'));
    response.header('Access-Control-Allow-Headers', request.get('Access-Control-Request-Headers'));
    response.end();
});
app.use(function (error, request, response, next) {
    console.error(error);
    process.exit();
});
app.use(require('./lib/auth').signature);
app.use(require('./lib/auth').facebook);
app.use(require('./lib/auth').session);
app.use(require('./controllers/championship'));
app.use(require('./controllers/match'));
app.use(require('./controllers/team'));
app.use(require('./controllers/group'));
app.get('/', function (request, response) { response.send(200, {'pageSize' : nconf.get('PAGE_SIZE')}); });
app.listen(nconf.get('PORT'));

module.exports = app;