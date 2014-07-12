var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System featured entity
 *
 * property {slug} Featured slug
 * property {user} User
 * property {featured}  Featured
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'      : {
        'type' : String
    },
    'user'      : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'featured'  : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'createdAt' : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'featureds',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'user'     : 1,
    'featured' : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'       : 0,
    'user'      : 1,
    'featured'  : 1,
    'slug'      : 1,
    'createdAt' : 1,
    'updatedAt' : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Featured', schema);