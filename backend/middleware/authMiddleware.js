// File Path: backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
// FIXED: Removed the rogue require statement that was causing a duplicate declaration error

// Middleware to verify if the user is logged in
const isAuthenticated = async (req, res, next) => {
    try {
        // Extract token from request cookies
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        // Decode the token using our secret key
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database and attach it to the request object
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return next(new ErrorHandler('User session expired or not found', 404));
        }

        next(); // Proceed to the actual controller function
    } catch (error) {
        return next(new ErrorHandler('Authentication token is invalid or expired', 401));
    }
};

// Middleware to restrict access based on user role (student, recruiter, admin)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the current user's role is included in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not authorized to access this resource`, 
                    403
                )
            );
        }
        next();
    };
};

module.exports = { isAuthenticated, authorizeRoles };