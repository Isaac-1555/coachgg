-- Fix for infinite recursion in team_members RLS policies
-- Run this SQL in your Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view teams they belong to" ON public.teams;
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team calendar events" ON public.calendar_events;

-- Create simpler, non-recursive policies

-- Teams: Users can view teams where they are captain OR member
CREATE POLICY "Users can view their teams" ON public.teams
    FOR SELECT USING (
        captain_id = auth.uid() OR 
        id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Team Members: Allow users to view team members of teams they belong to
-- Use a simpler approach to avoid recursion
CREATE POLICY "Users can view team members" ON public.team_members
    FOR SELECT USING (
        -- User can see their own membership
        user_id = auth.uid() OR
        -- User can see members of teams they captain
        team_id IN (
            SELECT id FROM public.teams 
            WHERE captain_id = auth.uid()
        ) OR
        -- User can see members of teams where they are also a member
        EXISTS (
            SELECT 1 FROM public.team_members tm2 
            WHERE tm2.team_id = team_members.team_id 
            AND tm2.user_id = auth.uid()
        )
    );

-- Allow users to insert themselves into teams (for joining)
CREATE POLICY "Users can join teams" ON public.team_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to remove themselves from teams (for leaving)
CREATE POLICY "Users can leave teams" ON public.team_members
    FOR DELETE USING (user_id = auth.uid());

-- Allow team captains to remove members
CREATE POLICY "Captains can remove members" ON public.team_members
    FOR DELETE USING (
        team_id IN (
            SELECT id FROM public.teams 
            WHERE captain_id = auth.uid()
        )
    );

-- Calendar Events: Users can view events for teams they belong to
CREATE POLICY "Users can view team calendar events" ON public.calendar_events
    FOR SELECT USING (
        manager_id = auth.uid() OR
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Allow managers to create events for their teams
CREATE POLICY "Managers can create events" ON public.calendar_events
    FOR INSERT WITH CHECK (manager_id = auth.uid());

-- Allow managers to update their events
CREATE POLICY "Managers can update events" ON public.calendar_events
    FOR UPDATE USING (manager_id = auth.uid());

-- Allow managers to delete their events
CREATE POLICY "Managers can delete events" ON public.calendar_events
    FOR DELETE USING (manager_id = auth.uid());