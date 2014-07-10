var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System match entity
 *
 * property {slug} Match slug
 * property {championship} Match championship
 * property {guest} Match guest
 * property {host} Match host
 * property {round} Match round
 * property {date} Match date
 * property {finished} Match status
 * property {elapsed} Match elapsed time
 * property {score} Match score
 * property {score.guest} Guest number of gols
 * property {score.host} Host number of gols
 * property {pot} Match pot
 * property {pot.guest} Guest total bets
 * property {pot.host} Host total bets
 * property {pot.draw} Draw total bets
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'         : {
        'type' : String
    },
    'championship' : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Championship',
        'required' : true
    },
    'guest'        : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Team',
        'required' : true
    },
    'host'         : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Team',
        'required' : true
    },
    'round'        : {
        'type'     : Number,
        'required' : true
    },
    'date'         : {
        'type'     : Date,
        'required' : true
    },
    'finished'     : {
        'type'     : Boolean,
        'required' : true,
        'default'  : false
    },
    'elapsed'      : {
        'type' : Number
    },
    'score'        : {
        'guest' : {
            'type'     : Number,
            'required' : true,
            'default'  : 0
        },
        'host'  : {
            'type'     : Number,
            'required' : true,
            'default'  : 0
        }
    },
    'pot'          : {
        'guest' : {
            'type'    : Number,
            'default' : 0
        },
        'host'  : {
            'type'    : Number,
            'default' : 0
        },
        'draw'  : {
            'type'    : Number,
            'default' : 0
        }
    },
    'createdAt'    : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt'    : {
        'type' : Date
    }
}, {
    'collection' : 'matches',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'championship' : 1,
    'guest'        : 1,
    'host'         : 1,
    'round'        : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'          : 0,
    'slug'         : 1,
    'championship' : 0,
    'guest'        : 1,
    'host'         : 1,
    'round'        : 1,
    'date'         : 1,
    'finished'     : 1,
    'elapsed'      : 1,
    'score'        : 1,
    'pot'          : 1,
    'winner'       : 1,
    'jackpot'      : 1,
    'reward'       : 1,
    'createdAt'    : 1,
    'updatedAt'    : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setMatchUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

/**
 * @method
 * @summary Return match winner
 * This method should compare the match score and see which team has won the match, the team with higher number of gols,
 * should be the winner and if the gols are equal, then the result is draw.
 */
schema.virtual('winner').get(function () {
    'use strict';

    if (!this.finished) {
        return null;
    }
    if (this.result.guest > this.result.host) {
        return 'guest';
    }
    if (this.result.guest < this.result.host) {
        return 'host';
    }
    return 'draw';
});

/**
 * @method
 * @summary Return match total pot
 * This method should return the match total bets bids, this is calculated summing the total bets in host plus the guest
 * and the draw.
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
 */
schema.virtual('reward').get(function () {
    'use strict';

    if (!this.jackpot) {
        return 0;
    }

    switch (this.winner) {
        case 'guest' :
        {
            return this.jackpot / this.pot.guest;
        }
        case 'host'  :
        {
            return this.jackpot / this.pot.host;
        }
        default      :
        {
            return this.jackpot / this.pot.draw;
        }
    }
});

module.exports = mongoose.model('Match', schema);