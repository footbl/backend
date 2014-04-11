/**
 * @module
 * Manages match model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema, async;

mongoose = require('mongoose');
Schema   = mongoose.Schema;
async    = require('async');

/**
 * @class
 * @summary System match entity
 *
 * @since: 2013-03
 * @author: Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'date' : {
        'type' : Date,
        'required' : true
    },
    /** @property */
    'championship' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Championship',
        'required' : true
    },
    /** @property */
    'finished' : {
        'type' : Boolean,
        'required' : true,
        'default' : false
    },
    /** @property */
    'guest' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Team',
        'required' : true
    },
    /** @property */
    'host' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Team',
        'required' : true
    },
    /** @property */
    'round' : {
        'type' : Number,
        'required' : true
    },
    /** @property */
    'pot' : {
        /** @property */
        'guest' : {
            'type' : Number,
            'required' : true,
            'default' : 0
        },
        /** @property */
        'host' : {
            'type' : Number,
            'required' : true,
            'default' : 0
        },
        /** @property */
        'draw' : {
            'type' : Number,
            'required' : true,
            'default' : 0
        }
    },
    /** @property */
    'result' : {
        /** @property */
        'guest' : {
            'type' : Number,
            'required' : true,
            'default' : 0
        },
        /** @property */
        'host' : {
            'type' : Number,
            'required' : true,
            'default' : 0
        }
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
    'collection' : 'matches'
});

schema.plugin(require('mongoose-json-select'), {
    'date'         : 1,
    'championship' : 1,
    'finished'     : 1,
    'guest'        : 1,
    'host'         : 1,
    'round'        : 1,
    'pot'          : 1,
    'result'       : 1
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
 * @summary Updates user wallets
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (!this.finished) { return next(); }

    var query;
    query = require('./wallet').find();
    query.where('championship').equals(this.championship);
    return query.exec(function (error, wallets) {
        if (error) { return next(error); }
        return async.each(wallets, function (wallet, next) {
            return async.each(wallet.bets, function (bet, next) {
                if (bet.match.toString() === this._id.toString()) {
                    bet.finished = true;
                    bet.reward   = bet.result === this.winner ? this.reward * bet.bid : 0;
                }
                next();
            }.bind(this), function () {
                wallet.save(next);
            });
        }.bind(this), next);
    }.bind(this));
});

/**
 * @method
 * @summary Return match winner
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('winner').get(function () {
    'use strict';

    if (this.result.guest > this.result.host) { return 'guest'; }
    if (this.result.guest < this.result.host) { return 'host'; }
    return 'draw';
});

/**
 * @method
 * @summary Return match total pot
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('jackpot').get(function () {
    'use strict';

    return this.pot.guest + this.pot.draw + this.pot.host;
});

/**
 * @method
 * @summary Return match reward
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('reward').get(function () {
    'use strict';

    switch (this.winner) {
        case 'guest' : { return this.jackpot / this.pot.guest; }
        case 'host'  : { return this.jackpot / this.pot.host; }
        default      : { return this.jackpot / this.pot.draw; }
    }
});

module.exports = mongoose.model('Match', schema);