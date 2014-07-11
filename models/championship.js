var VError, mongoose, jsonSelect, nconf, Match, Schema, schema;

VError = require('verror');
mongoose = require('mongoose');
jsonSelect = require('mongoose-json-select');
nconf = require('nconf');
Match = require('./match');
Schema = mongoose.Schema;

/**
 * @class
 * @summary System championship entity
 *
 * property {name} Championship name
 * property {slug} Championship slug
 * property {picture} Championship picture for display
 * property {edition} Championship year of occurrence
 * property {type} Championship type
 * property {country} Championship country of occurrence
 * property {createdAt}
 * property {updatedAt}
 */
schema = new Schema({
    'name'      : {
        'type'     : String,
        'required' : true
    },
    'slug'      : {
        'type'   : String,
        'unique' : true
    },
    'picture'   : {
        'type'  : String,
        'match' : /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    },
    'edition'   : {
        'type'     : Number,
        'required' : true
    },
    'type'      : {
        'type'     : String,
        'required' : true,
        'enum'     : ['national league', 'continental league', 'world cup'],
        'default'  : 'national league'
    },
    'country'   : {
        'type'     : String,
        'required' : true
    },
    'createdAt' : {
        'type'    : Date,
        'default' : Date.now
    },
    'updatedAt' : {
        'type' : Date
    }
}, {
    'collection' : 'championships',
    'strict'     : true,
    'toJSON'     : {
        'virtuals' : true
    }
});

schema.plugin(jsonSelect, {
    '_id'          : 0,
    'name'         : 1,
    'slug'         : 1,
    'picture'      : 1,
    'edition'      : 1,
    'type'         : 1,
    'country'      : 1,
    'createdAt'    : 1,
    'updatedAt'    : 1,
    'rounds'       : 1,
    'currentRound' : 1,
    'active'       : 1
});

/**
 * @callback
 * @summary Setups updatedAt
 *
 * @param next
 */
schema.pre('save', function setChampionshipUpdatedAt(next) {
    'use strict';

    this.updatedAt = new Date();
    next();
});

/**
 * @callback
 * @summary Populates all championship matches
 *
 * @param next
 */
schema.pre('init', function (next, data) {
    'use strict';

    var query;
    query = Match.find();
    query.where('championship').equals(data._id);
    query.exec(function (error, matches) {
        if (error) {
            error = new VError(error, 'error populating championship "%s" matches.', data._id);
            return next(error);
        }
        this.matches = matches;
        return next();
    }.bind(this));
});

/**
 * @method
 * @summary Counts championship number of rounds
 * To calculate the number of rounds in a championship, the system should return the highest round value in the matches.
 * And if the championship don't have any match the default number of rounds is 1.
 */
schema.virtual('rounds').get(function () {
    'use strict';

    if (this.type === 'world cup') {
        return 7;
    }

    var lastRound, matches;
    matches = this.matches || [];
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
 */
schema.virtual('currentRound').get(function () {
    'use strict';

    var lastFinishedRound, lastFinishedRoundIsActive, hasUnfinishedMatch, matches;
    matches = this.matches || [];
    lastFinishedRound = matches.filter(function (match) {
        return match.finished;
    }.bind(this)).sort(function (a, b) {
        return b.round - a.round;
    }.bind(this))[0];

    lastFinishedRound = !lastFinishedRound ? 1 : lastFinishedRound.round;
    lastFinishedRoundIsActive = matches.some(function (match) {
        return match.round === lastFinishedRound && !match.finished;
    }.bind(this));

    hasUnfinishedMatch = matches.some(function (match) {
        return !match.finished;
    });

    if (lastFinishedRoundIsActive || !hasUnfinishedMatch) {
        return lastFinishedRound;
    } else {
        return lastFinishedRound + 1;
    }
});

module.exports = mongoose.model('Championship', schema);