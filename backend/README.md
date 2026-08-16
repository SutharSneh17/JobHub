# JobHub — Backend REST API Server

This directory contains the Node.js & Express.js server providing the RESTful API for the **JobHub** platform.

---

## 🛠️ Technology Stack

- **Node.js & Express.js (v5)**: Backend runtime and server framework
- **Mongoose & MongoDB Atlas**: Object Data Modeling (ODM) and database connection
- **JWT & Cookie-Parser**: Secure cookie-based authentication
- **Multer & DataURI**: File handling for user resumes and company logos
- **Cloudinary**: Cloud media storage for uploaded files
- **Nodemailer**: Email notifications

---

## 🔑 Environment Variables Setup

Create a `.env` file in this directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
COOKIE_EXPIRE=7

# Email Config
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

---

## ⚡ Running the API Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode (with Nodemon auto-reload):
   ```bash
   npm run dev
   ```

3. Run in production mode:
   ```bash
   npm start
   ```

4. Health Check Endpoint:
   ```http
   GET http://localhost:5000/api/health
   ```

For full API endpoint documentation and architectural details, refer to the [Root README](../README.md).
