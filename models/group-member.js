var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System groupMember entity
 *
 * property {slug} GroupMember slug
 * property {user} GroupMember user id
 * property {group} GroupMember group id
 * property {rounds} GroupMember round history
 * property {rounds.ranking} GroupMember round history
 * property {rounds.find} GroupMember round funds history
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'            : {
        'type' : String
    },
    'user'            : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'group'           : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Group',
        'required' : true
    },
    'initialFunds'    : {
        'type' : Number
    },
    'ranking'         : {
        'type'     : Number,
        'required' : true,
        'default'  : Infinity
    },
    'previousRanking' : {
        'type'     : Number,
        'required' : true,
        'default'  : Infinity
    },
    'createdAt'       : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt'       : {
        'type' : Date
    }
}, {
    'collection' : 'groupMembers',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'user'  : 1,
    'group' : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'             : 0,
    'user'            : 1,
    'group'           : 0,
    'initialFunds'    : 0,
    'ranking'         : 1,
    'previousRanking' : 1,
    'slug'            : 1,
    'createdAt'       : 1,
    'updatedAt'       : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setGroupMemberUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('GroupMember', schema);