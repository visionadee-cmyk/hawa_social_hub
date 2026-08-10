export interface UploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export const cloudinaryService = {
  async uploadBase64(base64Data: string): Promise<UploadResult> {
    // Extract the base64 data without the prefix
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image data');
    }

    const format = matches[1];
    const base64String = matches[2];

    // Use unsigned upload for demo mode (in production, use signed uploads)
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'hawa-social-hub/posts');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Cloudinary upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width || 800,
      height: result.height || 600,
      format: result.format || format,
      size: result.bytes || 0,
    };
  },

  async uploadImage(file: File): Promise<UploadResult> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'hawa-social-hub/posts');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Cloudinary upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width || 800,
      height: result.height || 600,
      format: result.format || 'jpg',
      size: result.bytes || 0,
    };
  },
};
