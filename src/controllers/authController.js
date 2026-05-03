const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// Handle user registration
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // 2. Hash the password before saving (10 rounds of salting is standard)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user and save to database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student', // Default to student if no role is provided
    });

    await newUser.save();

    // 4. Generate a token so the user is logged in automatically after registration
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // 5. Set the HTTP-Only cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    // 6. Return success
    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    // Pass errors to the global error handler
    next(error);
  }
};

// Handle user login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 2. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Generate a JSON Web Token (JWT) so the user can stay logged in
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload: what data to encode in the token
      config.jwtSecret, // Secret key from config (acts like a signature)
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // 4. Set the HTTP-Only cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'lax', // For cross-origin cookie policy
      secure: process.env.NODE_ENV === 'production' // true in production
    });

    // 5. Return the user info and the token parameter is removed as it's in the cookie
    res.status(200).json({
      message: 'Logged in successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Handle user logout
const logout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };
