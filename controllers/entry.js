/**
 * @apiDefineStructure entryParams
 * @apiParam {String} championship Entry championship
 */
/**
 * @apiDefineStructure entrySuccess
 * @apiSuccess {String} slug Entry identifier
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 *
 * @apiSuccess (championship) {String} name Championship name.
 * @apiSuccess (championship) {String} slug Championship identifier.
 * @apiSuccess (championship) {String} picture Championship picture for display.
 * @apiSuccess (championship) {Number} year Championship year of occurrence.
 * @apiSuccess (championship) {String} type Championship type.
 * @apiSuccess (championship) {String} country Championship country of occurrence.
 * @apiSuccess (championship) {Date} createdAt Date of document creation.
 * @apiSuccess (championship) {Date} updatedAt Date of document last change.
 * @apiSuccess (championship) {Number} rounds Championship number of rounds.
 * @apiSuccess (championship) {Number} currentRound Championship current round.
 *
 * @apiSuccess (user) {String} slug User identifier
 * @apiSuccess (user) {String} email User email
 * @apiSuccess (user) {String} username User username
 * @apiSuccess (user) {String} name User name
 * @apiSuccess (user) {String} about User about
 * @apiSuccess (user) {Boolean} verified User verified
 * @apiSuccess (user) {Boolean} featured User featured
 * @apiSuccess (user) {String} picture User picture
 * @apiSuccess (user) {String} apnsToken User apnsToken
 * @apiSuccess (user) {Number} ranking User current ranking
 * @apiSuccess (user) {Number} previousRanking User previous ranking
 * @apiSuccess (user) {Number} funds User funds
 * @apiSuccess (user) {Number} stake User stake
 * @apiSuccess (user) {Date} createdAt Date of document creation.
 * @apiSuccess (user) {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, async, auth, User, Championship, Entry;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
async = require('async');
auth = require('../lib/auth');
User = require('../models/user');
Championship = require('../models/championship');
Entry = require('../models/entry');

/**
 * @method
 * @summary Puts requested championship in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.use(function findChampionship(request, response, next) {
    'use strict';

    var query, championship;
    championship = request.param('championship');
    if (!championship) {
        return next();
    }
    query = Championship.findOne();
    query.where('slug').equals(championship);
    return query.exec(function (error, championship) {
        if (error) {
            error = new VError(error, 'error finding championship: "$s"', championship);
            return next(error);
        }
        request.championship = championship;
        return next();
    });
});

/**
 * @api {post} /users/:user/entries Creates a new entry in database.
 * @apiName createEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Creates a new entry in database.
 *
 * @apiStructure entryParams
 * @apiStructure entrySuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "championship": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "slug": "brasileirao-brasil-2014",
 *       "championship": {
 *         "name": "Brasileirão",
 *         "slug": "brasileirao-brasil-2014",
 *         "country" : "brasil",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "edition": 2014,
 *         "type": "national league",
 *         "rounds": 7,
 *         "currentRound" : 4,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/entries')
.post(auth.session())
.post(function validateUserToCreate(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (request.session._id.toString() !== user._id.toString()) {
        return response.send(405);
    }
    return next();
})
.post(function createEntry(request, response, next) {
    'use strict';

    var entry;
    entry = new Entry({
        'slug'         : request.championship ? request.championship.slug : null,
        'championship' : request.championship,
        'user'         : request.session._id
    });
    return async.series([entry.save.bind(entry), function (next) {
        entry.populate('championship');
        entry.populate('user');
        entry.populate(next);
    }], function createdEntry(error) {
        if (error) {
            error = new VError(error, 'error creating entry');
            return next(error);
        }
        return response.send(201, entry);
    });
});

/**
 * @api {get} /users/:user/entries List all entries in database
 * @apiName listEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * List all entries in database.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure entrySuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "slug": "brasileirao-brasil-2014",
 *       "championship": {
 *         "name": "Brasileirão",
 *         "slug": "brasileirao-brasil-2014",
 *         "country" : "brasil",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "edition": 2014,
 *         "type": "national league",
 *         "rounds": 7,
 *         "currentRound" : 4,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/users/:user/entries')
.get(auth.session())
.get(function listEntry(request, response, next) {
    'use strict';

    var pageSize, page, query;
    pageSize = nconf.get('PAGE_SIZE');
    page = request.param('page', 0) * pageSize;
    query = Entry.find();
    query.where('user').equals(request.user._id);
    query.populate('championship');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function listedEntry(error, entries) {
        if (error) {
            error = new VError(error, 'error finding entries');
            return next(error);
        }
        return response.send(200, entries);
    });
});

/**
 * @api {get} /users/:user/entries/:id Get entry info in database
 * @apiName getEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Get entry info in database.
 *
 * @apiStructure entrySuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "slug": "brasileirao-brasil-2014",
 *       "championship": {
 *         "name": "Brasileirão",
 *         "slug": "brasileirao-brasil-2014",
 *         "country" : "brasil",
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "edition": 2014,
 *         "type": "national league",
 *         "rounds": 7,
 *         "currentRound" : 4,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "user": {
 *         "slug": "fan",
 *         "email": "fan@vandoren.com",
 *         "username": "fan",
 *         "name": "Fan",
 *         "about": "vandoren fan",
 *         "verified": false,
 *         "featured": false,
 *         "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *         "ranking": "3",
 *         "previousRanking": "2",
 *         "history": [{
 *           "date": "2014-07-01T12:22:25.058Z",
 *           "funds": 100
 *         },{
 *           "date": "2014-07-03T12:22:25.058Z",
 *           "funds": 120
 *         }],
 *         "funds": 100,
 *         "stake": 0,
 *         "createdAt": "2014-07-01T12:22:25.058Z",
 *         "updatedAt": "2014-07-01T12:22:25.058Z"
 *       },
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/users/:user/entries/:id')
.get(auth.session())
.get(function getEntry(request, response) {
    'use strict';

    var entry;
    entry = request.entry;
    return response.send(200, entry);
});

/**
 * @api {delete} /users/:user/entries/:id Removes entry from database
 * @apiName removeEntry
 * @apiVersion 2.0.1
 * @apiGroup entry
 * @apiPermission none
 * @apiDescription
 * Removes entry from database
 */
router
.route('/users/:user/entries/:id')
.delete(auth.session())
.delete(function validateEntryToDelete(request, response, next) {
    'use strict';

    var user;
    user = request.user;
    if (request.session._id.toString() !== user._id.toString()) {
        return response.send(405);
    }
    return next();
})
.delete(function removeEntry(request, response, next) {
    'use strict';

    var entry;
    entry = request.entry;
    return entry.remove(function removedEntry(error) {
        if (error) {
            error = new VError(error, 'error removing entry: "$s"', request.params.id);
            return next(error);
        }
        return response.send(204);
    });
});

/**
 * @method
 * @summary Puts requested entry in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('id', function findEntry(request, response, next, id) {
    'use strict';

    var query;
    query = Entry.findOne();
    query.where('user').equals(request.user._id);
    query.where('slug').equals(id);
    query.populate('championship');
    query.populate('user');
    query.exec(function foundEntry(error, entry) {
        if (error) {
            error = new VError(error, 'error finding entry: "$s"', id);
            return next(error);
        }
        if (!entry) {
            return response.send(404);
        }
        request.entry = entry;
        return next();
    });
});

/**
 * @method
 * @summary Puts requested user in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 */
router.param('user', auth.session());
router.param('user', function findUser(request, response, next, id) {
    'use strict';

    var query;
    query = User.findOne();
    if (id === 'me') {
        request.user = request.session;
        return next();
    }
    query.where('slug').equals(id);
    return query.exec(function foundUser(error, user) {
        if (error) {
            error = new VError(error, 'error finding user: "$s"', id);
            return next(error);
        }
        if (!user) {
            return response.send(404);
        }
        request.user = user;
        return next();
    });
});

module.exports = router;