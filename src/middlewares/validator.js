// A middleware function that accepts a Joi schema and validates the request body
// We return a middleware function dynamically based on the schema provided
const validate = (schema) => {
  return (req, res, next) => {
    // Validate req.body against the provided schema
    // abortEarly: false ensures we get all errors at once, not just the first one
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      // If validation fails, extract the error messages
      const errorMessages = error.details.map((detail) => detail.message);
      
      // Return a 400 Bad Request with the errors in plain text
      return res.status(400).json({ 
        message: 'Validation failed. Please check your data.',
        errors: errorMessages 
      });
    }
    
    // Data is valid. Proceed to the next step.
    next();
  };
};

module.exports = validate;
