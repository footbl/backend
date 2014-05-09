
module.exports = function (error) {
    'use strict';

    var errors, i;
    error  = error || {};
    errors = [];

    for (i in error.errors) {
        if (error.errors.hasOwnProperty(i)) {
            switch (error.errors[i].type) {
                case 'required':
                    errors.push(error.errors[i].path + ' is required');
                    break;
                case 'enum':
                    errors.push('invalid ' + error.errors[i].path);
                    break;
            }
        }
    }
    if (errors.length === 0) {
        if (error.code === 11000) {
            errors.push('duplicated');
        } else if (error.type === 'ObjectId') {
            errors.push('invalid ' + error.path);
        } else {
            errors.push(error.message);
        }
    }

    return errors;
};
