/**
 * @module
 * Manages user model resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, nconf, async, schema;

mongoose = require('mongoose');
nconf    = require('nconf');
async    = require('async');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System user entity
 * To access the system the client must have a user registered in the system. There are 3 types of user, anonymous user,
 * facebook registered user and registered user. The anonymous user don't have any account information. the only
 * information the system keeps is the user id and a automatic generated password. The facebook registered user have all
 * account info retrieved from the facebook sdk.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'slug' : {
        'type' : String
    },
    /** @property */
    'email' : {
        'type' : String,
        'match' : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'unique' : true,
        'sparse' : true
    },
    /** @property */
    'username' : {
        'type' : String,
        'unique' : true,
        'sparse' : true
    },
    /** @property */
    'name' : {
        'type' : String
    },
    /** @property */
    'facebookId' : {
        'type' : String,
        'unique' : true,
        'sparse' : true
    },
    /** @property */
    'about' : {
        'type' : String
    },
    /** @property */
    'verified' : {
        'type' : Boolean,
        'required' : true,
        'default' : false
    },
    /** @property */
    'featured' : {
        'type' : Boolean,
        'required' : true,
        'default' : false
    },
    /** @property */
    'password' : {
        'type' : String,
        'required' : true
    },
    /** @property */
    'picture' : {
        'type' : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    /** @property */
    'language' : {
        'type' : String
    },
    /** @property */
    'country' : {
        'type' : String
    },
    /** @property */
    'type' : {
        'type' : String,
        'required' : true,
        'default' : 'user',
        'enum' : ['user', 'admin']
    },
    /** @property */
    'starred' : [{
        'type' : Schema.Types.ObjectId,
        'ref' : 'User'
    }],
    /** @property */
    'apnsToken' : {
        'type' : String
    },
    /** @property */
    'notifications' : {
        /** @property */
        'newGroups' : {
            'type' : Boolean,
            'default' : true
        },
        /** @property */
        'championshipEnding' : {
            'type' : Boolean,
            'default' : true
        }
    },
    /** @property */
    'followers' : {
        'type' : Number,
        'default' : 0
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
    'collection' : 'users',
    'strict' : true,
    'toJSON' : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    'email'         : 1,
    'username'      : 1,
    'name'          : 1,
    'about'         : 1,
    'verified'      : 1,
    'featured'      : 1,
    'password'      : 0,
    'picture'       : 1,
    'language'      : 1,
    'country'       : 1,
    'type'          : 1,
    'starred'       : 0,
    'notifications' : 1,
    'followers'     : 1,
    'createdAt'     : 1,
    'updatedAt'     : 1
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

module.exports = mongoose.model('User', schema);