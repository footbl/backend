/**
 * @module
 * Manages user model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, nconf, schema;

mongoose = require('mongoose');
nconf    = require('nconf');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System user entity
 * To access the system the client must have a user registered in the system. There are 3 types of user, anonymous user,
 * facebook registered user and registered user. The anonymous user don't have any account information. the only
 * information the system keeps is the user id and a automatic generated password. The facebook registered user have all
 * account info retrieved from the facebook sdk.
 *
 * @since: 2013-03
 * @author: Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'email' : {
        'type' : String,
        'match' : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    /** @property */
    'username' : {
        'type' : String
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
    'about'         : 1,
    'verified'      : 1,
    'password'      : 0,
    'picture'       : 1,
    'language'      : 1,
    'type'          : 0,
    'starred'       : 0,
    'country'       : 1,
    'notifications' : 1
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
 * @summary Ensures unique starred
 * When saving a user, the system must ensure that the user don't have any repeated starred.
 *
 * @param next
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    var repeated;

    repeated = this.starred.some(function (user, index) {
        return this.starred.some(function (otherUser, otherIndex) {
            return user === user && index !== otherIndex;
        }.bind(this));
    }.bind(this));

    next(repeated ? new Error('repeated starred') : null);
});

module.exports = mongoose.model('User', schema);