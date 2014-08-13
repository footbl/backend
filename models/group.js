var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System group entity
 *
 * property {name} Group name
 * property {slug} Group slug
 * property {picture} Group picture for display
 * property {freeToEdit} Tells if the group can be edited be any member
 * property {owner} Group owner
 * property {invites} Invited users to the group
 * property {featured} Tells if the group is featured
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'name'       : {
        'type'     : String,
        'required' : true
    },
    'slug'       : {
        'type'   : String,
        'unique' : true
    },
    'picture'    : {
        'type'  : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    'freeToEdit' : {
        'type'     : Boolean,
        'required' : true,
        'default'  : true
    },
    'owner'      : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'invites'    : [
        {
            'type' : String
        }
    ],
    'featured'   : {
        'type'    : Boolean,
        'default' : false
    },
    'createdAt'  : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt'  : {
        'type' : Date
    }
}, {
    'collection' : 'groups',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.plugin(jsonSelect, {
    '_id'        : 0,
    'name'       : 1,
    'slug'       : 1,
    'picture'    : 1,
    'freeToEdit' : 1,
    'owner'      : 1,
    'invites'    : 0,
    'members'    : 0,
    'featured'   : 1,
    'createdAt'  : 1,
    'updatedAt'  : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setGroupUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Group', schema);