// File Path: backend/models/jobModel.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide the job title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide the job description'],
        trim: true
    },
    requirements: [{
        type: String 
    }],
    salary: {
        type: Number,
        required: [true, 'Please specify the salary for this position']
    },
    lastScheduledInterview: { 
        type: Date, 
        default: null 
    },
    experienceLevel: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: [true, 'Please provide the work location'],
        trim: true
    },
    jobType: {
        type: String,
        required: [true, 'Please state the job classification'],
        enum: {
            values: ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'],
            message: 'Please select a valid job type'
        }
    },
    position: {
        type: Number,
        required: [true, 'Please specify the number of open positions'],
        default: 1
    },
    // --- NEW FIELDS ADDED ---
    timing: {
        type: String
    },
    workingDays: {
        type: String
    },
    transportation: {
        type: String
    },
    workMode: {
        type: String
    },
    laptopRequired: {
        type: String
    },
    // ------------------------
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    createdById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);