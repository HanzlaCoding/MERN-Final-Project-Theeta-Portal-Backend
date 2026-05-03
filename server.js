const app = require('./src/app');
const config = require('./config/config');
const connectDB = require('./src/db/db');

// 1. Connect to MongoDB Atlas Database
connectDB();

// 2. Start the Server using the port from centralized config
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});