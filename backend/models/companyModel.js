// File Path: backend/models/companyModel.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the company name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    website: {
        type: String,
        trim: true,
        default: ''
    },
    location: {
        type: String,
        required: [true, 'Please provide the company location profile'],
        trim: true
    },
    logo: {
        type: String, // String path mapping to uploaded file location
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Company', companySchema);