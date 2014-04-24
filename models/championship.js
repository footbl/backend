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
    'type' : {
        'type' : String,
        'required' : true,
        'enum' : ['national league', 'world cup', 'normal'],
        'default' : 'normal'
    },
    /** @property */
    'country' : {
        'type' : String
    },
    /** @property */
    'competitors' : [{
        'type' : Schema.Types.ObjectId,
        'ref' : 'Team'
    }],
    /** @property */
    'createdAt' : {
        'type' : Date
    },
    /** @property */
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'championships'
});

schema.plugin(require('mongoose-json-select'), {
    'name'        : 1,
    'competitors' : 1,
    'type'        : 1,
    'country'     : 1
});

schema.index({'name' : 1, 'country' : 1}, {'unique' : true});

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
        this.createdAt = this.updatedAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Championship', schema);