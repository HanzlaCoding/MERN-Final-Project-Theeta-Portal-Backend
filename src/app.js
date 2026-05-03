const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // HTTP request logger
const cookieParser = require('cookie-parser');
const config = require('../config/config'); // Centralized config
const errorHandler = require('./middlewares/errorHandler');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

// Initialize Express App
const app = express();

// Middleware Setup

// Use morgan for colored HTTP request logs
app.use(morgan('dev'));

// Enable CORS so the frontend can communicate with this backend
app.use(cors({
  origin: 'https://theeta-lms.vercel.app/*', // Your frontend URL
  credentials: true // Allow cookies to be sent back and forth
}));

// Parse incoming cookies
app.use(cookieParser());

// Parse incoming JSON payloads (e.g. from POST requests)
app.use(express.json());
// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Register Routes
// Any request starting with /api/auth goes to authRoutes
app.use('/api/auth', authRoutes);
// Any request starting with /api/users goes to userRoutes
app.use('/api/users', userRoutes);
// Any request starting with /api/courses goes to courseRoutes
app.use('/api/courses', courseRoutes);

// A simple route to test if the app is running
app.get('/', (req, res) => {
  res.send('Theeta Student Portal API is running!');
});

// Register the global Error Handler
// This must be the VERY LAST middleware so it can catch all unhandled errors
app.use(errorHandler);

// Export the configured express app
module.exports = app;