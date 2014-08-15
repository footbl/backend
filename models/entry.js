var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System entry entity
 *
 * property {slug} Entry slug
 * property {user} User
 * property {championship} Championship
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'         : {
        'type' : String
    },
    'user'         : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'championship' : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Championship',
        'required' : true
    },
    'createdAt'    : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt'    : {
        'type' : Date
    }
}, {
    'collection' : 'entries',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'user'         : 1,
    'championship' : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'          : 0,
    'slug'         : 1,
    'user'         : 1,
    'championship' : 1,
    'createdAt'    : 1,
    'updatedAt'    : 1
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

module.exports = mongoose.model('Entries', schema);