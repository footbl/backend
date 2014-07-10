var VError, mongoose, jsonSelect, nconf, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System bet entity
 *
 * property {slug} Bet slug
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'slug'      : {
        'type'   : String,
        'unique' : true
    },
    'user'      : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'User',
        'required' : true
    },
    'match'     : {
        'type'     : Schema.Types.ObjectId,
        'ref'      : 'Match',
        'required' : true
    },
    'bid'       : {
        'type'     : Number,
        'required' : true
    },
    'result'    : {
        'type'     : String,
        'required' : true,
        'enum'     : ['guest', 'host', 'draw']
    },
    'createdAt' : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'bets',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.index({
    'user'  : 1,
    'match' : 1
}, {
    'unique' : true
});

schema.plugin(jsonSelect, {
    '_id'       : 0,
    'slug'      : 1,
    'user'      : 1,
    'match'     : 1,
    'bid'       : 1,
    'result'    : 1,
    'createdAt' : 1,
    'updatedAt' : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setBetUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

/**
 * @callback
 * @summary Ensures bet is not created after match finished or started
 *
 * @param next
 */
schema.pre('save', function setBetUpdatedAt(next) {
    'use strict';

    this.populate('match');
    this.populate(function (error) {
        if (error) {
            error = new VError(error, 'error populating bet "%s" match.', this._id);
            return next(error);
        }
        if (this.match.finished || this.match.elapsed) {
            error = new VError('match already started');
            return next(error);
        }
        return next();
    }.bind(this));
});

/**
 * @callback
 * @summary Ensures bet is not created after match finished or started
 *
 * @param next
 */
schema.pre('remove', function setBetUpdatedAt(next) {
    'use strict';

    this.populate('match');
    this.populate(function (error) {
        if (error) {
            error = new VError(error, 'error populating bet "%s" match.', this._id);
            return next(error);
        }
        if (this.match.finished || this.match.elapsed) {
            error = new VError('match already started');
            return next(error);
        }
        return next();
    }.bind(this));
});

module.exports = mongoose.model('Bet', schema);