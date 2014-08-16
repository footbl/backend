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
    'slug'         : {
        'type' : String
    },
    'creditedUser' : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'chargedUser'  : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'value'        : {
        'type' : Number
    },
    'payed'        : {
        'type'    : Boolean,
        'default' : false
    },
    'createdAt'    : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt'    : {
        'type' : Date
    }
}, {
    'collection' : 'credits',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'slug'        : 1,
    'chargedUser' : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'          : 0,
    'slug'         : 1,
    'creditedUser' : 1,
    'chargedUser'  : 1,
    'payed'        : 1,
    'value'        : 1,
    'createdAt'    : 1,
    'updatedAt'    : 1
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

/**
 * @callback
 * @summary Ensures sufficient funds
 *
 * @param next
 */
schema.pre('save', function validateSufficientFundsBeforeSave(next) {
    'use strict';

    var query;
    query = require('./user').findOne();
    query.where('_id').equals(this.chargedUser);
    query.exec(function (error, user) {
        if (error || !user) {
            error = new VError(error, 'error finding user: "%s"', this._id);
            return next(error);
        }
        if (this.value > user.funds && this.payed) {
            error = new VError('insufficient funds');
            return next(error);
        }
        return next();
    }.bind(this));
});

module.exports = mongoose.model('CreditRequest', schema);