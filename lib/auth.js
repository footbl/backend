var crypto, nconf, graph, redis, url,
secondsInOneHour, milisecondsInOneHour, uri, client, User;

redis = require('redis');
url = require('url');
crypto = require('crypto');
nconf = require('nconf');
graph = require('fbgraph');
User = require('../models/user');

secondsInOneHour = 60 * 60;
milisecondsInOneHour = secondsInOneHour * 1000;

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

if (nconf.get('REDISCLOUD_URL')) {
  uri = url.parse(nconf.get('REDISCLOUD_URL'));
  client = redis.createClient(uri.port, uri.hostname);

  if (uri.auth) {
    client.auth(uri.auth.split(':')[1]);
  }
} else {
  client = redis.createClient();
}

exports.credentials = function (timestamp, transactionId) {
  'use strict';

  var key;

  timestamp = timestamp || new Date().getTime();
  transactionId = transactionId || crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex');
  key = nconf.get('KEY');

  return {
    timestamp     : timestamp,
    transactionId : transactionId,
    signature     : crypto.createHash('sha1').update(timestamp + transactionId + key).digest('hex')
  };
};

exports.signature = function () {
  'use strict';

  return function (request, response, next) {
    var timestamp, transactionId, signature, validSignature, now;
    now = new Date().getTime();
    signature = request.get('auth-signature');
    timestamp = request.get('auth-timestamp');
    transactionId = request.get('auth-transactionId');
    validSignature = exports.credentials(timestamp, transactionId).signature;

    client.get(transactionId, function (error, used) {
      if (error) {
        return response.send(500, error);
      }
      if (used) {
        return response.send(401, 'invalid transactionId');
      }
      if (now - timestamp > milisecondsInOneHour) {
        return response.send(401, 'invalid timestamp');
      }
      if (signature !== validSignature) {
        return response.send(401, 'invalid signature');
      }

      if (request.method !== 'OPTIONS') {
        client.set(transactionId, timestamp);
        client.expire(transactionId, secondsInOneHour);
      }
      return next();
    });
  };
};

exports.token = function (user) {
  'use strict';

  var token, timestamp, key;

  timestamp = new Date().getTime();
  key = nconf.get('TOKEN_SALT');
  token = crypto.createHash('sha1').update(timestamp + user._id + key).digest('hex');

  client.set(token, user._id);
  client.expire(token, secondsInOneHour);

  return token;
};

exports.session = function (type) {
  'use strict';

  return function (request, response, next) {
    var token;
    token = request.get('auth-token');

    return client.get(token, function (error, id) {
      if (error) {
        return response.send(500, error);
      }
      if (!id) {
        return response.send(401);
      }
      return User.findById(id, function (error, user) {
        if (error) {
          return response.send(500, error);
        }
        if (!user) {
          return response.send(401);
        }
        if (type && type !== user.type) {
          response.send(401);
        }
        request.session = user;
        return next();
      });
    });
  };
};

exports.facebook = function () {
  'use strict';

  return function (request, response, next) {
    var token;
    token = request.get('facebook-token');
    if (!token) {
      return next();
    }
    return graph.get('/me?access_token=' + token, function (error, data) {
      if (!error && data && data.id) {
        request.facebook = data.id;
      }
      next();
    });
  };
};