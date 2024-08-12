const logger = require('../config/logger');
const error = require('../utils/error');

const errorHandler = function (err, req, res, next) {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors = [];
    let data = null;

    if (err instanceof error) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
        data = err.data;
    } else {
        errors = [err.message];
    }

    // Log the error details
    logger.error('Error occurred: ' + message, {
        statusCode: statusCode,
        errors: errors,
        data: data,
        stack: err.stack // Include stack trace if available
    });

    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: message,
        errors: errors,
        data: data,
    });
};

module.exports = errorHandler;