const config = require('../../config/config');

// A global error catcher that formats all errors into a simple JSON response
// By having 4 parameters (err, req, res, next), Express knows this is an error handler
const errorHandler = (err, req, res, next) => {
  // Log the error to the console for debugging
  console.error(err.stack);

  // If the error already has a status code we use it, otherwise default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server',
    // In plain English: give more details only if we are in development mode
    stack: config.nodeEnv === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
