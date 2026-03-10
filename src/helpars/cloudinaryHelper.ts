import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const cloudinaryHelper = {
  cloudinary,
  deleteFromCloudinary
};