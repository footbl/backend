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
app.use(function (error, request, response, next) {
    console.error(error);
    process.exit();
});
app.use('/docs', express.static(__dirname + '/docs'));
app.use(require('./controllers/user'));
app.use(require('./controllers/featured'));
app.use(require('./controllers/championship'));
app.use(require('./controllers/match'));
app.use(require('./controllers/bet'));
app.use(require('./controllers/team'));
app.use(require('./controllers/group'));
app.use(require('./controllers/group-member'));
app.listen(nconf.get('PORT'));

module.exports = app;