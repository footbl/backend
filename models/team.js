/**
 * @module
 * Manages team model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System team entity
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
    'picture' : {
        'type' : String,
        'required' : true
    }
}, {
    'collection' : 'teams'
});

schema.plugin(require('mongoose-json-select'), {
    'name'    : 1,
    'picture' : 1
});

module.exports = mongoose.model('Team', schema);