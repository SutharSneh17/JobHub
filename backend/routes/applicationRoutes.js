// File Path: backend/routes/applicationRoutes.js
const express = require('express');
const { applyJob, getAppliedJobs, getApplicants, updateStatus } = require('../controllers/applicationController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Student Core Interaction Endpoints
router.route('/apply/:id').post(isAuthenticated, authorizeRoles('student'), applyJob);
router.route('/applied').get(isAuthenticated, authorizeRoles('student'), getAppliedJobs);

// Recruiter Assessment Pipelines
router.route('/:id/applicants').get(isAuthenticated, authorizeRoles('recruiter'), getApplicants);
router.route('/status/:id/update').put(isAuthenticated, authorizeRoles('recruiter'), updateStatus);

module.exports = router;