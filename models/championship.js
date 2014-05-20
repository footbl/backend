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
 * @summary Counts championship number of rounds
 * To calculate the number of round in a championship, the system should return the highest round value in the matches.
 * And if the championship don't have any match the default number of rounds is 1.
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('init', function (next, data) {
    'use strict';

    var query;
    query = require('./match').findOne();
    query.where('championship').equals(data._id);
    query.sort({round : -1});
    query.exec(function  (error, match) {
        this._rounds = !match ? 1 : match.round;
        next();
    }.bind(this));
});

/**
 * @callback
 * @summary Calculates championship current round
 * To calculate the championship current round, this method should return the highest round values in the matches that
 * have already finished. And if no match has finished, the default current round is 1.
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('init', function (next, data) {
    'use strict';

    var query;
    query = require('./match').findOne();
    query.where('championship').equals(data._id);
    query.where('finished').equals(true);
    query.sort({round : -1});
    query.exec(function  (error, match) {
        this._currentRound = !match ? 1 : match.round;
        next();
    }.bind(this));
});

/**
 * @callback
 * @summary Checks if championship round is finished
 * To calculate if the championship current round have finished, this method should see if all matches in the current
 * round have already finished.
 *
 * @param next
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.pre('init', function (next, data) {
    'use strict';

    var query;
    query = require('./match').findOne();
    query.where('championship').equals(data._id);
    query.where('finished').equals(false);
    query.where('round').equals(this.currentRound);
    query.exec(function  (error, match) {
        this._roundFinished = !match;
        next();
    }.bind(this));
});

/**
 * @method
 * @summary Returns the number of rounds
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('rounds').get(function () {
    'use strict';

    return this._rounds;
});

/**
 * @method
 * @summary Returns the current round number
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('currentRound').get(function () {
    'use strict';

    return this._currentRound;
});

/**
 * @method
 * @summary Checks if round is finished
 *
 * @since 2014-05
 * @author Rafael Almeida Erthal Hermano
 */
schema.virtual('roundFinished').get(function () {
    'use strict';

    return this._roundFinished;
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