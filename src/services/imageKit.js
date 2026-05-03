const ImageKit = require('imagekit');
const config = require('../../config/config'); // Import our centralized config

// Initialize the ImageKit SDK.
// This allows us to upload files to ImageKit instead of storing them locally.
// We get these keys from our config file.
const imagekit = new ImageKit({
  publicKey: config.imageKit.publicKey,
  privateKey: config.imageKit.privateKey,
  urlEndpoint: config.imageKit.urlEndpoint,
})

module.exports = imagekit;