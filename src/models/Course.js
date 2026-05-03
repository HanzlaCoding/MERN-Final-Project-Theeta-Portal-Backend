const mongoose = require('mongoose');

// Define the blueprint for a Course.
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Every course needs a title
    },
    description: {
      type: String,
      required: true, // Explain what the course is about
    },
    thumbnail: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      name: { type: String, default: '' }
    },
    instructor: {
      type: String,
      required: true, // The name of the teacher
    },
    price: {
      type: Number,
      default: 0, // Set to 0 (free) if no price is provided
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt automatic dates
  }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
