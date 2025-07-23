# Fix Storage Using Supabase Dashboard Only

## Step 1: Fix user_settings Table First

Go to Supabase Dashboard → SQL Editor and run:

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

## Step 2: Fix Storage Policies Using Dashboard

### Delete Existing Policies:
1. Go to **Storage** → **Policies**
2. Delete ALL existing policies for all buckets
3. Make sure the policy list is empty

### Create New Policies Using Dashboard UI:

**For `avatars` bucket:**

1. Click "New Policy"
2. Select "For full customization"
3. Fill in:
   - **Policy name:** `Allow authenticated uploads`
   - **Allowed operation:** `INSERT`
   - **Target roles:** `authenticated`
   - **USING expression:** `true`
   - **WITH CHECK expression:** `bucket_id = 'avatars'`
4. Click "Review" then "Save policy"

5. Click "New Policy" again
6. Fill in:
   - **Policy name:** `Allow public downloads`
   - **Allowed operation:** `SELECT`
   - **Target roles:** `public`
   - **USING expression:** `bucket_id = 'avatars'`
7. Click "Review" then "Save policy"

8. Click "New Policy" again
9. Fill in:
   - **Policy name:** `Allow delete own files`
   - **Allowed operation:** `DELETE`
   - **Target roles:** `authenticated`
   - **USING expression:** `bucket_id = 'avatars'`
10. Click "Review" then "Save policy"

**For `team-logos` bucket:**

Repeat the same 3 policies but change `bucket_id = 'avatars'` to `bucket_id = 'team-logos'`

**For `match-screenshots` bucket:**

Repeat the same 3 policies but change `bucket_id = 'avatars'` to `bucket_id = 'match-screenshots'`

## Step 3: Make Sure Buckets Are Public

1. Go to **Storage** → **Settings**
2. For each bucket:
   - Click the bucket name
   - Toggle "Public bucket" to **ON**
   - Click "Save"

## Step 4: Test

1. Refresh browser completely (Ctrl+F5)
2. Try uploading an avatar in Settings
3. Check console for errors

If you still get errors, the issue might be with authentication - make sure you're properly logged in.