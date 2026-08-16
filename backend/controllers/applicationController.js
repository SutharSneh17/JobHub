// File Path: backend/controllers/applicationController.js
const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail'); 
const Notification = require('../models/notificationModel');

// @desc    Apply for a specific job opening
// @route   POST /api/v1/application/apply/:id
const applyJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        // Verify that the target job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorHandler('Job posting not found', 404));
        }

        // Prevent duplicate applications from the same user
        const alreadyApplied = await Application.findOne({ jobId, applicantId: req.user.id });
        if (alreadyApplied) {
            return next(new ErrorHandler('You have already applied for this job opening', 400));
        }

        // Create application record
        const newApplication = await Application.create({
            jobId,
            applicantId: req.user.id
        });

        // Push the new application ID into the Job document and save it
        job.applications.push(newApplication._id);
        await job.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: newApplication._id
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs current logged in student has applied to
// @route   GET /api/v1/application/applied
const getAppliedJobs = async (req, res, next) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'jobId',
                populate: {
                    path: 'companyId',
                    select: 'name logo location'
                }
            });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applicants for a specific job opening (Recruiter specific)
// @route   GET /api/v1/application/:id/applicants
const getApplicants = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        const applications = await Application.find({ jobId })
            .populate({
                path: 'applicantId',
                select: 'fullName email phoneNumber profile'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applicants: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update candidate hiring status stage (Recruiter specific)
// @route   PUT /api/v1/application/status/:id/update
const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return next(new ErrorHandler('Please provide updated status option', 400));
        }

        const application = await Application.findById(applicationId)
            .populate('applicantId', 'fullName email') 
            .populate({
                path: 'jobId',
                select: 'title companyId position lastScheduledInterview', // Added lastScheduledInterview
                populate: { path: 'companyId', select: 'name' } 
            });

        if (!application) {
            return next(new ErrorHandler('Application entry not found', 404));
        }

        // --- Prevent Over-Hiring ---
        if (status.toLowerCase() === 'accepted' && application.status !== 'accepted') {
            const acceptedCount = await Application.countDocuments({
                jobId: application.jobId._id,
                status: 'accepted'
            });

            if (acceptedCount >= application.jobId.position) {
                return next(new ErrorHandler(`Cannot accept candidate. All ${application.jobId.position} position(s) are already filled.`, 400));
            }
        }

        // --- NEW: Calculate Interview Time ---
        let nextTime;
        if (status.toLowerCase() === 'accepted') {
            const job = await Job.findById(application.jobId._id);
            if (job.lastScheduledInterview) {
                // Add 30 mins
                nextTime = new Date(job.lastScheduledInterview.getTime() + 30 * 60000); 
            } else {
                // Default to tomorrow 10 AM
                nextTime = new Date();
                nextTime.setDate(nextTime.getDate() + 1);
                nextTime.setHours(10, 0, 0, 0);
            }
            
            // Save times
            application.interviewTime = nextTime;
            job.lastScheduledInterview = nextTime;
            await job.save();
        }

        // Update tracking status
        application.status = status.toLowerCase();
        await application.save();

        // Create Bell Notification
        await Notification.create({
            userId: application.applicantId._id || application.applicant, 
            message: `Your status has been updated to: ${status}.`,
            type: 'status_update'
        });

        // Send Email on Acceptance
        if (status.toLowerCase() === 'accepted') {
            const studentName = application.applicantId.fullName;
            const studentEmail = application.applicantId.email;
            const jobTitle = application.jobId.title;
            const companyName = application.jobId.companyId.name;
            
            // Format time for email
            const formattedTime = nextTime.toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium', 
                timeStyle: 'short' 
            });

            const message = `Hello ${studentName},\n\nGreat news! Your application for the ${jobTitle} position at ${companyName} has been Accepted.\n\nYour interview is scheduled for: ${formattedTime}.\n\nThe recruiter will be reaching out to you shortly with further details and next steps.\n\nBest Regards,\nJobHub`;

            try {
                await sendEmail({
                    email: studentEmail,
                    subject: `Application Accepted & Interview Scheduled: ${jobTitle} at ${companyName} 🎉`,
                    message: message,
                });
            } catch (emailError) {
                console.error("Notice: Status updated, but email failed to send.", emailError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { applyJob, getAppliedJobs, getApplicants, updateStatus };