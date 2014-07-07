var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System match entity
 *
 * property {slug} Match slug
 * property {championship} Match championship
 * property {guest} Match guest
 * property {host} Match host
 * property {round} Match round
 * property {date} Match date
 * property {finished} Match status
 * property {elapsed} Match elapsed time
 * property {score} Match score
 * property {score.guest} Guest number of gols
 * property {score.host} Host number of gols
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'         : {
        'type' : String
    },
    'championship' : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Championship',
        'required' : true
    },
    'guest'        : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Team',
        'required' : true
    },
    'host'         : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Team',
        'required' : true
    },
    'round'        : {
        'type'     : Number,
        'required' : true
    },
    'date'         : {
        'type'     : Date,
        'required' : true
    },
    'finished'     : {
        'type'     : Boolean,
        'required' : true,
        'default'  : false
    },
    'elapsed'      : {
        'type' : Number
    },
    'score'        : {
        'guest' : {
            'type'     : Number,
            'required' : true,
            'default'  : 0
        },
        'host'  : {
            'type'     : Number,
            'required' : true,
            'default'  : 0
        }
    },
    'createdAt'    : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt'    : {
        'type' : Date
    }
}, {
    'collection' : 'matches',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'championship' : 1,
    'guest'        : 1,
    'host'         : 1,
    'round'        : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'          : 0,
    'slug'         : 1,
    'championship' : 0,
    'guest'        : 1,
    'host'         : 1,
    'round'        : 1,
    'date'         : 1,
    'finished'     : 1,
    'elapsed'      : 1,
    'score'        : 1,
    'createdAt'    : 1,
    'updatedAt'    : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setMatchUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Match', schema);