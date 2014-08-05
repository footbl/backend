var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System team entity
 *
 * property {name} Team name
 * property {slug} Team slug
 * property {picture} Team picture for display
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'name'      : {
        'type'     : String,
        'required' : true
    },
    'slug'      : {
        'type'   : String,
        'unique' : true
    },
    'picture'   : {
        'type'     : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    'createdAt' : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'teams',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.plugin(jsonSelect, {
    '_id'       : 0,
    'name'      : 1,
    'slug'      : 1,
    'picture'   : 1,
    'createdAt' : 1,
    'updatedAt' : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setTeamUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Team', schema);