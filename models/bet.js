/**
 * @module
 * Manages bet model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema, User;

mongoose = require('mongoose');
Schema   = mongoose.Schema;
User     = require('./user');

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
 * When saving a bet, the system must ensure that the user have enough funds to perform the bet, and appends the bet in
 * the user profile.
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
    query.populate('bets');

    return query.exec(function (error, user) {
        if (error) {return next(error);}
        if (!user) {return next(new Error('user not found'));}
        if (user.funds < this.bid) {return next(new Error('insufficient funds'));}
        return next();
    }.bind(this));
});

/**
 * @callback
 * @summary Ensures unique bet
 * When saving bet, the system must ensure that the user only made one bet for a match, if a user have already meade a
 * bet, he have to update the old bet, or delete the old one and create a new one.
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
    });
});

/**
 * @callback
 * @summary Inserts bet in user bets
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.post('save', function (next) {
    'use strict';

    var query;
    query = User.findById(this.user);
    query.populate('bets');

    return query.exec(function (error, user) {
        if (error) {return next(error);}
        if (!user) {return next(new Error('user not found'));}

        user.bets.push(this._id);
        return user.save(next);
    }.bind(this));
});

/**
 * @callback
 * @summary Removes bet from user bets
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.post('remove', function (next) {
    'use strict';

    var query;
    query = User.findById(this.user);
    query.populate('bets');

    return query.exec(function (error, user) {
        if (error) {return next(error);}
        if (!user) {return next(new Error('user not found'));}

        user.bets = user.bets.filter(function (bet) {
            return bet._id !== this._id;
        }.bind(this));

        return user.save(next);
    }.bind(this));
});

module.exports = mongoose.model('Bet', schema);