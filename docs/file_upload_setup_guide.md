# 📁 File Upload Setup Guide

This guide explains how to set up and configure the file upload functionality in CoachGG.

## 🎯 Overview

The file upload system supports:
- **Profile Avatars** (2MB max) - User profile pictures
- **Team Logos** (1MB max) - Team branding images  
- **Match Screenshots** (5MB max) - Game screenshots for match records

## 🏗️ Architecture

### Frontend Components
- `FileUpload.js` - Reusable upload component with drag & drop
- `fileUploadHelpers.js` - Utility functions for file operations
- Integrated into Settings, CreateTeamModal, and AddMatchModal

### Backend
- `storage.js` - Express routes for file management
- Supabase Storage integration with bucket management
- File validation and security policies

### Database
- Added `logo_url` to teams table
- Added `screenshot_url` to matches table
- Existing `profile_avatar` field in users table

## 🔧 Setup Instructions

### 1. Database Schema Update

Run the SQL script to add new columns:

```bash
# Apply the schema update
psql -d your_database < docs/file_upload_schema_update.sql
```

### 2. Supabase Storage Configuration

#### Create Storage Buckets

In your Supabase dashboard, go to Storage and create these buckets:

1. **avatars**
   - Public: Yes
   - File size limit: 2MB
   - Allowed types: image/jpeg, image/png, image/gif, image/webp

2. **team-logos** 
   - Public: Yes
   - File size limit: 1MB
   - Allowed types: image/jpeg, image/png, image/gif, image/webp

3. **match-screenshots**
   - Public: Yes  
   - File size limit: 5MB
   - Allowed types: image/jpeg, image/png, image/gif, image/webp

#### Set Up RLS Policies

Create these Row Level Security policies in the Supabase SQL editor:

```sql
-- Avatars bucket policies
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Team logos bucket policies
CREATE POLICY "Team captains can upload logos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'team-logos' AND auth.uid() IN (
  SELECT captain_id FROM teams WHERE id::text = (storage.foldername(name))[1]
));

CREATE POLICY "Public can view team logos" ON storage.objects
FOR SELECT USING (bucket_id = 'team-logos');

-- Match screenshots bucket policies
CREATE POLICY "Users can upload match screenshots" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'match-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Team members can view match screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'match-screenshots');
```

### 3. Environment Variables

Update your environment files:

#### server/.env
```env
# Add these Supabase variables
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### client/.env
```env
# These should already exist
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

### 4. Install Dependencies

No additional dependencies needed - uses existing Supabase client.

## 🎮 Usage

### Profile Avatar Upload
1. Go to Settings tab
2. Click on avatar upload area
3. Select image file or drag & drop
4. Image uploads automatically and updates profile

### Team Logo Upload  
1. Create new team modal
2. Upload team logo (optional)
3. Logo saves with team creation

### Match Screenshot Upload
1. Add new match modal
2. Upload screenshot (optional) 
3. Screenshot saves with match record

## 🔒 Security Features

- **File Type Validation** - Only image files allowed
- **Size Limits** - Different limits per upload type
- **User Authentication** - Must be logged in to upload
- **RLS Policies** - Database-level access control
- **Unique Filenames** - Prevents conflicts and overwrites

## 🎨 UI Features

- **Drag & Drop** - Modern file upload experience
- **Image Preview** - Shows current image with change/remove options
- **Progress Indicators** - Loading states during upload
- **Error Handling** - Clear error messages for users
- **Responsive Design** - Works on all screen sizes

## 🐛 Troubleshooting

### Upload Fails
1. Check Supabase credentials in environment variables
2. Verify storage buckets exist and are public
3. Check RLS policies are correctly configured
4. Ensure file meets size and type requirements

### Images Don't Display
1. Verify bucket is set to public
2. Check the public URL is correctly generated
3. Ensure CORS is configured in Supabase

### Permission Errors
1. Review RLS policies
2. Check user authentication status
3. Verify user has permission for the specific bucket

## 📊 File Size Limits

| Upload Type | Max Size | Recommended |
|-------------|----------|-------------|
| Profile Avatar | 2MB | 500KB |
| Team Logo | 1MB | 200KB |
| Match Screenshot | 5MB | 1-2MB |

## 🚀 Performance Tips

1. **Optimize Images** - Compress before upload for better performance
2. **Use WebP** - Modern format with better compression
3. **Lazy Loading** - Images load as needed in the UI
4. **CDN Caching** - Supabase provides automatic CDN caching

## 📈 Future Enhancements

- **Image Resizing** - Automatic thumbnail generation
- **Bulk Upload** - Multiple file selection
- **Progress Bars** - Detailed upload progress
- **Image Editing** - Basic crop/resize tools
- **File Management** - User file library interface