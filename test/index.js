'use strict';

var now, nock;
now = new Date();
nock = require('nock');

nock('https://graph.facebook.com').get('/me?access_token=1234').times(Infinity).reply(200, {'id' : '111'});
nock('https://graph.facebook.com').get('/me?access_token=1235').times(Infinity).reply(200, {'id' : '112'});
nock('https://graph.facebook.com').get('/me?access_token=invalid').times(Infinity).reply(404, {});
nock('https://mandrillapp.com').post('/api/1.0/messages/send.json').times(Infinity).reply(200, {});
nock('http://freegeoip.net').get('/json/127.0.0.1').times(Infinity).reply(200, {'country_name' : 'Brazil'});
nock('http://freegeoip.net').get('/json/undefined').times(Infinity).reply(200, {'country_name' : ''});
nock('https://api.zeropush.com').post('/notify').times(Infinity).reply(200, {'message' : 'authenticated'});
nock('https://api.zeropush.com').post('/register').times(Infinity).reply(200, {'message' : 'authenticated'});