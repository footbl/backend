var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System user entity
 *
 * property {slug} User slug
 * property {email} User email
 * property {username} User username
 * property {facebookId} User facebookId
 * property {password} User password
 * property {name} User name
 * property {about} User about
 * property {verified} User verified
 * property {featured} User featured
 * property {picture} User picture
 * property {type} User type
 * property {apnsToken} User apnsToken
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'       : {
        'type' : String
    },
    'email'      : {
        'type'   : String,
        'match'  : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'unique' : true,
        'sparse' : true
    },
    'username'   : {
        'type'   : String,
        'unique' : true,
        'sparse' : true
    },
    'facebookId' : {
        'type'   : String,
        'unique' : true,
        'sparse' : true
    },
    'password'   : {
        'type'     : String,
        'required' : true
    },
    'name'       : {
        'type'   : String,
        'unique' : true,
        'sparse' : true
    },
    'about'      : {
        'type' : String
    },
    'verified'   : {
        'type'     : Boolean,
        'required' : true,
        'default'  : false
    },
    'featured'   : {
        'type'     : Boolean,
        'required' : true,
        'default'  : false
    },
    'picture'    : {
        'type'  : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    'type'       : {
        'type'     : String,
        'required' : true,
        'default'  : 'user',
        'enum'     : ['user', 'admin']
    },
    'apnsToken'  : {
        'type' : String
    },
    'createdAt'  : {
        'type' : Date
    },
    'updatedAt'  : {
        'type' : Date
    }
}, {
    'collection' : 'users',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    '_id'           : 0,
    'slug'          : 1,
    'email'         : 1,
    'username'      : 1,
    'name'          : 1,
    'facebookId'    : 0,
    'about'         : 1,
    'verified'      : 1,
    'featured'      : 1,
    'password'      : 0,
    'picture'       : 1,
    'language'      : 1,
    'country'       : 1,
    'type'          : 0,
    'apnsToken'     : 0,
    'notifications' : 1,
    'createdAt'     : 1,
    'updatedAt'     : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setUserUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', schema);