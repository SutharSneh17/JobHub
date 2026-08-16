// File Path: backend/config/db.js
const mongoose = require('mongoose');
const dns = require('dns');

// Use Google/Cloudflare public DNS servers to resolve MongoDB SRV records reliably on Windows
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (err) {
    // Ignore if not supported in environment
}

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;