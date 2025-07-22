# Supabase Backend & Auth Setup Guide for CoachGG

## 📋 Prerequisites

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up for a free account
   - Create a new project

2. **Install Supabase CLI (Optional but Recommended)**
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

## 🗄️ Supabase Setup Steps

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit https://app.supabase.com
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - Name: `coachgg`
     - Database Password: Generate a strong password
     - Region: Choose closest to your users

2. **Wait for Project Setup** (usually 2-3 minutes)

### Step 2: Get Project Credentials

1. **Navigate to Project Settings**
   - Go to Settings → API
   - Copy the following values:
     - Project URL
     - Project API Key (anon/public)
     - Project API Key (service_role/secret)

2. **Get Database Connection Details**
   - Go to Settings → Database
   - Copy the connection string

### Step 3: Environment Configuration

Create/update your `.env` file in the server directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration (for direct connections if needed)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres

# Server Configuration
PORT=3001
NODE_ENV=development

# AI Service (for future use)
OPENAI_API_KEY=your_openai_key_here
```

## 🏗️ Supabase Client Setup

### Step 4: Install Required Dependencies

```bash
cd server
npm install @supabase/supabase-js
npm install --save-dev supabase  # for local development
```

```bash
cd client
npm install @supabase/supabase-js
```

### Step 5: Create Supabase Client (Server)

Create `server/src/config/supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Server-side client with service role key (full access)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection
async function testConnection() {
  try {
    // Simple test - just check if we can make any query
    const { error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    // No error = table exists and connection works
    if (!error || error.code === 'PGRST116') {
      console.log('✅ Connected to Supabase database');
    } else {
      console.error('❌ Supabase connection error:', error);
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
  }
}

testConnection();

module.exports = { supabaseAdmin };
```

### Step 6: Create Supabase Client (Frontend)

Create `client/src/config/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side client with anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ Database Schema Setup with Supabase

### Step 7: Create Database Tables via Supabase Dashboard

1. **Go to Supabase SQL Editor**
   - In your Supabase dashboard, go to SQL Editor
   - Create a new query

2. **Run the following SQL to create all tables:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    profile_avatar TEXT,
    role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('player', 'manager', 'both')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    captain_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create team_members junction table
CREATE TABLE public.team_members (
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nickname VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id)
);

-- Create games table
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create matches table
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    player_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_date TIMESTAMP NOT NULL,
    result VARCHAR(10) CHECK (result IN ('win', 'loss', 'draw')),
    stats JSONB,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    value INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create calendar_events table
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default games
INSERT INTO public.games (name, description) VALUES 
('Valorant', 'Tactical FPS by Riot Games'),
('League of Legends', 'MOBA by Riot Games'),
('Dota 2', 'MOBA by Valve'),
('Counter-Strike 2', 'FPS by Valve'),
('Overwatch 2', 'Hero shooter by Blizzard'),
('Rocket League', 'Vehicular soccer by Psyonix');

-- Create indexes for better performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_teams_captain ON public.teams(captain_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_matches_player ON public.matches(player_id);
CREATE INDEX idx_matches_game ON public.matches(game_id);
CREATE INDEX idx_matches_team ON public.matches(team_id);
CREATE INDEX idx_matches_date ON public.matches(match_date);
CREATE INDEX idx_achievements_user ON public.achievements(user_id);
CREATE INDEX idx_achievements_type ON public.achievements(type);
CREATE INDEX idx_calendar_manager ON public.calendar_events(manager_id);
CREATE INDEX idx_calendar_team ON public.calendar_events(team_id);
CREATE INDEX idx_calendar_date ON public.calendar_events(event_date);
```

### Step 8: Set Up Row Level Security (RLS)

Run this SQL to enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile and update it
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can view teams they're members of
CREATE POLICY "Users can view teams they belong to" ON public.teams
    FOR SELECT USING (
        id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Team captains can update their teams
CREATE POLICY "Captains can update their teams" ON public.teams
    FOR UPDATE USING (captain_id = auth.uid());

-- Users can view team members of teams they belong to
CREATE POLICY "Users can view team members" ON public.team_members
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can view their own matches
CREATE POLICY "Users can view own matches" ON public.matches
    FOR SELECT USING (player_id = auth.uid());

-- Users can insert their own matches
CREATE POLICY "Users can insert own matches" ON public.matches
    FOR INSERT WITH CHECK (player_id = auth.uid());

-- Users can update their own matches
CREATE POLICY "Users can update own matches" ON public.matches
    FOR UPDATE USING (player_id = auth.uid());

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (user_id = auth.uid());

-- Users can view calendar events for their teams
CREATE POLICY "Users can view team calendar events" ON public.calendar_events
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid()
        )
    );

-- Games table is publicly readable
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Games are publicly readable" ON public.games
    FOR SELECT USING (true);
```

### Step 9: Create Database Functions

Create helpful database functions:

```sql
-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, profile_avatar)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_matches', COUNT(*),
        'wins', COUNT(*) FILTER (WHERE result = 'win'),
        'losses', COUNT(*) FILTER (WHERE result = 'loss'),
        'win_rate', ROUND(
            (COUNT(*) FILTER (WHERE result = 'win')::FLOAT / 
             NULLIF(COUNT(*), 0) * 100), 2
        )
    )
    INTO result
    FROM public.matches
    WHERE player_id = user_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 10: Update Server Entry Point

Update `server/server.js` to include Supabase:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabaseAdmin } = require('./src/config/supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    // Simple connection test - try to query any table
    const { error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    if (!error || error.code === 'PGRST116') {
      console.log('✅ Supabase connected successfully');
    } else {
      console.error('❌ Supabase connection error:', error);
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
  }
}

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to CoachGG API!' });
});

app.get('/api/health', async (req, res) => {
  try {
    // Test connection with a simple query
    const { error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    const isConnected = !error || error.code === 'PGRST116';
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: isConnected ? 'Connected' : 'Error',
      supabase: 'Active'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Error', 
      timestamp: new Date().toISOString(),
      database: 'Failed'
    });
  }
});

// Start server
async function startServer() {
  await testSupabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
```

## 🧪 Testing the Setup

### Step 11: Test Supabase Connection

1. **Create test script** `server/test-supabase.js`:
```javascript
const { supabaseAdmin } = require('./src/config/supabase');

async function testSupabase() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection first
    const { error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    if (connectionError && connectionError.code !== 'PGRST116') {
      console.error('❌ Supabase connection failed:', connectionError);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError);
    } else {
      console.log(`✅ Auth working - ${authData.users.length} users found`);
    }
    
    // Check if our tables exist by trying to query them
    const expectedTables = ['users', 'teams', 'games', 'matches', 'achievements', 'calendar_events', 'team_members'];
    const existingTables = [];
    const missingTables = [];
    
    for (const table of expectedTables) {
      try {
        const { error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
        
        if (error && error.code === '42P01') {
          missingTables.push(table);
        } else {
          existingTables.push(table);
        }
      } catch (err) {
        missingTables.push(table);
      }
    }
    
    if (existingTables.length > 0) {
      console.log('✅ Existing tables:');
      existingTables.forEach(table => console.log(`  - ${table}`));
    }
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables (run the SQL scripts in Supabase dashboard):');
      missingTables.forEach(table => console.log(`  - ${table}`));
    } else {
      console.log('🎉 All required tables exist!');
      
      // Test games data if table exists
      const { data: games, error: gamesError } = await supabaseAdmin
        .from('games')
        .select('*');
      
      if (!gamesError && games.length > 0) {
        console.log('🎮 Games in database:');
        games.forEach(game => console.log(`  - ${game.name}: ${game.description}`));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSupabase();
```

2. **Run the test**:
```bash
cd server
node test-supabase.js
```

### Step 12: Update Package.json Scripts

Add to `server/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test-supabase": "node test-supabase.js"
  }
}
```

## 🎯 Quick Setup Commands

```bash
# 1. Create Supabase project at https://app.supabase.com

# 2. Navigate to server directory
cd server

# 3. Install dependencies
npm install @supabase/supabase-js

# 4. Navigate to client directory
cd ../client
npm install @supabase/supabase-js

# 5. Create .env files with your Supabase credentials
# server/.env and client/.env

# 6. Run SQL scripts in Supabase SQL Editor
# (Copy the SQL from Step 7 and 8)

# 7. Test Supabase connection
cd ../server
npm run test-supabase

# 8. Start development server
npm run dev
```

## 🔐 Authentication Benefits with Supabase

- **Built-in Auth**: Email/password, OAuth providers (Google, GitHub, etc.)
- **JWT Tokens**: Automatic token management
- **Row Level Security**: Database-level security policies
- **Real-time**: Built-in real-time subscriptions
- **Storage**: File uploads and management
- **Edge Functions**: Serverless functions

This setup provides a complete backend-as-a-service solution with authentication, database, and real-time features built-in!