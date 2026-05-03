const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validator');
const { registerSchema, loginSchema } = require('../utils/schemas');

// POST /api/auth/register
// 1. Validates the incoming req.body against registerSchema
// 2. If valid, proceeds to the authController.register function
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
// 1. Validates the incoming req.body against loginSchema
// 2. If valid, proceeds to the authController.login function
router.post('/login', validate(loginSchema), authController.login);

// POST /api/auth/logout
// 1. Clears the HTTP-only authentication cookie
router.post('/logout', authController.logout);

module.exports = router;
