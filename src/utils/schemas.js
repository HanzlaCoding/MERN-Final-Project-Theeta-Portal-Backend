const Joi = require('joi');

// Define validation rules for when a user registers
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of 2 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('student', 'admin').optional()
});

// Define validation rules for login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  })
});

// Define validation rules for course creation
// .unknown(true) allows extra fields like 'url' that might be added by intermediate middlewares
const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  instructor: Joi.string().required(),
  price: Joi.number().min(0).optional()
}).unknown(true);

module.exports = { registerSchema, loginSchema, courseSchema };
