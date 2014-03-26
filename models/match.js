/**
 * @module
 * Manages match model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema, Bet;

mongoose = require('mongoose');
Schema   = mongoose.Schema;
Bet      = require('./bet');

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
    'pot'          : 1,
    'result'       : 1
});

/**
 * @method
 * @summary Finishes the match
 * To finish a match, the system must calculate all match bets profits, set the finished attribute to true and save the
 * match result.
 *
 * @param result
 * @param callback
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.methods.finish = function (result, callback) {
    'use strict';

    //var _id;
    //_id           = this._id;
    this.finished = true;
    this.result   = result;
    this.save(/*function (error) {
        if (error) {return callback(error);}

        var query;
        query = Bet.find();
        query.where('match').equals(_id);
        return query.exec(function (error, bets) {
            if (error) {return callback(error);}

            var amount, reward, winners;

            winners = bets.filter(function (bet) {
                return bet.result === result;
            });

            amount = bets.reduce(function (amount, bet) {
                return amount + bet.bid;
            }, 0);

            reward = amount / winners.reduce(function (amount, bet) {
                return amount + bet.bid;
            }, 0);

            winners.forEach(function (bet) {
                bet.reward = bet.bid * reward;
                bet.save();
            });

            return callback(error);
        });
    }*/callback);
};

module.exports = mongoose.model('Match', schema);