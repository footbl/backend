/**
 * @module
 * Manages user wallet model resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, nconf, schema;

mongoose = require('mongoose');
nconf    = require('nconf');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System wallet entity
 * A user can only have one wallet for each championship, the priority field controls the sorting for the list method
 * and the notifications object should control if the user wants to receive notifications when the rounds in the
 * championship starts and ends.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
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
        /** @property */
        'roundStart' : {
            'type' : Boolean,
            'default' : true
        },
        /** @property */
        'roundEnd' : {
            'type' : Boolean,
            'default' : true
        }
    },
    /** @property */
    'priority' : {
        'type' : Number,
        'default' : 1
    },
    /** @property */
    'rounds' : [{
        /** @property */
        'ranking' : {
            'type' : Number,
            'required' : true,
            'default' : Infinity
        },
        /** @property */
        'funds' : {
            'type' : Number,
            'required' : true,
            'default' : 100
        },
        /** @property */
        'date' : {
            'type' : Date
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
        }
    }],
    /** @property */
    'lastRecharge' : {
        'type' : Date,
        'default' : Date.now
    },
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
    'strict' : true,
    'toJSON' : {
        'virtuals' : true
    }
});

schema.index({'user' : 1, 'championship' : 1}, {'unique' : true});

schema.plugin(require('mongoose-json-select'), {
    'championship'  : 1,
    'user'          : 1,
    'active'        : 1,
    'notifications' : 1,
    'priority'      : 1,
    'rounds'        : 1,
    'bets'          : 0,
    'lastRecharge'  : 1,
    'funds'         : 1,
    'stake'         : 1,
    'createdAt'     : 1,
    'updatedAt'     : 1
});

/**
 * @callback
 * @summary Setups createdAt and updatedAt
 *
 * @param next
 *
 * @since 2014-05
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
 * @summary Ensures sufficient funds
 * When saving a bet, the system must ensure that the user have enough funds to perform the bet. So, before saving, the
 * system must compare the available funds in the wallet with the wallet stake and see if the funds are sufficient.
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (this.funds < 0) {
        next(new Error('insufficient funds'));
    } else {
        next();
    }
});

/**
 * @method
 * @summary Return wallet available funds
 * This method should return the wallets available funds, this is calculated by summing all bets rewards in the wallet
 * which the bet is finished.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('funds').get(function () {
    'use strict';

    return this.bets.filter(function (bet) {
        return bet.date > this.lastRecharge;
    }.bind(this)).map(function (bet) {
        return (bet.match.finished && bet.match.winner === bet.result ? bet.match.reward * bet.bid : 0) - bet.bid;
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
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('stake').get(function () {
    'use strict';

    return this.bets.filter(function (bet) {
        return bet.date > this.lastRecharge;
    }.bind(this)).filter(function (bet) {
        return !bet.match.finished;
    }.bind(this)).map(function (bet) {
        return bet.bid;
    }.bind(this)).reduce(function (stake, bid) {
        return stake + bid;
    }.bind(this), 0);
});

module.exports = mongoose.model('Wallet', schema);