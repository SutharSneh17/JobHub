// File Path: backend/routes/companyRoutes.js
const express = require('express');
// FIXED: Changed getCompany to getCompanies to match your controller exactly
const { getCompanies, getCompanyById, registerCompany, updateCompany } = require('../controllers/companyController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const singleUpload = require('../middleware/multer'); 

const router = express.Router();

router.route('/register').post(isAuthenticated, registerCompany);
// FIXED: Using getCompanies here
router.route('/get').get(isAuthenticated, getCompanies);
router.route('/get/:id').get(isAuthenticated, getCompanyById);
router.route('/update/:id').put(isAuthenticated, singleUpload, updateCompany);

module.exports = router;