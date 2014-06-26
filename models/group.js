/**
 * @module
 * Manages group model resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System group entity
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema = new Schema({
    /** @property */
    'name' : {
        'type' : String,
        'required' : true
    },
    /** @property */
    'code' : {
        'type' : String
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
        'default' : true
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
    'invites' : [{
        'type' : String
    }],
    /** @property */
    'members' : [{
        /** @property */
        'user' : {
            'type' : Schema.Types.ObjectId,
            'ref' : 'User',
            'required' : true
        },
        /** @property */
        'rounds' : [{
            /** @property */
            'ranking' : {
                'type' : Number,
                'required' : true,
                'default' : Infinity
            },
            /** @property */
            'funds' : {
                'type' : Number,
                'required' : true,
                'default' : 100
            },
            /** @property */
            'date' : {
                'type' : Date
            }
        }],
        /** @property */
        'createdAt' : {
            'type' : Date,
            'default' : Date.now
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
    'collection' : 'groups',
    'strict' : true,
    'toJSON' : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    'name'         : 1,
    'code'         : 1,
    'picture'      : 1,
    'freeToEdit'   : 1,
    'championship' : 1,
    'owner'        : 1,
    'members'      : 0,
    'createdAt'    : 1,
    'updatedAt'    : 1
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

/**
 * @callback
 * @summary Setups group code for social sharing
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('save', function (next) {
    'use strict';

    if (!this.isNew) { return next(); }

    this.code = new Date().getTime().toString(36).substring(3);
    return next();
});

/**
 * @callback
 * @summary Ensures member has championship wallet
 * When a user become a group member the system must ensure that the user have a wallet in the group championship, so if
 * a wallet don't exist a wallet must be created.
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.paths.members.schema.pre('save', function (next) {
    'use strict';

    if (!this.isNew) { return next(); }

    var Wallet, query;
    Wallet = require('./wallet');
    query  = Wallet.findOne();
    query.where('championship').equals(this.parent().championship);
    query.where('user').equals(this.user);
    return query.exec(function (error, wallet) {
        if (error) { return next(error); }
        if (wallet) { return next(); }
        wallet = new (require('./wallet'))({
            'championship'  : this.parent().championship,
            'user'          : this.user,
            'active'        : false
        });
        return wallet.save(next);
    }.bind(this));
});

/**
 * @callback
 * @summary Sends push notification
 *
 * @param next
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.paths.members.schema.pre('save', function (next) {
    'use strict';

    if (!this.isNew) { return next(); }

    var query;
    query = require('./user').findOne();
    query.where('_id').equals(this.user);
    return query.exec(function (error, user) {
        if (error) { return next(error); }
        if (!user) { return next(new Error('user not found')); }
        if (!user.notifications.newGroups) { return next(); }
        if (!user.apnsToken) { return next(); }

        var query;
        query = require('./user').findOne();
        query.where('_id').equals(this.parent().owner);
        return query.exec(function (error, owner) {
            if (error) { return next(error); }
            if (!owner) { return next(new Error('owner not found')); }

            var query;
            query = require('./championship').findOne();
            query.where('_id').equals(this.parent().championship);
            return query.exec(function (error, championship) {
                if (error) { return next(error); }
                if (!championship) { return next(new Error('championship not found')); }

                require('../lib/apn').push(user.apnsToken, {
                    'loc-key' : 'NOTIFICATION_GROUP_ADDED',
                    'loc-args' : [owner.username, this.parent().name, championship.name]
                });
                return next();
            }.bind(this));
        }.bind(this));
    }.bind(this));
});

module.exports = mongoose.model('Group', schema);