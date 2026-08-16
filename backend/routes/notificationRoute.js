// File Path: backend/routes/notificationRoute.js
const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // FIXED: Correct file name and added curly braces

const router = express.Router();

// Both routes require the user to be logged in
router.route('/').get(isAuthenticated, getNotifications);
router.route('/:id/read').put(isAuthenticated, markAsRead);

module.exports = router;