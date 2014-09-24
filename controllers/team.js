/**
 * @apiDefineStructure teamParams
 * @apiParam {string} name Team name
 * @apiParam {string} [picture] Team picture
 */
/**
 * @apiDefineStructure teamSuccess
 * @apiSuccess {String} name Team name.
 * @apiSuccess {String} picture Team picture.
 * @apiSuccess {String} slug Team identifier.
 * @apiSuccess {Date} createdAt Date of document creation.
 * @apiSuccess {Date} updatedAt Date of document last change.
 */
var VError, router, nconf, slug, auth, Team;

VError = require('verror');
router = require('express').Router();
nconf = require('nconf');
slug = require('slug');
auth = require('../lib/auth');
Team = require('../models/team');

/**
 * @api {post} /teams Creates a new team.
 * @apiName createTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission admin
 * @apiDescription
 * Creates a new team.
 *
 * @apiStructure teamParams
 * @apiStructure teamSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required",
 *       "picture": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 201 Created
 *     {
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "slug": "53b2a7f0fea3f69192122f38",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/teams')
.post(auth.session('admin'))
.post(function createTeam(request, response, next) {
  'use strict';

  var team;
  team = new Team({
    'slug'    : slug(request.param('name', '')),
    'name'    : request.param('name'),
    'picture' : request.param('picture')
  });
  return team.save(function createdTeam(error) {
    if (error) {
      error = new VError(error, 'error creating team');
      return next(error);
    }
    return response.status(201).send(team);
  });
});

/**
 * @api {get} /teams List all teams
 * @apiName listTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission user
 * @apiDescription
 * List all teams.
 *
 * @apiParam {String} [page=0] The page to be displayed.
 * @apiStructure teamSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     [{
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }]
 */
router
.route('/teams')
.get(auth.session())
.get(function listTeam(request, response, next) {
  'use strict';

  var pageSize, page, query;
  pageSize = nconf.get('PAGE_SIZE');
  page = request.param('page', 0) * pageSize;
  query = Team.find();
  query.skip(page);
  query.limit(pageSize);
  return query.exec(function listedTeam(error, teams) {
    if (error) {
      error = new VError(error, 'error finding teams');
      return next(error);
    }
    return response.status(200).send(teams);
  });
});

/**
 * @api {get} /teams/:id Get team info
 * @apiName getTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission user
 * @apiDescription
 * Get team info.
 *
 * @apiStructure teamSuccess
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/teams/:id')
.get(auth.session())
.get(function getTeam(request, response) {
  'use strict';

  var team;
  team = request.team;
  return response.status(200).send(team);
});

/**
 * @api {put} /teams/:id Updates team info
 * @apiName updateTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission admin
 * @apiDescription
 * Updates team info.
 *
 * @apiStructure teamParams
 * @apiStructure teamSuccess
 *
 * @apiErrorExample
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "name": "required",
 *       "picture": "required"
 *     }
 *
 * @apiSuccessExample
 *     HTTP/1.1 200 Ok
 *     {
 *       "name": "santos fc",
 *       "slug": "santos-fc",
 *       "picture": "http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png",
 *       "createdAt": "2014-07-01T12:22:25.058Z",
 *       "updatedAt": "2014-07-01T12:22:25.058Z"
 *     }
 */
router
.route('/teams/:id')
.put(auth.session('admin'))
.put(function updateTeam(request, response, next) {
  'use strict';

  var team;
  team = request.team;
  team.slug = slug(request.param('name', ''));
  team.name = request.param('name');
  team.picture = request.param('picture');
  return team.save(function updatedTeam(error) {
    if (error) {
      error = new VError(error, 'error updating team');
      return next(error);
    }
    return response.status(200).send(team);
  });
});

/**
 * @api {delete} /teams/:id Removes team
 * @apiName removeTeam
 * @apiVersion 2.0.1
 * @apiGroup team
 * @apiPermission admin
 * @apiDescription
 * Removes team
 */
router
.route('/teams/:id')
.delete(auth.session('admin'))
.delete(function removeTeam(request, response, next) {
  'use strict';

  var team;
  team = request.team;
  return team.remove(function removedTeam(error) {
    if (error) {
      error = new VError(error, 'error removing team: "$s"', request.params.id);
      return next(error);
    }
    return response.status(204).end();
  });
});

router.param('id', function findTeam(request, response, next, id) {
  'use strict';

  var query;
  query = Team.findOne();
  query.where('slug').equals(id);
  return query.exec(function foundTeam(error, team) {
    if (error) {
      error = new VError(error, 'error finding team: "$s"', id);
      return next(error);
    }
    if (!team) {
      return response.status(404).end();
    }
    request.team = team;
    return next();
  });
});

module.exports = router;