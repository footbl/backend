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
 * @summary Return match winner
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.methods.winner = function () {
    if (this.result.guest > this.result.host) {return 'guest';}
    if (this.result.guest < this.result.host) {return 'host';}
    return 'draw';
};

/**
 * @method
 * @summary Return match reward
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.methods.reward = function () {
    switch (this.winner()) {
        case 'guest' :
            return (this.pot.guest + this.pot.draw + this.pot.host) / this.pot.guest;
        case 'host' :
            return (this.pot.guest + this.pot.draw + this.pot.host) / this.pot.host;
        default :
            return (this.pot.guest + this.pot.draw + this.pot.host) / this.pot.draw;
    }
};

/**
 * @method
 * @summary Finishes the match
 * To finish a match, the system must calculate all match bets profits, set the finished attribute to true and save the
 * match result.
 *
 * @param callback
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.methods.finish = function (callback) {
    'use strict';

    this.finished = true;
    this.save(function (error) {
        if (error) {return callback(error);}

        var query;

        query = Bet.find();
        query.where('match').equals(this._id);
        query.where('result').equals(this.winner());
        return query.exec(function (error, bets) {
            if (error) {return callback(error);}

            bets.forEach(function (bet) {
                bet.reward = bet.bid * this.reward();
                bet.save();
            }.bind(this));

            return callback(error);
        }.bind(this));
    }.bind(this));
};

module.exports = mongoose.model('Match', schema);