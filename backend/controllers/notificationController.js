// File Path: backend/controllers/notificationController.js
const Notification = require('../models/notificationModel');
const ErrorHandler = require('../utils/errorHandler');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/v1/notifications
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // Puts the newest notifications at the top

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/v1/notifications/:id/read
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        }

        // Ensure the user actually owns this notification
        if (notification.userId.toString() !== req.user.id) {
            return next(new ErrorHandler('Not authorized to update this notification', 403));
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getNotifications, markAsRead };