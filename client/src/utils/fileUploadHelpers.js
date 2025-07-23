// File Upload Helper Functions
import { supabase } from '../config/supabase';

/**
 * Upload file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucketName - The storage bucket name
 * @param {string} folder - Optional folder path
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadFile = async (file, bucketName, folder = '') => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} bucketName - The storage bucket name
 * @param {string} filePath - The file path to delete
 * @returns {Promise<boolean>}
 */
export const deleteFile = async (bucketName, filePath) => {
  try {
    if (!filePath) return true;

    // Extract just the filename from URL if full URL is provided
    const pathOnly = filePath.includes('/') ? filePath.split('/').pop() : filePath;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([pathOnly]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * Get file info from Supabase Storage
 * @param {string} bucketName - The storage bucket name
 * @param {string} filePath - The file path
 * @returns {Promise<Object>}
 */
export const getFileInfo = async (bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        search: filePath
      });

    if (error) {
      throw error;
    }

    return data[0] || null;
  } catch (error) {
    console.error('Get file info error:', error);
    return null;
  }
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {boolean}
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSizeBytes = 5 * 1024 * 1024, // 5MB default
    minSizeBytes = 0
  } = options;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
  }

  if (file.size < minSizeBytes) {
    const minSizeMB = (minSizeBytes / (1024 * 1024)).toFixed(1);
    throw new Error(`File too small. Minimum size: ${minSizeMB}MB`);
  }

  return true;
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string}
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Check if file is an image
 * @param {File} file - The file to check
 * @returns {boolean}
 */
export const isImageFile = (file) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return imageTypes.includes(file.type);
};