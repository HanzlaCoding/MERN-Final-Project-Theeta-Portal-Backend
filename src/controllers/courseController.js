const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');
const imageKit = require('../services/imageKit');

// Create a new course (Admin only)
const createCourse = async (req, res, next) => {
  try {
    const { title, description, instructor, price } = req.body;

    let thumbnailData = {};

    // 1. Check if the frontend sent an image file
    if (req.file) {
      // Convert the memory buffer to base64 so ImageKit can accept it
      const fileBase64 = req.file.buffer.toString('base64');

      // Upload the image to ImageKit
      const uploadResponse = await imageKit.upload({
        file: fileBase64,
        fileName: req.file.originalname,
        folder: '/theeta_courses' // Store course thumbnails in a specific folder
      });

      // Extract the url, fileId, and original name to save in our database
      thumbnailData = {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: req.file.originalname
      };
    }

    // 2. Create the new course Document
    const newCourse = await Course.create({
      title,
      description,
      instructor,
      price: price || 0,
      thumbnail: thumbnailData
    });
    // Changes khud kr rhy hn
    await newCourse.save();

    res.status(201).json({
      message: 'Course created successfully.',
      course: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

// Enroll a student in a course
const enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Validate that the provided ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid Course ID format.' });
    }

    // 1. Check if the course actually exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // 2. Add the course to the user's enrolledCourses array
    // $addToSet ensures we don't enroll them twice in the same course
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true } // Return the updated user document
    ).select('-password');

    res.status(200).json({
      message: 'Successfully enrolled in course.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all available courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCourse, enrollInCourse, getAllCourses };



