require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload an image to Cloudinary
const uploadImage = async (imagePath) => {
    try {
      const result = await cloudinary.uploader.upload(imagePath);
      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
// Delete an image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    console.log('Deleting image with public ID:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deletion successful:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error.message);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage
};
