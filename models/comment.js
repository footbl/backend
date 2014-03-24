/**
 * @module
 * Manages comment model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System comment entity
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
    'message' : {
        'type' : String,
        'required' : true
    }
}, {
    'collection' : 'comments'
});

schema.plugin(require('mongoose-json-select'), {
    'user'    : 1,
    'match'   : 1,
    'date'    : 1,
    'message' : 1
});

module.exports = mongoose.model('Comment', schema);