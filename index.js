var express, mongoose, nconf, bodyParser,
    app;

express    = require('express');
mongoose   = require('mongoose');
nconf      = require('nconf');
bodyParser = require('body-parser');

nconf.argv().env();
nconf.defaults({
    'mongo-uri'     : 'mongodb://localhost/footbal',
    'redis-uri'     : null,
    'page-size'     : 20,
    'server-port'   : 8080,
    'server-uri'    : 'http://localhost',
    'server-key'    : '-f-Z~Nyhq!3&oSP:Do@E(/pj>K)Tza%})Qh= pxJ{o9j)F2.*$+#n}XJ(iSKQnXf',
    'password-salt' : 'MQE*zaHAVyt|nt#B&1RvN]`~exu@4&L/k a-,IS&Qz.|0`za~4YBqbNrL +L>J/0',
    'token-salt'    : 'rED/+_/g0`s=Zhb%=591SB.]lG;b}pOW$Gu0;IQ+2uHqW+S|Ou@p.IV^XxjJUM^L'
});

app = express();
app.use(bodyParser());
app.use(require('./lib/auth').signature);
app.use('/users', require('./controllers/session'));
app.use('/users', require('./controllers/user'));

if (!module.parent) {
    mongoose.connect(nconf.get('mongo-uri'));
}

app.listen(nconf.get('server-port'));
module.exports = app;