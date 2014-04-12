/**
 * @module
 * Manages group model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

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
    'picture' : {
        'type' : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
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
        },
        /** @property */
        'initialFunds' : {
            'type' : Number,
            'required' : true,
            'default' : 100
        },
        /** @property */
        'points' : {
            'type' : Number,
            'required' : true,
            'default' : 100
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
    'picture'      : 1,
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
        this.createdAt = this.updatedAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

/**
 * @callback
 * @summary Sets member initial funds
 * When a user become a group member the system must save the user wallet at the championship when the user entered at
 * the group to normalize the user wallet funds to calculate the ranking.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.paths.members.schema.pre('save', function (next) {
    'use strict';

    var Wallet, query;
    Wallet = require('./wallet');
    query  = Wallet.findOne();
    query.where('championship').equals(this.parent().championship);
    query.where('user').equals(this.user);
    return query.exec(function (error, wallet) {
        if (error) { return next(error); }
        if (!wallet) { return next(new Error('Wallet not found.')); }

        this.initialFunds = wallet.funds;
        return next();
    }.bind(this));
});

module.exports = mongoose.model('Group', schema);