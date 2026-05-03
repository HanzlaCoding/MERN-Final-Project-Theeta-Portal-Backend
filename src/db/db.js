const mongoose = require('mongoose');
const config = require('../../config/config'); // Import our centralized config

// Connect to MongoDB using the URI from config
const connectDB = async () => {
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(config.mongoUri,{
      dbName: "theeta-portal"
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there is an error, log it and exit the process
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
