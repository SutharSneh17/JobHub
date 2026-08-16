// File Path: backend/controllers/jobController.js
const Job = require('../models/jobModel');
const ErrorHandler = require('../utils/errorHandler');

// @desc    Post a new job opening
// @route   POST /api/v1/job/post
const postJob = async (req, res, next) => {
    try {
        // UPDATED: Added the 5 new fields to the destructuring
        const { 
            title, description, requirements, salary, location, 
            jobType, position, companyId, experienceLevel,
            timing, workingDays, transportation, workMode, laptopRequired 
        } = req.body;

        if (!title || !description || !salary || !location || !jobType || !companyId) {
            return next(new ErrorHandler('Please enter all required fields', 400));
        }

        // Process requirements comma-separated text safely into an clean text array
        let processedRequirements = [];
        if (requirements) {
            processedRequirements = requirements.split(',').map(reqItem => reqItem.trim());
        }

        const job = await Job.create({
            title,
            description,
            requirements: processedRequirements,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experienceLevel ? Number(experienceLevel) : 0, 
            position: position || 1,
            // --- UPDATED: Save new fields to database ---
            timing,
            workingDays,
            transportation,
            workMode,
            laptopRequired,
            // --------------------------------------------
            companyId,
            createdById: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Job opening posted successfully',
            job
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all active jobs (For Students / Public)
// @route   GET /api/v1/job/all
const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate({
            path: 'companyId',
            select: 'name logo website location'
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single job details by ID
// @route   GET /api/v1/job/details/:id
const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate({
                path: 'companyId'
            })
            .populate('applications'); 

        if (!job) {
            return next(new ErrorHandler('Job posting not found', 404));
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs posted by a specific Recruiter
// @route   GET /api/v1/job/recruiter/all
const getRecruiterJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ createdById: req.user.id })
            .populate({
                path: 'companyId',
                select: 'name logo website' // <--- ADDED: logo and website
            })
            .populate('applications')
            .sort({ createdAt: -1 }); 

        res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { postJob, getAllJobs, getJobById, getRecruiterJobs };