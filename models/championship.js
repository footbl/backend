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
    'createdAt'     : 1,
    'updatedAt'     : 1
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
 * @callback
 * @summary Populates all championship matches
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('init', function (next, data) {
    'use strict';

    var query;
    query = require('./match').find();
    query.where('championship').equals(data._id);
    query.exec(function  (error, matches) {
        if (error) { return next(error); }
        this.matches = matches;
        return next();
    }.bind(this));
});

/**
 * @method
 * @summary Counts championship number of rounds
 * To calculate the number of round in a championship, the system should return the highest round value in the matches.
 * And if the championship don't have any match the default number of rounds is 1.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('rounds').get(function () {
    'use strict';

    if (this.type === 'world cup') { return 7; }

    var lastRound, matches;
    matches   = this.matches || [];
    lastRound = matches.sort(function (a, b) {
        return b.round - a.round;
    }.bind(this))[0];
    return lastRound ? lastRound.round : 1;
});

/**
 * @method
 * @summary Calculates championship current round
 * To calculate the championship current round, this method should return the highest round values in the matches that
 * have already finished. And if no match has finished, the default current round is 1.
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('currentRound').get(function () {
    'use strict';

    var lastRound, matches;
    matches   = this.matches || [];
    lastRound = matches.filter(function (match) {
        return match.finished;
    }.bind(this)).sort(function (a, b) {
        return b.round - a.round;
    }.bind(this))[0];
    return lastRound ? lastRound.round : 1;
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

    var lastRound, matches;
    matches   = this.matches || [];
    lastRound = matches.filter(function (match) {
        return !match.finished && match.round === this.currentRound;
    }.bind(this))[0];
    return !lastRound;
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