import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

// Configure Cloudinary
if (config.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: 'image' | 'video';
  width?: number;
  height?: number;
  format: string;
  size: number;
}

/**
 * Upload a file to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.cloudinary.uploadPreset || 'hawa_social_hub');
  formData.append('folder', 'hawa_social_hub');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload to Cloudinary');
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    width: data.width,
    height: data.height,
    format: data.format,
    size: data.bytes,
  };
}

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultipleToCloudinary(files: File[]): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Cloudinary (requires signed API)
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}
