'use strict';
var mongoose, nconf, async, crypto,
    User, Wallet, Championship;

mongoose     = require('mongoose');
nconf        = require('nconf');
async        = require('async');
crypto       = require('crypto');
User         = require('../models/user');
Wallet       = require('../models/wallet');
Championship = require('../models/championship');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));
mongoose.connect(nconf.get('MONGOHQ_URL'));
