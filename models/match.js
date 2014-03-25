/**
 * @module
 * Manages match model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

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
    'visitor' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Team',
        'required' : true
    },
    /** @property */
    'result' : {
        'type' : String,
        'enum' : ['guest', 'visitor', 'draw'],
        'required' : true,
        'default' : 'draw'
    }
}, {
    'collection' : 'matches'
});

schema.plugin(require('mongoose-json-select'), {
    'date'         : 1,
    'championship' : 1,
    'finished'     : 1,
    'guest'        : 1,
    'visitor'      : 1,
    'result'       : 1
});

module.exports = mongoose.model('Match', schema);