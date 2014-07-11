var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System user entity
 *
 * property {slug} User slug
 * property {email} User email
 * property {username} User username
 * property {facebookId} User facebookId
 * property {password} User password
 * property {name} User name
 * property {about} User about
 * property {verified} User verified
 * property {featured} User featured
 * property {picture} User picture
 * property {type} User type
 * property {apnsToken} User apnsToken
 * property {ranking} User current ranking
 * property {previousRanking} User previous ranking
 * property {history} User score history
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'            : {
        'type' : String
    },
    'email'           : {
        'type'   : String,
        'match'  : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'unique' : true,
        'sparse' : true
    },
    'username'        : {
        'type'   : String,
        'unique' : true,
        'sparse' : true
    },
    'facebookId'      : {
        'type'   : String,
        'unique' : true,
        'sparse' : true
    },
    'password'        : {
        'type'     : String,
        'required' : true
    },
    'name'            : {
        'type'   : String,
        'unique' : true,
        'sparse' : true
    },
    'about'           : {
        'type' : String
    },
    'verified'        : {
        'type'     : Boolean,
        'required' : true,
        'default'  : false
    },
    'featured'        : {
        'type'     : Boolean,
        'required' : true,
        'default'  : false
    },
    'picture'         : {
        'type'  : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    'type'            : {
        'type'     : String,
        'required' : true,
        'default'  : 'user',
        'enum'     : ['user', 'admin']
    },
    'apnsToken'       : {
        'type' : String
    },
    'ranking'         : {
        'type'     : Number,
        'required' : true,
        'default'  : Infinity
    },
    'previousRanking' : {
        'type'     : Number,
        'required' : true,
        'default'  : Infinity
    },
    'history'         : [
        {
            'date'  : {
                'type'     : Date,
                'required' : true
            },
            'funds' : {
                'type'     : Number,
                'required' : true
            }
        }
    ],
    'lastRecharge'    : {
        'type'    : Date,
        'default' : Date.now
    },
    'createdAt'       : {
        'type' : Date
    },
    'updatedAt'       : {
        'type' : Date
    }
}, {
    'collection' : 'users',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    '_id'             : 0,
    'slug'            : 1,
    'email'           : 1,
    'username'        : 1,
    'name'            : 1,
    'facebookId'      : 0,
    'about'           : 1,
    'verified'        : 1,
    'featured'        : 1,
    'password'        : 0,
    'picture'         : 1,
    'language'        : 1,
    'country'         : 1,
    'type'            : 0,
    'apnsToken'       : 0,
    'ranking'         : 1,
    'previousRanking' : 1,
    'history'         : 1,
    'notifications'   : 1,
    'lastRecharge'    : 1,
    'stake'           : 1,
    'funds'           : 1,
    'createdAt'       : 1,
    'updatedAt'       : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setUserUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

/**
 * @callback
 * @summary Populates all user bets
 *
 * @param next
 */
schema.pre('init', function (next, data) {
    'use strict';

    var query;
    query = require('./bet').find();
    query.where('user').equals(data._id);
    query.populate('match');
    query.exec(function (error, bets) {
        if (error) {
            error = new VError(error, 'error populating user "%s" bets.', data._id);
            return next(error);
        }
        this.bets = bets;
        return next();
    }.bind(this));
});

/**
 * @method
 * @summary Return wallet stake
 * This method should return the wallets funds at stake, this is calculated by summing all bets bid in the wallet which
 * the bet isn't finished yet.
 */
schema.virtual('stake').get(function () {
    'use strict';

    if (!this.bets) {
        return 0;
    }

    return this.bets.filter(function (bet) {
        return bet.createdAt > this.lastRecharge;
    }.bind(this)).filter(function (bet) {
        return !bet.match.finished;
    }.bind(this)).map(function (bet) {
        return bet.bid;
    }.bind(this)).reduce(function (stake, bid) {
        return stake + bid;
    }.bind(this), 0);
});

/**
 * @method
 * @summary Return wallet available funds
 * This method should return the wallets available funds, this is calculated by summing all bets rewards in the wallet
 * which the bet is finished.
 */
schema.virtual('funds').get(function () {
    'use strict';

    if (!this.bets) {
        return 100;
    }

    return this.bets.filter(function (bet) {
        return bet.createdAt > this.lastRecharge;
    }.bind(this)).map(function (bet) {
        return (bet.match.finished && bet.match.winner === bet.result ? bet.match.reward * bet.bid : 0) - bet.bid;
    }.bind(this)).reduce(function (stake, bid) {
        return stake + bid;
    }.bind(this), 100);
});

module.exports = mongoose.model('User', schema);