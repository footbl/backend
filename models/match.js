/**
 * @module
 * Manages match model resource
 *
 * @since 2014-05
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
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
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
    'collection' : 'matches',
    'strict' : true,
    'toJSON' : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    'date'         : 1,
    'championship' : 1,
    'finished'     : 1,
    'guest'        : 1,
    'host'         : 1,
    'round'        : 1,
    'pot'          : 1,
    'result'       : 1,
    'winner'       : 1,
    'jackpot'      : 1,
    'reward'       : 1,
    'elapsed'      : 1,
    'createdAt'    : 1,
    'updatedAt'    : 1
});

schema.index({'championship' : 1, 'guest' : 1, 'host' : 1, 'round' : 1}, {'unique' : true});

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
 * @summary Updates user wallets
 * When a match is finished all bets of that match should be updated, this procedure will update the bet reward if the
 * bet was right with the match reward times the user bid, if the bet was wrong, the reward will be 0.
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.post('save', function () {
    'use strict';

    var query;
    query = require('./wallet').find();
    query.where('championship').equals(this.championship);
    return query.exec(function (error, wallets) {
        if (error) { return; }
        async.each(wallets, function (wallet, next) {
            return async.detect(wallet.bets, function (bet, next) {
                next(bet.match.toString() === this._id.toString());
            }.bind(this), function (bet) {
                if (!bet) { return next(); }

                var oldReward, oldStatus, oldToReturn;
                oldReward    = bet.reward;
                oldStatus    = bet.finished;
                oldToReturn  = bet.toReturn;
                bet.finished = this.finished;
                bet.toReturn = !bet.finished ? bet.bid * this.jackpot / this.pot[bet.result] : 0;
                bet.reward   = bet.result === this.winner ? this.reward * bet.bid : 0;
                console.log(bet)

                if (oldReward === bet.reward && oldStatus === bet.finished && bet.toReturn === oldToReturn) { return next(); }
                console.log('a new hope')
                return wallet.save(next);
            }.bind(this));
        }.bind(this));
    }.bind(this));
});

/**
 * @method
 * @summary Return match winner
 * This method should compare the match score and see which team has won the match, the team with higher number of gols,
 * should be the winner and if the gols are equal, then the result is draw.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('winner').get(function () {
    'use strict';

    if (!this.finished) { return null; }
    if (this.result.guest > this.result.host) { return 'guest'; }
    if (this.result.guest < this.result.host) { return 'host'; }
    return 'draw';
});

/**
 * @method
 * @summary Return match total pot
 * This method should return the match total bets bids, this is calculated summing the total bets in host plus the guest
 * and the draw.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('jackpot').get(function () {
    'use strict';

    return this.pot.guest + this.pot.draw + this.pot.host;
});

/**
 * @method
 * @summary Return match reward
 * This method should return how much the system will pay for each point spent in the bet, this is calculated dividing
 * the entire match jackpot by the winner result.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('reward').get(function () {
    'use strict';

    if (!this.jackpot) { return 0; }

    switch (this.winner) {
        case 'guest' : { return this.jackpot / this.pot.guest; }
        case 'host'  : { return this.jackpot / this.pot.host; }
        default      : { return this.jackpot / this.pot.draw; }
    }
});

/**
 * @method
 * @summary Return match elapsed time
 * This method should return the match elapsed time, but, only if the match have already started and haven't finished
 * yet, on the other hand, the method should return null.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('elapsed').get(function () {
    'use strict';

    var elapsed;
    elapsed = Math.floor((new Date() - this.date) / (1000 * 60));

    if (this.finished) { return null; }
    if (elapsed < 0) { return null; }
    return elapsed;
});

module.exports = mongoose.model('Match', schema);