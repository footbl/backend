var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System credit request entity
 *
 * property {slug} Credit request slug
 * property {creditedUser} Credit request creditor
 * property {chargedUser} Credit request debtor
 * property {payed} Tells if the credit request where payed
 * property {value} Credit request value
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'      : {
        'type'   : String,
        'unique' : true
    },
    'creditedUser'  : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'chargedUser'    : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'value'     : {
        'type' : Number,
        'required' : true
    },
    'payed'     : {
        'type'    : Boolean,
        'default' : false
    },
    'createdAt' : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'credits',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.plugin(jsonSelect, {
    '_id'       : 0,
    'slug'      : 1,
    'creditor'  : 1,
    'debtor'    : 1,
    'payed'     : 1,
    'value'     : 1,
    'createdAt' : 1,
    'updatedAt' : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setCreditRequestUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('CreditRequest', schema);