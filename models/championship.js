/**
 * @module
 * Manages championship model resource
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
var mongoose, Schema, schema;

mongoose = require('mongoose');
Schema   = mongoose.Schema;

/**
 * @class
 * @summary System championship entity
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
    'picture' : {
        'type' : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    /** @property */
    'edition' : {
        'type' : Number
    },
    /** @property */
    'type' : {
        'type' : String,
        'required' : true,
        'enum' : ['national league', 'continental league', 'world cup'],
        'default' : 'national league'
    },
    /** @property */
    'country' : {
        'type' : String
    },
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
    'edition'       : 1,
    'type'          : 1,
    'country'       : 1,
    'defaultGroup'  : 1,
    'rounds'        : 1,
    'currentRound'  : 1,
    'roundFinished' : 1,
    'active'        : 1,
    'matches'       : 0
});

schema.index({'name' : 1, 'country' : 1}, {'unique' : true});

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
 * @method
 * @summary Return championship rounds
 * To calculate the number of round in a championship, this method should return the highest round value in the matches
 * array. And if the championship don't have any match the default number of rounds is 1.
 *
 * @since 2014-05
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
 * @summary Return championship current round
 * To calculate the championship current round, this method should return the highest round values in the matches that
 * have already finished. And if no match has finished, the default current round is 1.
 *
 * @since 2014-05
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
 * To calculate if the championship current round have finished, this method should see if all matches in the current
 * round have already finished.
 *
 * @since 2014-05
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

/**
 * @method
 * @summary Checks if championship is active
 * To see if the championship is still active, this method should see if thecurrent round is finished and the current
 * round is the last round.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('active').get(function () {
    'use strict';

    return !(this.roundFinished && this.currentRound === this.rounds);
});

module.exports = mongoose.model('Championship', schema);