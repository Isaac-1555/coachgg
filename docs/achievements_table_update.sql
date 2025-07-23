-- Update achievements table structure for the new achievement system
-- Run this in your Supabase SQL Editor

-- First, check if the table exists and add missing columns
ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🏆',
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#39FF14';

-- Update the table structure to match our achievement service
-- The 'type' column should store the achievement ID
-- The 'description' column already exists
-- The 'value' column should store numeric values for progress

-- Create an index on the type column for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_type_user ON public.achievements(type, user_id);

-- Sample achievement data (optional - for testing)
-- You can run this to add some sample achievements for testing

/*
-- Insert sample achievements (uncomment to use)
INSERT INTO public.achievements (user_id, type, title, description, icon, color, value) VALUES
-- Replace 'your-user-id-here' with an actual user ID from your users table
('your-user-id-here', 'first_match', 'Welcome to the Arena', 'Play your first match', '🎮', '#39FF14', 1),
('your-user-id-here', 'first_win', 'First Victory', 'Win your first match', '🏆', '#FFD700', 1)
ON CONFLICT (user_id, type) DO NOTHING;
*/

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'achievements' AND table_schema = 'public'
ORDER BY ordinal_position;