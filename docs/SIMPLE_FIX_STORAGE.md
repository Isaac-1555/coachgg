# Simple Fix for Storage Errors

## Step 1: Delete All Existing Storage Policies

1. Go to Supabase Dashboard → Storage → Policies
2. Delete ALL existing policies for all buckets (avatars, team-logos, match-screenshots)
3. Make sure no policies exist

## Step 2: Create Simple Policies

Go to Supabase Dashboard → SQL Editor and run this:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow all authenticated users to do everything
CREATE POLICY "Allow all for authenticated users" ON storage.objects
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO anon
USING (true);
```

## Step 3: Fix user_settings Table

Run this in Supabase SQL Editor:

```sql
-- Drop existing table if it has issues
DROP TABLE IF EXISTS user_settings;

-- Create fresh user_settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferred_ai_model TEXT DEFAULT 'tngtech/deepseek-r1t2-chimera:free',
  feedback_style TEXT DEFAULT 'balanced',
  analysis_frequency TEXT DEFAULT 'manual',
  profile_visibility TEXT DEFAULT 'team_members',
  share_match_data BOOLEAN DEFAULT true,
  allow_ai_analysis BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Simple policy for user_settings
CREATE POLICY "Users can manage own settings" ON user_settings
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Step 4: Make Sure Buckets Are Public

1. Go to Storage → Settings
2. For each bucket (avatars, team-logos, match-screenshots):
   - Click the bucket name
   - Make sure "Public bucket" is ON
   - Save settings

## Step 5: Test Upload

1. Refresh your browser completely (Ctrl+F5)
2. Try uploading an avatar
3. Check console for errors

This should fix all the RLS policy issues with very permissive rules.