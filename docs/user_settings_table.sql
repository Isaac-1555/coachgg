-- Create user_settings table for storing user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    
    -- AI Coach Settings
    preferred_ai_model TEXT DEFAULT 'tngtech/deepseek-r1t2-chimera:free',
    feedback_style TEXT DEFAULT 'balanced' CHECK (feedback_style IN ('encouraging', 'balanced', 'direct', 'detailed')),
    analysis_frequency TEXT DEFAULT 'manual' CHECK (analysis_frequency IN ('manual', 'after_matches', 'daily', 'weekly')),
    
    -- Privacy Settings
    profile_visibility TEXT DEFAULT 'team_members' CHECK (profile_visibility IN ('public', 'team_members', 'private')),
    share_match_data BOOLEAN DEFAULT true,
    allow_ai_analysis BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one settings record per user
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON public.user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

-- Add bio column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;