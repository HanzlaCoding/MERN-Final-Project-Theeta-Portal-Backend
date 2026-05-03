const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { isAuth, isAdmin } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { courseSchema } = require('../utils/schemas');
const upload = require('../middlewares/upload');

// POST /api/courses
// 1. isAuth: Must be logged in
// 2. isAdmin: Must be an admin
// 3. upload.single('thumbnail'): Handle optional image upload from the 'thumbnail' form field
// 4. validate(courseSchema): Check the text data
// 5. Controller: Create the course in DB (and do ImageKit upload)
router.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('thumbnail'),
  validate(courseSchema),
  courseController.createCourse
);

// GET /api/courses
// Fetch all existing courses (Public or logged in, lets allow anyone to see catalog)
router.get('/', courseController.getAllCourses);

// POST /api/courses/enroll/:id
// 1. isAuth: Must be logged in to enroll
// 2. Controller: Adds the course to the user's enrolled array
router.post('/enroll/:id', isAuth, courseController.enrollInCourse);

module.exports = router;


// Multer => For file handeling!