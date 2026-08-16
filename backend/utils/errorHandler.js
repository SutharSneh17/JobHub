// File Path: backend/utils/errorHandler.js

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Captures the stack trace to keep track of where the error occurred
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;