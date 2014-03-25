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

schema.plugin(require('mongoose-json-select'), {
    'user'   : 1,
    'match'  : 1,
    'date'   : 1,
    'result' : 1,
    'bid'    : 1
});

module.exports = mongoose.model('Bet', schema);