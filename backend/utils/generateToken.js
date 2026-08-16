// File Path: backend/utils/generateToken.js

const sendToken = (user, statusCode, res) => {
    // Get the generated token from the User model instance
    const token = user.getJWTToken();

    // Define cookie options
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Ensures the cookie cannot be accessed via client-side JavaScript
    };

    // Remove the password field from the user object before sending it in the response
    user.password = undefined;

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;