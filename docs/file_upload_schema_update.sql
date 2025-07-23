-- File Upload Schema Updates for CoachGG
-- Add file upload related columns to existing tables

-- Add logo_url to teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add screenshot_url to matches table  
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- Update teams table comment
COMMENT ON COLUMN teams.logo_url IS 'URL to team logo image stored in Supabase Storage';

-- Update matches table comment
COMMENT ON COLUMN matches.screenshot_url IS 'URL to match screenshot stored in Supabase Storage';

-- Create storage policies for Supabase Storage buckets
-- Note: These policies should be created in the Supabase dashboard or via SQL editor

-- Avatars bucket policies
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Team logos bucket policies  
-- INSERT INTO storage.buckets (id, name, public) VALUES ('team-logos', 'team-logos', true);

-- Match screenshots bucket policies
-- INSERT INTO storage.buckets (id, name, public) VALUES ('match-screenshots', 'match-screenshots', true);

-- RLS Policies for storage buckets (to be created in Supabase dashboard):

-- Avatars bucket policies:
-- 1. Allow authenticated users to upload their own avatars
-- 2. Allow public read access to all avatars
-- 3. Allow users to delete their own avatars

-- Team logos bucket policies:
-- 1. Allow team captains to upload team logos
-- 2. Allow public read access to all team logos  
-- 3. Allow team captains to delete their team logos

-- Match screenshots bucket policies:
-- 1. Allow authenticated users to upload match screenshots
-- 2. Allow team members to view team match screenshots
-- 3. Allow users to delete their own match screenshots

-- Example RLS policies (create these in Supabase dashboard):
/*
-- Avatars - Allow users to upload
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Avatars - Allow public read
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Avatars - Allow users to delete their own
CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Team logos - Allow team captains to upload
CREATE POLICY "Team captains can upload logos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'team-logos' AND auth.uid() IN (
  SELECT captain_id FROM teams WHERE id::text = (storage.foldername(name))[1]
));

-- Team logos - Allow public read
CREATE POLICY "Public can view team logos" ON storage.objects
FOR SELECT USING (bucket_id = 'team-logos');

-- Match screenshots - Allow users to upload
CREATE POLICY "Users can upload match screenshots" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'match-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Match screenshots - Allow team members to view
CREATE POLICY "Team members can view match screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'match-screenshots');
*/