const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        message = 'Resource was not found';
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        message = 'Email address is already registered';
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

module.exports = errorHandler;
