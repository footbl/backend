
exports.mongoose = function () {
    'use strict';

    return function (error, request, response, next) {
        var errors, prop;
        if (error && error.cause && error.cause()) {
            if (error.cause().code === 11000) {
                return response.send(409);
            }
            if (error.cause().errors) {
                errors = {};
                for (prop in error.cause().errors) {
                    if (error.cause().errors.hasOwnProperty(prop)) {
                        errors[prop] = error.cause().errors[prop].type;
                    }
                }
                return response.send(400, errors);
            }
            if (error.message.indexOf('match already started') > -1) {
                return response.send(400);
            }
            if (error.message.indexOf('insufficient funds') > -1) {
                return response.send(400);
            }
        }
        return next(error);
    };
};

exports.notFound = function (param) {
    'use strict';

    return function (request, response, next) {
        if (!request[param]) {
            return response.send(404);
        }
        return next();
    };
};