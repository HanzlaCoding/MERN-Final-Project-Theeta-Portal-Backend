// src/config/config.js
// This file is the "Single Source of Truth" for all environment variables.
// No other file in the project should use process.env directly.

// Initialize dotenv immediately to load variables from the .env file.
require('dotenv').config();

const config = {
  // Server port
  port: process.env.PORT || 5000,
  
  // Environment (development or production)
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Atlas connection string
  mongoUri: process.env.MONGO_URI,
  
  // Secret key used to sign and verify JSON Web Tokens (JWT)
  jwtSecret: process.env.JWT_SECRET,
  
  // Credentials for ImageKit.io secure uploads
  imageKit: {
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint: process.env.IK_URL_ENDPOINT,
  }
};

module.exports = config;
