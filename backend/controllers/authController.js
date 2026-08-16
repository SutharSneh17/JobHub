// File Path: backend/controllers/authController.js
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// File Path: backend/controllers/authController.js

// @desc    Register a new user
// @route   POST /api/v1/auth/register
const registerUser = async (req, res, next) => { // <-- Ensure 'next' is added right here!
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        if (!fullName || !email || !phoneNumber || !password || !role) {
            return next(new ErrorHandler('Please enter all required fields', 400));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new ErrorHandler('Email already registered', 400));
        }

        const user = await User.create({
            fullName,
            email,
            phoneNumber,
            password,
            role
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error); 
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return next(new ErrorHandler('Please enter email, password, and role', 400));
        }

        // Find user and explicitly select the password field for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // Compare entered password with database hash
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // Ensure the user is logging into the correct portal (Student vs Recruiter)
        if (user.role !== role) {
            return next(new ErrorHandler(`Account does not exist with ${role} role`, 400));
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
const logoutUser = async (req, res, next) => {
    try {
        // Clear the cookie by setting it to an empty string and expiring it immediately
        res.status(200).cookie('token', '', {
            expires: new Date(Date.now()),
            httpOnly: true,
        }).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, logoutUser };