/**
 * @module
 * @summary Redis singleton module
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var redis, url, nconf,
    uri, client;

redis  = require('redis');
url    = require('url');
nconf  = require('nconf');

if (nconf.get('REDISCLOUD_URL')) {
    uri = url.parse(nconf.get('REDISCLOUD_URL'));
    client = redis.createClient(uri.port, uri.hostname);

    if (uri.auth) {client.auth(uri.auth.split(':')[1]);}
} else {
    client = redis.createClient();
}

module.exports = client;