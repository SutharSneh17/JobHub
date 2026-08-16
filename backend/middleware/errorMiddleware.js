// File Path: backend/middleware/errorMiddleware.js

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Handle Mongoose Bad Object ID Error (CastError)
    if (err.name === 'CastError') {
        err.message = `Resource not found. Invalid: ${err.path}`;
        err.statusCode = 400;
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err.statusCode = 400;
    }

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        err.message = Object.values(err.errors).map(val => val.message).join(', ');
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = globalErrorHandler;