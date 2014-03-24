/**
 * @module
 * Manages championship model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System championship entity
 *
 * @since: 2013-03
 * @author: Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'name' : {
        'type' : String,
        'required' : true
    },
    /** @property */
    'competitors' : [{
        'type' : Schema.Types.ObjectId,
        'ref' : 'Team'
    }]
}, {
    'collection' : 'championships'
});

schema.plugin(require('mongoose-json-select'), {
    'name'        : 1,
    'competitors' : 1
});

module.exports = mongoose.model('Championship', schema);