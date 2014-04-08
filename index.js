var express, mongoose, nconf, bodyParser, scoreboard,
    app;

express    = require('express');
mongoose   = require('mongoose');
nconf      = require('nconf');
bodyParser = require('body-parser');
scoreboard = require('scoreboard');

nconf.argv().env();
nconf.defaults({
    'MONGOHQ_URL'    : 'mongodb://localhost/footbal',
    'REDISCLOUD_URL' : null,
    'PAGE_SIZE'      : 20,
    'PORT'           : 8080,
    'URI'            : 'http://localhost',
    'KEY'            : '-f-Z~Nyhq!3&oSP:Do@E(/pj>K)Tza%})Qh= pxJ{o9j)F2.*$+#n}XJ(iSKQnXf',
    'PASSWORD_SALT'  : 'MQE*zaHAVyt|nt#B&1RvN]`~exu@4&L/k a-,IS&Qz.|0`za~4YBqbNrL +L>J/0',
    'TOKEN_SALT'     : 'rED/+_/g0`s=Zhb%=591SB.]lG;b}pOW$Gu0;IQ+2uHqW+S|Ou@p.IV^XxjJUM^L',
    'INITIAL_FUNDS'  : 100
});

app = express();
app.use(bodyParser());
app.use(require('./lib/auth').signature);
app.use(require('./lib/auth').session);
app.use(require('./controllers/bet'));
app.use(require('./controllers/championship'));
app.use(require('./controllers/comment'));
app.use(require('./controllers/match'));
app.use(require('./controllers/team'));
app.use(require('./controllers/user'));
app.use(require('./controllers/group'));
app.get('/', function (request, response) {
    response.send(200, {'pageSize' : nconf.get('PAGE_SIZE')});
});

if (!module.parent) {
    mongoose.connect(nconf.get('MONGOHQ_URL'));
}

scoreboard.redis.createClient = function () {
    return require('./lib/redis');
};

app.listen(nconf.get('PORT'));
module.exports = app;