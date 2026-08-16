// File Path: backend/controllers/companyController.js
const Company = require('../models/companyModel');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('../utils/cloudinary'); // NEW: Cloudinary import
const getDataUri = require('../utils/datauri'); // NEW: DataURI import

// @desc    Register a new company profile
// @route   POST /api/v1/company/register
const registerCompany = async (req, res, next) => {
    try {
        const { companyName, location } = req.body;

        if (!companyName || !location) {
            return next(new ErrorHandler('Company name and location are required', 400));
        }

        // Validate unique name restriction
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return next(new ErrorHandler('A company with this name is already registered', 400));
        }

        // Create the company profile linked back to the current authenticated user ID
        company = await Company.create({
            name: companyName,
            location,
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Company profile initialized successfully',
            company
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all companies registered by the current recruiter
// @route   GET /api/v1/company/get
const getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find({ userId: req.user.id });
        
        res.status(200).json({
            success: true,
            companies
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get complete details for a single company by ID
// @route   GET /api/v1/company/get/:id
const getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        
        if (!company) {
            return next(new ErrorHandler('Company profile not found', 404));
        }

        res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update an existing company profile entry
// @route   PUT /api/v1/company/update/:id
const updateCompany = async (req, res, next) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file; // NEW: Catch the uploaded file from Multer

        const updateData = { name, description, website, location };

        // --- NEW CLOUDINARY LOGIC ---
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: 'image'
            });
            // Assign the Cloudinary URL to the logo field
            updateData.logo = cloudResponse.secure_url;
        }
        // ----------------------------

        // Query entry updates via the object key parameter path safely
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!company) {
            return next(new ErrorHandler('Company profile not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Company profile details updated successfully',
            company
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerCompany, getCompanies, getCompanyById, updateCompany };