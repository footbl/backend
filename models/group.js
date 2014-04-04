/**
 * @module
 * Manages group model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema, Bet;

mongoose = require('mongoose');
Schema   = mongoose.Schema;
Bet      = require('./bet');

/**
 * @class
 * @summary System group entity
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
    'freeToEdit' : {
        'type' : Boolean,
        'required' : true,
        'default' : false
    },
    /** @property */
    'championship' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'Championship',
        'required' : true
    },
    /** @property */
    'owner' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'User',
        'required' : true
    },
    /** @property */
    'members' : [{
        /** @property */
        'user' : {
            'type' : Schema.Types.ObjectId,
            'ref' : 'User',
            'required' : true
        },
        /** @property */
        'ranking' : {
            'type' : Number,
            'required' : true,
            'default' : Infinity
        }
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
    'collection' : 'groups'
});

schema.plugin(require('mongoose-json-select'), {
    'name'         : 1,
    'freeToEdit'   : 1,
    'championship' : 1,
    'owner'        : 1,
    'members'      : 0
});

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
        this.createdAt = this.updatedAt = new Date;
    } else {
        this.updatedAt = new Date;
    }
    next();
});

module.exports = mongoose.model('Group', schema);