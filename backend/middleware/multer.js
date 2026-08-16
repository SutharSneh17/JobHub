// File Path: backend/middlewares/multer.js
const multer = require('multer');

// Store the file in memory temporarily as a buffer
const storage = multer.memoryStorage();

// Accept a single file upload using the field name "file"
const singleUpload = multer({ storage }).single('file');

module.exports = singleUpload;