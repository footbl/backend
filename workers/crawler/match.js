var request, nconf, qs;
request = require("request");
nconf   = require('nconf');
qs      = require('querystring');

nconf.argv();
nconf.env();
nconf.defaults(require('../../config'));

exports.findPreGame = function (cb) {
    request(nconf.get("CRAWLER_URI") + '/matches?' + qs.stringify({'apikey' : nconf.get("CRAWLER_KEY"), 'status' : 'Pre-game'}), function(err, response, body) {
        cb(err, !err ? JSON.parse(body) : null);
    });
};

exports.findInProgress = function (cb) {
    request(nconf.get("CRAWLER_URI") + '/matches?' + qs.stringify({'apikey' : nconf.get("CRAWLER_KEY"), 'status' : 'In-progress'}), function(err, response, body) {
        cb(err, !err ? JSON.parse(body) : null);
    });
};

exports.findInFinal = function (cb) {
    request(nconf.get("CRAWLER_URI") + '/matches?' + qs.stringify({'apikey' : nconf.get("CRAWLER_KEY"), 'status' : 'Final'}), function(err, response, body) {
        cb(err, !err ? JSON.parse(body) : null);
    });
};

exports.findById = function (id, cb) {
    request(nconf.get("CRAWLER_URI") + '/matches/' + id + '?' + qs.stringify({'apikey' : nconf.get("CRAWLER_KEY")}), function(err, response, body) {
        cb(err, !err ? JSON.parse(body) : null);
    });
};
