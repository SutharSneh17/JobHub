// File Path: backend/controllers/userController.js
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('../utils/cloudinary'); 
const getDataUri = require('../utils/datauri'); 

const getUserProfile = async (req, res, next) => {
    try {
        // UPDATED: Added .populate() to fetch the full job and company details
        const user = await User.findById(req.user.id).populate({
            path: 'profile.savedJobs',
            populate: {
                path: 'companyId'
            }
        });
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (req.files) {
            if (req.files.file) {
                const resumeFile = req.files.file[0];
                const resumeUri = getDataUri(resumeFile);
                const cloudResponse = await cloudinary.uploader.upload(resumeUri.content, {
                    resource_type: 'raw',
                    format: 'pdf'
                });
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = resumeFile.originalname;
            }

            if (req.files.profilePhoto) {
                const photoFile = req.files.profilePhoto[0];
                const photoUri = getDataUri(photoFile);
                const cloudResponse = await cloudinary.uploader.upload(photoUri.content, {
                    resource_type: 'image'
                });
                user.profile.profilePhoto = cloudResponse.secure_url;
            }
        }

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        if (skills) {
            user.profile.skills = skills.split(',').map(skill => skill.trim());
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler('Please provide both current and new passwords', 400));
        }

        const user = await User.findById(req.user.id).select('+password');

        const isMatched = await user.comparePassword(oldPassword);
        if (!isMatched) {
            return next(new ErrorHandler('Current password is incorrect', 400));
        }

        if (newPassword.length < 6) {
            return next(new ErrorHandler('New password must be at least 6 characters long', 400));
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

const toggleSaveJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (!user.profile.savedJobs) {
            user.profile.savedJobs = [];
        }

        const isSaved = user.profile.savedJobs.includes(jobId);

        if (isSaved) {
            user.profile.savedJobs = user.profile.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            user.profile.savedJobs.push(jobId);
        }

        await user.save();

        // UPDATED: Populate the data before sending it back to the frontend
        await user.populate({
            path: 'profile.savedJobs',
            populate: { path: 'companyId' }
        });

        res.status(200).json({
            success: true,
            message: isSaved ? "Job removed from saved list" : "Job saved successfully",
            savedJobs: user.profile.savedJobs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProfile, updateProfile, updatePassword, logout, toggleSaveJob };