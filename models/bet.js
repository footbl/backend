/**
 * @module
 * Manages bet model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema, User, Match, scores;

mongoose = require('mongoose');
Schema   = mongoose.Schema;
User     = require('./user');
Match    = require('./match');
scores   = new (require('scoreboard').Score)();

/**
 * @class
 * @summary System bet entity
 *
 * @since: 2013-03
 * @author: Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'user' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'User',
        'required' : true
    },
    /** @property */
    'match' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Match',
        'required' : true
    },
    /** @property */
    'championship' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Championship',
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
    'createdAt' : {
        'type' : Date
    },
    /** @property */
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'bets'
});

schema.plugin(require('mongoose-json-select'), {
    'user'   : 1,
    'match'  : 1,
    'date'   : 1,
    'result' : 1,
    'bid'    : 1,
    'reward' : 1
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
        this.createdAt = this.updatedAt = new Date;
    } else {
        this.updatedAt = new Date;
    }
    next();
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

    var query;
    query = User.findById(this.user);
    query.exec(function (error, user) {
        var wallet;

        if (error) {return next(error);}

        wallet = user.findWallet(this.championship);
        if (wallet.available < this.bid) {
            return next(new Error('insufficient funds'));
        } else {
            return next();
        }
    }.bind(this));
});

/**
 * @callback
 * @summary Ensures unique bet
 * When saving a bet, the system must ensure that the user dont have any other bet in the same match.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (!this.isNew) {return next();}

    var query;
    query = this.constructor.findOne();
    query.where('user').equals(this.user);
    query.where('match').equals(this.match);

    return query.exec(function (error, bet) {
        if (error) {return next(error);}
        if (bet) {return next(new Error('match already bet'));}
        return next();
    }.bind(this));
});

/**
 * @callback
 * @summary Updates user wallet and ranking
 * After saving a new bet, the user wallet corresponding to match's championship must be updated, decreasing the
 * available funds and increasing the stake money.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.post('save', function () {
    'use strict';

    var query;
    query = User.findById(this.user);
    query.exec(function (error, user) {
        var wallet;

        if (error) { return; }

        wallet = user.findWallet(this.championship);
        wallet.stake     += this.bid;
        wallet.available -= this.bid;
        //scores.index(this.championship, -1 * this.bid, user._id);

        user.save();
    }.bind(this));
});

/**
 * @callback
 * @summary Updates user wallet and ranking
 * After removing a bet, the user wallet corresponding to match's championship must be updated, increasing the available
 * funds and decreasing the stake money.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.post('remove', function () {
    'use strict';

    var query;
    query = User.findById(this.user);
    query.exec(function (error, user) {
        var wallet;

        if (error) { return; }

        wallet = user.findWallet(this.championship);
        wallet.stake     -= this.bid;
        wallet.available += this.bid;
        //scores.index(this.championship, this.bid, user._id);

        user.save();
    }.bind(this));
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
schema.post('save', function () {
    'use strict';

    var query;
    query = Match.findById(this.match);
    query.exec(function (error, match) {
        if (error) { return; }

        match.pot[this.result] += this.bid;
        match.save();
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
schema.post('remove', function () {
    'use strict';

    var query;
    query = Match.findById(this.match);
    query.exec(function (error, match) {
        if (error) { return; }

        match.pot[this.result] -= this.bid;
        match.save();
    }.bind(this));
});

/**
 * @method
 * @summary Finishes the bet
 * To finish a bet, the ranking and user's wallet corresponding to the match's championship must be updated, decreasing
 * the wallet stake and if the the user won the bet, the available must be increased with the bet bid times the match
 * reward.
 *
 * @param match
 * @param callback
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.methods.finish = function (match, callback) {
    'use strict';

    var query;
    query = User.findById(this.user);
    query.exec(function (error, user) {
        var wallet;

        if (error) {return next(error);}

        callback = callback || function () {};
        wallet   = user.findWallet(this.championship);
        wallet.stake     -= this.bid;
        wallet.available += this.result === match.winner ?this.reward : 0;

        if (this.result === match.winner) {
            this.reward = this.bid * match.reward;
            //scores.index(this.championship, this.reward, this.user._id);
        }

        user.save();
        return this.save(callback);
    }.bind(this));
};

module.exports = mongoose.model('Bet', schema);