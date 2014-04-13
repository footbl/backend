/**
 * @module
 * Manages user wallet model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, nconf, schema;

mongoose = require('mongoose');
nconf    = require('nconf');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System wallet entity
 *
 * @since: 2013-03
 * @author: Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'championship' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Championship',
        'required' : true
    },
    /** @property */
    'user' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'User',
        'required' : true
    },
    /** @property */
    'active' : {
        'type' : Boolean,
        'required' : true,
        'default' : true
    },
    /** @property */
    'notifications' : {
        'type' : Boolean,
        'default' : true
    },
    /** @property */
    'iaps' : [{
        'platform' : {
            'type' : String,
            'required' : true
        },
        'productId' : {
            'type' : String,
            'required' : true
        },
        'receipt' : {
            'type' : String,
            'required' : true
        },
        'packageName' : {
            'type' : String,
            'required' : true
        },
        'date' : {
            'type' : Date,
            'required' : true
        }
    }],
    /** @property */
    'bets' : [{
        /** @property */
        'match' : {
            'type' : Schema.Types.ObjectId,
            'ref' : 'Match',
            'required' : true
        },
        /** @property */
        'date' : {
            'type' : Date,
            'required' : true
        },
        /** @property */
        'result' : {
            'type' : String,
            'required' : true,
            'enum' : ['guest', 'host', 'draw']
        },
        /** @property */
        'bid' : {
            'type' : Number,
            'required' : true
        },
        /** @property */
        'reward' : {
            'type' : Number,
            'required' : true,
            'default' : 0
        },
        /** @property */
        'finished' : {
            'type' : Boolean,
            'required' : true,
            'default' : false
        }
    }],
    /** @property */
    'createdAt' : {
        'type' : Date
    },
    /** @property */
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'wallets',
    'toJSON' : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    'championship'  : 1,
    'user'          : 1,
    'active'        : 1,
    'notifications' : 1,
    'funds'         : 1,
    'stake'         : 1,
    'toReturn'      : 1,
    'iaps'          : 0,
    'bets'          : 0
});

/**
 * @callback
 * @summary Setups createdAt and updatedAt
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (!this.createdAt) {
        this.createdAt = this.updatedAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

/**
 * @callback
 * @summary Ensures unique wallet
 * When saving a wallet, the system must ensure that the user don't have any other wallet in the same championship.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (!this.isNew) { return next(); }

    var query;
    query = this.constructor.findOne();
    query.where('user').equals(this.user);
    query.where('championship').equals(this.championship);

    return query.exec(function (error, wallet) {
        if (error) { return next(error); }
        if (wallet) { return next(new Error('wallet already exists')); }
        return next();
    }.bind(this));
});

/**
 * @callback
 * @summary Ensures sufficient funds
 * When saving a bet, the system must ensure that the user have enough funds to perform the bet.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (this.stake > this.funds) {
        next(new Error('insufficient funds'));
    } else {
        next();
    }
});

/**
 * @callback
 * @summary Updates match pot
 * After saving a new bet, the match pot corresponding to the bet's result must be updated, increasing the pot.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.paths.bets.schema.post('save', function () {
    'use strict';

    var query;
    query = require('./match').findById(this.match);
    query.exec(function (error, match) {
        if (error) { return; }
        if (!match) { return; }

        var query;
        query = this.parent().constructor.findOne();
        query.where('_id').equals(this.parent()._id);
        query.exec(function (error, wallet) {
            if (error) { return; }
            if (wallet) {
                var bet = wallet.bets.id(this._id);
                if (bet) {
                    match.pot[bet.result] -= bet.bid;
                }
            }
            match.pot[this.result] += this.bid;
            match.save();
        }.bind(this));
    }.bind(this));
});

/**
 * @callback
 * @summary Updates match pot
 * After saving a new bet, the match pot corresponding to the bet's result must be updated, decreasing the pot.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.paths.bets.schema.post('remove', function () {
    'use strict';

    var query;
    query = require('./match').findById(this.match);
    query.exec(function (error, match) {
        if (error) { return; }
        if (!match) { return; }

        var query;
        query = this.parent().constructor.findOne();
        query.where('_id').equals(this.parent()._id);
        query.exec(function (error, wallet) {
            if (error) { return; }
            if (wallet) {
                var bet = wallet.bets.id(this._id);
                if (bet) {
                    match.pot[bet.result] -= bet.bid;
                }
            }
            match.save();
        }.bind(this));
    }.bind(this));
});

/**
 * @method
 * @summary Return wallet last iap date
 * The wallet status must be calculated with all bets that happened after the iap, so this method should return the last
 * iap and if none iap exists, this method should return the created date.
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('lastDate').get(function () {
    'use strict';

    if (!this.iaps.length) { return this.createdAt; }

    var lastIap;

    lastIap = this.iaps.sort(function (a, b) {
        if (a.date > b.date) { return +1; }
        if (a.date < b.date) { return -1; }
        return 0;
    }).pop();

    return lastIap.date;
});

/**
 * @method
 * @summary Return wallet available funds
 * This method should return the wallets available funds, this is calculated by summing all bets rewards in the wallet
 * which the bet is finished.
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('funds').get(function () {
    'use strict';

    return this.bets.filter(function (bet) {
        return bet.date > this.lastDate;
    }.bind(this)).filter(function (bet) {
        return !!bet.finished;
    }.bind(this)).map(function (bet) {
        return bet.reward - bet.bid;
    }.bind(this)).reduce(function (funds, profit) {
        return funds + profit;
    }.bind(this), 100);
});

/**
 * @method
 * @summary Return wallet stake
 * This method should return the wallets funds at stake, this is calculated by summing all bets bid in the wallet which
 * the bet isn't finished yet.
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('stake').get(function () {
    'use strict';

    return this.bets.filter(function (bet) {
        return bet.date > this.lastDate;
    }.bind(this)).filter(function (bet) {
        return !bet.finished;
    }.bind(this)).map(function (bet) {
        return bet.bid;
    }.bind(this)).reduce(function (stake, bid) {
        return stake + bid;
    }.bind(this), 0);
});

/**
 * @method
 * @summary Return wallet to possible return
 * This method should return the wallets possible profit, this is calculated by summing all bets reward in the wallet
 * which the bet isn't finished yet.
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('toReturn').get(function () {
    'use strict';

    return this.bets.filter(function (bet) {
        return bet.date > this.lastDate;
    }.bind(this)).filter(function (bet) {
        return !bet.finished;
    }.bind(this)).map(function (bet) {
        return bet.reward;
    }.bind(this)).reduce(function (toReturn, reward) {
        return toReturn + reward;
    }.bind(this), 0);
});

module.exports = mongoose.model('Wallet', schema);