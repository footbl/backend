/**
 * @module
 * Manages championship model resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System championship entity
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
    'year' : {
        'type' : Number
    },
    /** @property */
    'type' : {
        'type' : String,
        'required' : true,
        'enum' : ['national league', 'world cup', 'normal'],
        'default' : 'normal'
    },
    /** @property */
    'country' : {
        'type' : String
    },
    /** @property */
    'competitors' : [{
        'type' : Schema.Types.ObjectId,
        'ref' : 'Team'
    }],
    /** @property */
    'matches' : [{
        'type' : Schema.Types.ObjectId,
        'ref' : 'Match'
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
    'collection' : 'championships',
    'strict' : true,
    'toJSON' : {
        'virtuals' : true
    }
});

schema.plugin(require('mongoose-json-select'), {
    'name'          : 1,
    'picture'       : 1,
    'year'          : 1,
    'competitors'   : 1,
    'type'          : 1,
    'country'       : 1,
    'rounds'        : 1,
    'currentRound'  : 1,
    'matches'       : 0,
    'roundFinished' : 1
});

schema.index({'name' : 1, 'country' : 1}, {'unique' : true});

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
 * @method
 * @summary Return championship rounds
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('rounds').get(function () {
    'use strict';

    if (!this.matches || this.matches.length === 0) { return 1; }

    return this.matches.map(function (match) {
        return match.round;
    }).sort().pop();
});

/**
 * @method
 * @summary Return championship rounds
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('currentRound').get(function () {
    'use strict';

    if (this.matches.length === 0) { return 1; }

    var lastMatch;
    lastMatch = this.matches.filter(function (match) {
        return match.finished;
    }).map(function (match) {
        return match.round;
    }).sort().pop();

    if (!lastMatch) { return 1; }
    return lastMatch;
});

/**
 * @method
 * @summary Checks if championship round is finished
 *
 * @since 2013-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('roundFinished').get(function () {
    'use strict';

    var currentRound;
    currentRound = this.currentRound;

    return this.matches.filter(function (match) {
        return match.round === currentRound;
    }).every(function (match) {
        return match.finished;
    });
});

module.exports = mongoose.model('Championship', schema);