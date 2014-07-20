/**
 * @module
 * Manages credit request model resource
 *
 * @since 2014-07
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System credit request entity
 *
 * @since 2014-07
 * @author Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'debtor' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'User',
        'required' : true
    },
    /** @property */
    'creditor' : {
        'type' : Schema.Types.ObjectId,
        'ref' : 'User'
    },
    /** @property */
    'creditorFacebookId' : {
        'type' : String
    },
    /** @property */
    'creditorEmail' : {
        'type' : String
    },
    /** @property */
    'payed' : {
        'type' : Boolean,
        'default' : false
    },
    /** @property */
    'value' : {
        'type' : Number
    },
    /** @property */
    'createdAt' : {
        'type' : Date
    },
    /** @property */
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'comments',
    'strict' : true,
    'toJSON' : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    'debtor'             : 1,
    'creditor'           : 1,
    'creditorFacebookId' : 1,
    'creditorEmail'      : 1,
    'payed'              : 1,
    'value'              : 1,
    'createdAt'          : 1,
    'updatedAt'          : 1
});

/**
 * @callback
 * @summary Setups createdAt and updatedAt
 *
 * @param next
 *
 * @since 2014-05
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

module.exports = mongoose.model('Comment', schema);