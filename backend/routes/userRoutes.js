// File Path: backend/routes/userRoutes.js
const express = require('express');
const multer = require('multer'); // NEW: Import multer directly
const { getUserProfile, updateProfile, updatePassword, logout, toggleSaveJob } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// NEW: Create a specific multer instance for this route to accept two different files
const upload = multer({ storage: multer.memoryStorage() });
const multiUpload = upload.fields([
    { name: 'file', maxCount: 1 },         // For the Resume (PDF)
    { name: 'profilePhoto', maxCount: 1 }  // For the Profile Photo (Image)
]);

// All profile endpoints require the user to be logged in first
router.route('/profile').get(isAuthenticated, getUserProfile);

// FIXED: Using multiUpload instead of singleUpload
router.route('/profile/update').put(isAuthenticated, multiUpload, updateProfile);

router.route('/password/update').put(isAuthenticated, updatePassword);
router.route('/logout').get(logout);
router.route('/profile/save-job/:id').post(isAuthenticated, toggleSaveJob);
module.exports = router;