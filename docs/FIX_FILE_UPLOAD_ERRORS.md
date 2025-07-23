# Fix File Upload Errors

## Problem 1: Storage Bucket RLS Policies Missing

The error "new row violates row-level security policy" means we need to set up storage policies.

### Fix: Create Storage Policies in Supabase

1. Go to Supabase Dashboard → Storage → Policies
2. Click "New Policy" for each bucket
3. Create these policies:

**For `avatars` bucket:**

Policy 1 - Allow Upload:
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

Policy 2 - Allow Public Read:
```sql
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

Policy 3 - Allow Delete Own Files:
```sql
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

**For `team-logos` bucket:**

Policy 1 - Allow Upload:
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'team-logos' AND auth.role() = 'authenticated');
```

Policy 2 - Allow Public Read:
```sql
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'team-logos');
```

**For `match-screenshots` bucket:**

Policy 1 - Allow Upload:
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'match-screenshots' AND auth.role() = 'authenticated');
```

Policy 2 - Allow Public Read:
```sql
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'match-screenshots');
```

## Problem 2: user_settings Table Missing

The 406 error on user_settings means the table doesn't exist.

### Fix: Create user_settings Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS user_settings (
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

-- Create RLS policy
CREATE POLICY "Users can manage own settings" ON user_settings
FOR ALL USING (auth.uid() = user_id);
```

## Problem 3: Storage Bucket Configuration

Make sure buckets are properly configured:

1. Go to Storage → Settings
2. For each bucket (`avatars`, `team-logos`, `match-screenshots`):
   - Set "Public" to ON
   - Set file size limits:
     - avatars: 2MB
     - team-logos: 1MB  
     - match-screenshots: 5MB

## Test After Fixes

1. Restart your application
2. Try uploading an avatar in Settings
3. Check browser console for any remaining errors

If you still get errors, check:
- User is properly authenticated
- Storage policies are created correctly
- Buckets are set to public