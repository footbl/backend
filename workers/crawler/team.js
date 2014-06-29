var request, nconf, qs;
request = require("request");
nconf   = require('nconf');
qs      = require('querystring');

nconf.argv();
nconf.env();
nconf.defaults(require('../../config'));

exports.find = function (cb) {
    request(nconf.get("CRAWLER_URI") + '/teams?' + qs.stringify({'apikey' : nconf.get("CRAWLER_KEY")}), function(err, response, body) {
        cb(err, !err ? JSON.parse(body) : null);
    });
};

exports.findById = function (id, cb) {
    request(nconf.get("CRAWLER_URI") + '/teams/' + id + '?' + qs.stringify({'apikey' : nconf.get("CRAWLER_KEY")}), function(err, response, body) {
        cb(err, !err ? JSON.parse(body) : null);
    });
};
