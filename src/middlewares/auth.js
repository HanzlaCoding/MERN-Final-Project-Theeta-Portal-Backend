const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../../config/config');

// Middleware to check if the user is authenticated
const isAuth = async (req, res, next) => {
  try {
    // 1. Get the token from the cookie
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    // 2. Verify the token using our secret key from config
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3. Find the user in the database based on the token's payload (userId)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found. Token is invalid.' });
    }

    // 4. Attach the user document to the request object so the next functions can use it
    req.user = user;

    // 5. Allow the request to continue to the next function
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check if the user is an admin
// Note: This must be used AFTER the isAuth middleware
const isAdmin = (req, res, next) => {
  // Check the role of the user that we attached in isAuth
  if (req.user && req.user.role === 'admin') {
    next(); // They are an admin, let them pass
  } else {
    // Stop the request and return a 403 Forbidden error
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { isAuth, isAdmin };