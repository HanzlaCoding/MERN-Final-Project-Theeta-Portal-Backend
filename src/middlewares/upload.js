const multer = require('multer');

// Configure Multer to use memory storage.
// This means files will be held in RAM (memory) as a Buffer, rather than saved to the hard drive.
// This is exactly what we need before passing the file up to ImageKit.
const storage = multer.memoryStorage();

// Initialize the upload middleware with this storage setting
const upload = multer({ storage: storage });

module.exports = upload;