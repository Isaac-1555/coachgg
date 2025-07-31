import React, { useState, useRef } from 'react';
import { supabase } from '../config/supabase';
import '../styles/FileUpload.css';

const FileUpload = ({ 
  onUploadComplete, 
  onUploadError, 
  currentImageUrl = null,
  bucketName = 'avatars',
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  className = '',
  placeholder = 'Upload Image'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    if (file.size > maxSizeBytes) {
      const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
    }
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      
      // Validate file
      validateFile(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase storage error:', error);
        throw new Error(error.message || 'Failed to upload file');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Call success callback
      if (onUploadComplete) {
        onUploadComplete(publicUrl, filePath);
      }

      return { publicUrl, filePath };
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || error?.error?.message || 'Upload failed';
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    try {
      await uploadFile(file);
    } catch (error) {
      // Error already handled in uploadFile
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = async () => {
    if (onUploadComplete) {
      onUploadComplete(null, null);
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {currentImageUrl ? (
          <div className="current-image">
            <img src={currentImageUrl} alt="Current" className="preview-image" />
            <div className="image-overlay">
              <button 
                type="button"
                className="change-button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Change'}
              </button>
              <button 
                type="button"
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            {uploading ? (
              <div className="upload-progress">
                <div className="spinner"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  <strong>{placeholder}</strong>
                  <small>Drag & drop or click to select</small>
                  <small>Max size: {(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB</small>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;