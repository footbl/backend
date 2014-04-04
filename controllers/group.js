/**
 * @module
 * Manages group resource
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
var router, nconf, Group;

router = require('express').Router();
nconf  = require('nconf');
Group  = require('../models/group');

/**
 * @method
 * @summary Creates a new group in database
 *
 * @param request.name
 * @param request.championship
 * @param response
 *
 * @returns 201 group
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/groups', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group;
    group = new Group({
        'name'         : request.param('name'),
        'championship' : request.param('championship'),
        'owner'        : request.session._id,
        'members'      : [{'user' : request.session._id}]
    });

    return group.save(function (error) {
        if (error) {return response.send(500, error);}
        response.header('Location', '/groups/' + group._id);
        return response.send(201, group);
    });
});

/**
 * @method
 * @summary List all groups user belongs
 *
 * @param request
 * @param response
 *
 * @returns 200 [group]
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/groups', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var query, page, pageSize;
    query    = Group.find();
    pageSize = nconf.get('PAGE_SIZE');
    page     = request.param('page', 0) * pageSize;

    query.where('members.user').equals(request.session._id);
    query.populate('championship');
    query.populate('owner');
    query.skip(page);
    query.limit(pageSize);
    return query.exec(function (error, groups) {
        if (error) {return response.send(500, error);}
        return response.send(200, groups);
    });
});

/**
 * @method
 * @summary Get group info in database
 *
 * @param request.groupId
 * @param response
 *
 * @returns 200 group
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/groups/:groupId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group;
    group = request.group;

    response.header('Last-Modified', group.updatedAt);
    return response.send(200, group);
});

/**
 * @method
 * @summary Updates group info in database
 *
 * @param request.name
 * @param request.freeToEdit
 * @param response
 *
 * @returns 200 group
 * @throws 500 error
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.put('/groups/:groupId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group;
    group = request.group;

    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {return response.send(401, 'invalid token');}

    group.name = request.param('name');
    if (request.session._id.toString() === group.owner._id.toString()) {
        group.freeToEdit = request.param('freeToEdit');
    }

    return group.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, group);
    });
});

/**
 * @method
 * @summary Removes group from database
 *
 * @param request.championshipId
 * @param response
 *
 * @returns 200 group
 * @throws 500 error
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/groups/:groupId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group;
    group = request.group;

    if (request.session._id.toString() !== group.owner._id.toString()) {return response.send(401, 'invalid token');}

    return group.remove(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, group);
    });
});

/**
 * @method
 * @summary Creates a new group member
 *
 * @param request.user
 * @param response
 *
 * @returns 201 member
 * @throws 500 error
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.post('/groups/:groupId/members', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group;
    group = request.group;

    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {return response.send(401, 'invalid token');}

    group.members.push({user : request.param('user')});

    return group.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(201, group.members.pop());
    });
});

/**
 * @method
 * @summary Get group members in database
 *
 * @param request.groupId
 * @param response
 *
 * @returns 200 [members]
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/groups/:groupId/members', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group;
    group = request.group;

    return response.send(200, group.members)
});

/**
 * @method
 * @summary Removes group member from database
 *
 * @param request.groupId
 * @param request.memberId
 * @param response
 *
 * @returns 200 group
 * @throws 500 error
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.get('/groups/:groupId/members/:memberId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group, member;
    group = request.group;
    member = group.members.filter(function (member) {
        return member.user.toString() === request.params.memberId;
    }).pop();

    if (!member) {return response.send(404, 'member not found');}

    return response.send(200, member);
});

/**
 * @method
 * @summary Removes group member from database
 *
 * @param request.groupId
 * @param request.memberId
 * @param response
 *
 * @returns 200 group
 * @throws 500 error
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.delete('/groups/:groupId/members/:memberId', function (request, response) {
    'use strict';

    response.header('Content-Type', 'application/json');
    response.header('Content-Encoding', 'UTF-8');
    response.header('Content-Language', 'en');

    if (!request.session) {return response.send(401, 'invalid token');}

    var group, member;
    group = request.group;

    if (!group.freeToEdit && request.session._id.toString() !== group.owner._id.toString()) {return response.send(401, 'invalid token');}

    member = group.members.filter(function (member) {
        return member.user.toString() === request.params.memberId;
    }).pop();

    if (!member) {return response.send(404, 'member not found');}

    member.remove();

    return group.save(function (error) {
        if (error) {return response.send(500, error);}
        return response.send(200, member);
    });
});

/**
 * @method
 * @summary Puts requested group in request object
 *
 * @param request
 * @param response
 * @param next
 * @param id
 *
 * @returns group
 * @throws 404 group not found
 *
 * @since 2013-03
 * @author Rafael Almeida Erthal Hermano
 */
router.param('groupId', function (request, response, next, id) {
    'use strict';

    var query;
    query = Group.findOne();
    query.where('_id').equals(id);
    if (request.session) {
        query.where('members.user').equals(request.session._id);
    }
    query.populate('championship');
    query.populate('owner');
    query.exec(function (error, group) {
        if (error) {return response.send(404, 'group not found');}
        if (!group) {return response.send(404, 'group not found');}

        request.group = group;
        return next();
    });
});

module.exports = router;