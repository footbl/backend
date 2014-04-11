/**
 * @module
 * Manages comment resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, Comment;

router  = require('express').Router();
nconf   = require('nconf');
Comment = require('../models/comment');

/**
 * @method
 * @summary Creates a new comment in database
 *
 * @param request.user
 * @param request.matchId
 * @param request.date
 * @param request.message
 * @param response
 *
 * @returns 201 comment
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/championships/:championshipId/matches/:matchId/comments', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var comment;
    comment = new Comment({
        'user'    : request.session._id,
        'match'   : request.params.matchId,
        'date'    : request.param('date'),
        'message' : request.param('message')
    });

    return comment.save(function (error) {
        if (error) { return response.send(500, error); }
        response.header('Location', '/championships/' + request.param.championshipId + '/matches/' + request.param.matchId + '/comments/' + comment._id);
        return response.send(201, comment);
    });
});

/**
 * @method
 * @summary List all comments in database
 *
 * @param request.matchId
 * @param response
 *
 * @returns 200 [comment]
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId/comments', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var query, page, pageSize, filterByFriends;
    query           = Comment.find();
    pageSize        = nconf.get('PAGE_SIZE');
    page            = request.param('page', 0) * pageSize;
    filterByFriends = request.param('filterByFriends');

    query.where('match').equals(request.params.matchId);
    query.populate('match');
    query.populate('user');
    query.skip(page);
    query.limit(pageSize);

    if (filterByFriends === true) {
        query.where('user').in(request.session.starred);
    } else if (filterByFriends === false) {
        query.where('user').nin(request.session.starred);
    }

    return query.exec(function (error, comments) {
        if (error) { return response.send(500, error); }
        return response.send(200, comments);
    });
});

/**
 * @method
 * @summary Get comment info in database
 *
 * @param request.commentId
 * @param response
 *
 * @returns 200 comment
 * @throws 404 comment not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/championships/:championshipId/matches/:matchId/comments/:commentId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) { return response.send(401, 'invalid token'); }

    var comment;
    comment = request.comment;

    response.header('Last-Modified', comment.updatedAt);
    return response.send(200, comment);
});

/**
 * @method
 * @summary Updates comment info in database
 *
 * @param request.commentId
 * @param request.date
 * @param request.message
 * @param response
 *
 * @returns 200 comment
 * @throws 500 error
 * @throws 404 comment not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/championships/:championshipId/matches/:matchId/comments/:commentId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    var comment;
    comment = request.comment;

    if (!request.session || request.session._id.toString() !== comment.user._id.toString()) { return response.send(401, 'invalid token'); }

    comment.date    = request.param('date');
    comment.message = request.param('message');

    return comment.save(function (error) {
        if (error) { return response.send(500, error); }
        return response.send(200, comment);
    });
});

/**
 * @method
 * @summary Removes comment from database
 *
 * @param request.commentId
 * @param response
 *
 * @returns 200 comment
 * @throws 500 error
 * @throws 404 comment not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/championships/:championshipId/matches/:matchId/comments/:commentId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    var comment;
    comment = request.comment;

    if (!request.session || request.session._id.toString() !== comment.user._id.toString()) { return response.send(401, 'invalid token'); }

    return comment.remove(function (error) {
        if (error) { return response.send(500, error); }
        return response.send(200, comment);
    });
});

/**
 * @method
 * @summary Puts requested comment in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 *
 * @returns comment
 * @throws 404 comment not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.param('commentId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Comment.findOne();
    query.where('_id').equals(id);
    query.where('match').equals(request.params.matchId);
    query.populate('match');
    query.populate('user');
    query.exec(function (error, comment) {
        if (error) { return response.send(404, 'comment not found'); }
        if (!comment) { return response.send(404, 'comment not found'); }

        request.comment = comment;
        return next();
    });
});

module.exports = router;