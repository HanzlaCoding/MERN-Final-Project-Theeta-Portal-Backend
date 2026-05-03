const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// GET /api/users/me
// 1. isAuth ensures the user is logged in
// 2. Extracts req.user, populates courses, returns the profile
router.get('/me', isAuth, userController.getMe);

// PUT /api/users/avatar
// 1. isAuth: User must be logged in
// 2. upload.single('avatar'): Multer processes the uploaded file (named 'avatar' in the form) into req.file.buffer
// 3. userController.updateAvatar: Uploads to ImageKit and updates database
router.put(
  '/avatar',
  isAuth,
  upload.single('avatar'),
  userController.updateAvatar
);

module.exports = router;
