// File Path: backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // ... [Your existing schema fields go here exactly as they were in Step 2] ...
    fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide your phone number'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a secure password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false 
    },
    role: {
        type: String,
        required: [true, 'Please specify a user role'],
        enum: {
            values: ['student', 'recruiter', 'admin'],
            message: 'Role must be either student, recruiter, or admin'
        }
    },
    profile: {
        bio: { type: String, default: '' },
        skills: [{ type: String }],
        resume: { type: String, default: '' },
        resumeOriginalName: { type: String, default: '' },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company' 
        },
        profilePhoto: { type: String, default: '' },
        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
    }
}, {
    timestamps: true 
});

// File Path: backend/models/userModel.js

// Hash password before saving to the database (Modern Mongoose async approach)
userSchema.pre('save', async function () {
    // If password is not modified, skip hashing completely
    if (!this.isModified('password')) {
        return;
    }
    
    // Hash the password and replace the plain text
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports = mongoose.model('User', userSchema);