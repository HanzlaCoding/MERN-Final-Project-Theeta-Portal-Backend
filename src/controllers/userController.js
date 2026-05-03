const User = require('../models/User');
const imageKit = require('../services/imageKit');

// Get the currently logged-in user's profile
const getMe = async (req, res, next) => {
  try {
    // The 'req.user' is already attached by the 'isAuth' middleware
    // We use .populate('enrolledCourses') to get the full course details, not just their IDs
    const user = await User.findById(req.user._id).populate('enrolledCourses').select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Update the user's avatar
const updateAvatar = async (req, res, next) => {
  try {
    // 1. Ensure a file was actually sent
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided. Please select a file to upload.' });
    }

    // 2. Convert the image buffer from multer to base64
    const fileBase64 = req.file.buffer.toString('base64');

    // 3. Upload the image directly to ImageKit
    const uploadResponse = await imageKit.upload({
      file: fileBase64,
      fileName: req.file.originalname,
      folder: '/theeta_avatars'
    });

    // 4. Update the user's avatar in the database with the new data
    const user = await User.findByIdAndUpdate(
      req.user._id, // Find the logged-in user
      { 
        avatar: { 
          url: uploadResponse.url, 
          fileId: uploadResponse.fileId,
          name: req.file.originalname
        } 
      }, // Update their avatar object
      { new: true, runValidators: true } // Return the updated user document
    ).select('-password');

    res.status(200).json({
      message: 'Avatar updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateAvatar };
