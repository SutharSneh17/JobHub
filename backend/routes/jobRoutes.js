// File Path: backend/routes/jobRoutes.js
const express = require('express');
const { postJob, getAllJobs, getJobById, getRecruiterJobs } = require('../controllers/jobController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public / Student Routes
router.route('/all').get(getAllJobs);
router.route('/details/:id').get(getJobById);

// Strictly Protected Recruiter Routes
router.route('/post').post(isAuthenticated, authorizeRoles('recruiter'), postJob);
router.route('/recruiter/all').get(isAuthenticated, authorizeRoles('recruiter'), getRecruiterJobs);

module.exports = router;