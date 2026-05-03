const mongoose = require('mongoose');

// Define the schema for a User in the database.
// This acts as a blueprint for how every user document will look.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // A user must have a name
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
      lowercase: true, // Always store emails in lowercase to avoid case-sensitive duplicate issues
    },
    password: {
      type: String,
      required: true, // A password is required. It will be hashed before saving.
    },
    role: {
      type: String,
      enum: ['student', 'admin'], // Only allow these specific roles
      default: 'student', // By default, anyone signing up is a student
    },
    avatar: {
      // Store the image URL and the ImageKit file ID so we can display it or delete it later
      url: {
        type: String,
        default: 'https://ik.imagekit.io/default-avatar.png', // Generic fallback image
      },
      fileId: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: 'default',
      }
    },
    enrolledCourses: [
      {
        // An array of references to the Course model
        // This tracks which courses the user is currently taking
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
