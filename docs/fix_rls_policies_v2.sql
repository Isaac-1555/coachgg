-- Complete fix for RLS infinite recursion
-- Run this SQL in your Supabase SQL Editor

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view teams they belong to" ON public.teams;
DROP POLICY IF EXISTS "Captains can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON public.team_members;
DROP POLICY IF EXISTS "Captains can remove members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can insert own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can view team calendar events" ON public.calendar_events;
DROP POLICY IF EXISTS "Managers can create events" ON public.calendar_events;
DROP POLICY IF EXISTS "Managers can update events" ON public.calendar_events;
DROP POLICY IF EXISTS "Managers can delete events" ON public.calendar_events;
DROP POLICY IF EXISTS "Games are publicly readable" ON public.games;

-- Disable RLS temporarily to avoid conflicts
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.games DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies

-- Users table - basic profile access
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Teams table - only captains can see their teams initially
CREATE POLICY "Captains can view their teams" ON public.teams
    FOR SELECT USING (captain_id = auth.uid());

CREATE POLICY "Captains can update their teams" ON public.teams
    FOR UPDATE USING (captain_id = auth.uid());

CREATE POLICY "Users can create teams" ON public.teams
    FOR INSERT WITH CHECK (captain_id = auth.uid());

-- Team members table - simple access rules
CREATE POLICY "Users can view their own memberships" ON public.team_members
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Captains can view their team members" ON public.team_members
    FOR SELECT USING (
        team_id IN (
            SELECT id FROM public.teams WHERE captain_id = auth.uid()
        )
    );

CREATE POLICY "Users can join teams" ON public.team_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave teams" ON public.team_members
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Captains can remove members" ON public.team_members
    FOR DELETE USING (
        team_id IN (
            SELECT id FROM public.teams WHERE captain_id = auth.uid()
        )
    );

-- Matches table
CREATE POLICY "Users can view own matches" ON public.matches
    FOR SELECT USING (player_id = auth.uid());

CREATE POLICY "Users can insert own matches" ON public.matches
    FOR INSERT WITH CHECK (player_id = auth.uid() AND created_by = auth.uid());

CREATE POLICY "Users can update own matches" ON public.matches
    FOR UPDATE USING (player_id = auth.uid());

CREATE POLICY "Users can delete own matches" ON public.matches
    FOR DELETE USING (player_id = auth.uid());

-- Achievements table
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create achievements" ON public.achievements
    FOR INSERT WITH CHECK (true);

-- Calendar events table
CREATE POLICY "Managers can manage their events" ON public.calendar_events
    FOR ALL USING (manager_id = auth.uid());

-- Games table - publicly readable
CREATE POLICY "Games are publicly readable" ON public.games
    FOR SELECT USING (true);

-- Create a function to check team membership (for app-level use)
CREATE OR REPLACE FUNCTION public.is_team_member(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = team_uuid AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user teams (for app-level use)
CREATE OR REPLACE FUNCTION public.get_user_teams(user_uuid UUID)
RETURNS TABLE(team_id UUID, team_name TEXT, is_captain BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as team_id,
        t.name as team_name,
        (t.captain_id = user_uuid) as is_captain
    FROM public.teams t
    WHERE t.captain_id = user_uuid
    UNION
    SELECT 
        t.id as team_id,
        t.name as team_name,
        false as is_captain
    FROM public.teams t
    JOIN public.team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = user_uuid AND t.captain_id != user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;