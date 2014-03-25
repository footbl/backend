/**
 * @module
 * Manages bet model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

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
        'enum' : ['guest', 'visitor', 'draw']
    },
    /** @property */
    'bid' : {
        'type' : Number,
        'required' : true
    }
}, {
    'collection' : 'bets'
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

schema.plugin(require('mongoose-json-select'), {
    'user'   : 1,
    'match'  : 1,
    'date'   : 1,
    'result' : 1,
    'bid'    : 1
});

module.exports = mongoose.model('Bet', schema);