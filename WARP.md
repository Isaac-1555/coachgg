# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CoachGG is a full-stack esports development platform for competitive gamers, team managers, and coaches. It provides solo performance tracking, team management, AI-powered coaching, and comprehensive analytics for multiple games (Valorant, League of Legends, Dota 2, CS2, etc.).

**Tech Stack:**
- **Frontend:** React 19 + Vite, Mantine UI, Chart.js, Tabler Icons
- **Backend:** Node.js + Express
- **Database:** PostgreSQL via Supabase (with Row Level Security)
- **Auth:** Supabase Auth with JWT tokens
- **Deployment:** Vercel (frontend + serverless functions) + Supabase (backend services)

## Project Structure

```
coachgg/
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── tabs/     # Main dashboard tabs (Overview, SoloTracker, TeamManagement, etc.)
│   │   │   ├── charts/   # Chart.js visualization components
│   │   │   ├── modals/   # Modal dialogs (AddMatch, CreateTeam, etc.)
│   │   │   └── icons/    # Custom icon components
│   │   ├── contexts/     # React Context providers (AuthContext)
│   │   ├── services/     # Business logic (achievementService)
│   │   ├── utils/        # Helper functions (fileUpload, chartExport, profileExport)
│   │   ├── config/       # Configuration (supabase, openrouter)
│   │   └── styles/       # CSS stylesheets
│   └── public/           # Static assets
├── server/               # Node.js backend
│   └── src/
│       ├── routes/       # Express routes (auth, storage)
│       ├── config/       # Server configuration (supabase admin client)
│       └── middleware/   # Express middleware
└── docs/                 # Project documentation
```

## Development Commands

### Running the Application

```bash
# Install all dependencies (run from root)
npm install
cd client && npm install
cd ../server && npm install

# Start both client and server (from root)
npm run dev

# Start client only (from root)
npm run client

# Start server only (from root)
npm run server

# Or run individually:
cd client && npm run dev     # Client runs on http://localhost:5173
cd server && npm run dev     # Server runs on http://localhost:3001
```

### Building and Deployment

```bash
# Build client for production (from root)
npm run build

# Build client (from client directory)
cd client && npm run build

# Preview production build
cd client && npm run preview

# Deploy to Vercel (from root)
vercel --prod
```

### Code Quality

```bash
# Lint client code
cd client && npm run lint

# Fix linting issues automatically
cd client && npm run lint -- --fix
```

### Testing

```bash
# Test Supabase connection
cd server && npm run test-supabase
```

## Core Architecture Concepts

### Authentication Flow

1. **Client-side:** Uses Supabase client (`@supabase/supabase-js`) with anon key for auth operations
2. **AuthContext:** Global React context (`client/src/contexts/AuthContext.js`) manages user session state
3. **Server-side:** Uses Supabase admin client with service role key for privileged operations
4. **Row Level Security (RLS):** Database-level permissions ensure users can only access their own data

**Key files:**
- `client/src/contexts/AuthContext.js` - Authentication state management
- `client/src/config/supabase.js` - Client-side Supabase configuration
- `server/src/config/supabase.js` - Server-side Supabase admin client
- `server/src/routes/auth.js` - Authentication endpoints

### Database Schema

The application uses a PostgreSQL database via Supabase with the following main tables:
- **users** - User profiles (username, role, avatar)
- **teams** - Team information (name, captain_id)
- **team_members** - Many-to-many relationship between users and teams
- **matches** - Game matches with flexible JSONB stats field
- **achievements** - User achievement tracking
- **calendar_events** - Team scheduling and events
- **coaching_notes** - Manager/coach notes on players

**JSONB Stats Field:** The `matches.stats` column uses JSONB to support game-specific statistics flexibly. Each game can have different stats (kills, deaths, assists, GPM, etc.).

### Component Architecture

**Dashboard System:** The main dashboard uses a tabbed interface managed by `Dashboard.jsx`:
- Each tab is a separate component in `client/src/components/tabs/`
- Tabs: Overview, SoloTracker, TeamManagement, Calendar, ManagerDashboard, AICoach, AdvancedCharts, Settings
- Sidebar (`Sidebar.jsx`) controls navigation and displays user info

**Modal Pattern:** Modals for forms (AddMatch, CreateTeam, etc.) are in `client/src/components/modals/`
- Modals handle their own state and validation
- They receive callbacks to update parent components on success

**Chart Components:** All charts use Chart.js through `react-chartjs-2`
- Chart components are in `client/src/components/charts/`
- Support responsive design, zoom, and data export
- Use consistent theme colors from CSS variables

### State Management

- **Global Auth State:** React Context (`AuthContext`) for user authentication
- **Local Component State:** `useState` for component-specific state
- **Supabase Realtime:** Direct database subscriptions for live updates (optional/future)

### API Communication

**Client to Supabase:** Direct connection using Supabase client SDK
- Most operations (matches, teams, users) go directly to Supabase
- RLS policies enforce permissions at the database level

**Client to Server:** Custom API endpoints via Express for:
- File uploads (`/api/storage/upload`)
- Special authentication operations (`/api/auth/*`)

**Proxy Configuration:** In development, Vite proxies `/api/*` requests to `http://localhost:3001` (see `client/vite.config.js`)

### File Upload System

File uploads use Supabase Storage with custom helper functions:
- **Storage Buckets:** `avatars`, `team-logos`, `match-screenshots`
- **Upload Flow:** Client → Express endpoint → Supabase Storage
- **Helper:** `client/src/utils/fileUploadHelpers.js`
- **Server Route:** `server/src/routes/storage.js`

### Environment Variables

**Client (.env in client/):**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENROUTER_API_KEY=
```

**Server (.env in server/):**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
PORT=3001
NODE_ENV=development
```

## Working with Features

### Solo Tracker Feature
- **Component:** `client/src/components/tabs/SoloTracker.jsx`
- **Database:** Writes to `matches` table with `player_id` set to current user
- **Achievement Integration:** Automatically unlocks achievements via `achievementService.js`
- **Charts:** Win rate trends, performance over time, game distribution

### Team Management Feature
- **Components:** `client/src/components/tabs/TeamManagement.jsx`, `TeamDetails.jsx`
- **Database:** `teams`, `team_members`, `matches` (with `team_id`)
- **Permissions:** Only team captain can manage members, all members can view stats
- **Member Comparison:** Charts compare performance metrics across team members

### Manager Dashboard Feature
- **Component:** `client/src/components/tabs/ManagerDashboard.jsx`
- **Multi-Team Support:** Managers can oversee multiple teams
- **Analytics:** Coaching effectiveness, team comparison, member performance trends
- **Coaching Notes:** Managers can add private notes about players

### AI Coach Feature
- **Component:** `client/src/components/tabs/AICoach.jsx`
- **API:** OpenRouter API (supports multiple LLMs: Claude, GPT-4, etc.)
- **Config:** `client/src/config/openrouter.js`
- **Context:** Analyzes recent match data and provides personalized coaching advice

### Achievement System
- **Service:** `client/src/services/achievementService.js`
- **Component:** `client/src/components/AchievementManager.jsx`
- **Triggers:** Automatically checks and unlocks achievements after matches
- **Notifications:** Toast-style notifications for new achievements
- **Types:** Login streaks, games played, win streaks, performance milestones

### Calendar System
- **Component:** `client/src/components/tabs/Calendar.jsx`
- **Database:** `calendar_events` table
- **Event Types:** Practice, matches, meetings, strategy sessions
- **Team Context:** Events are scoped to specific teams
- **Date Handling:** Uses timezone-aware date parsing to prevent offset issues

## Development Guidelines

### Component File Extensions
All React components use `.jsx` extension (not `.js`) for clarity and build optimization. Vite is configured to handle both via `esbuild.loader` settings.

### Import Conventions
Always use explicit `.jsx` extensions in imports for components:
```javascript
import Dashboard from './components/Dashboard.jsx';
import Overview from './tabs/Overview.jsx';
```

### Styling Approach
- Custom CSS with CSS variables for theming (`client/src/styles/`)
- Dark theme with neon accents as primary design system
- Component-specific styles in matching CSS files
- Global styles in `index.css` and `main.css`

### Supabase Patterns

**Fetching Data:**
```javascript
const { data, error } = await supabase
  .from('matches')
  .select('*')
  .eq('player_id', userId)
  .order('match_date', { ascending: false });
```

**Inserting Data:**
```javascript
const { data, error } = await supabase
  .from('matches')
  .insert({
    game_id: gameId,
    player_id: userId,
    result: 'win',
    stats: { kills: 10, deaths: 5 }
  })
  .select();
```

**Real-time Subscriptions (Optional):**
```javascript
const subscription = supabase
  .channel('matches')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'matches' },
    (payload) => console.log('New match:', payload)
  )
  .subscribe();
```

### Error Handling
- Always check for `error` in Supabase responses
- Log errors to console in development
- Show user-friendly error messages in UI
- Production build removes `console.log` statements (see `vite.config.js`)

### Chart Configuration
Charts use consistent configuration from `client/src/components/charts/ChartControls.jsx`:
- Responsive: true
- Dark theme colors
- Zoom enabled (via `chartjs-plugin-zoom`)
- Export to image or PDF capabilities

## Common Tasks

### Adding a New Match Type
1. Update the game enum in database if needed
2. Modify `AddMatchModal.jsx` to include game-specific stats fields
3. Update achievement service to recognize new game achievements
4. Add game-specific charts if needed

### Adding a New Tab
1. Create component in `client/src/components/tabs/`
2. Import in `Dashboard.jsx`
3. Add case to `renderActiveTab()` switch statement
4. Add tab to Sidebar navigation

### Adding a New Achievement Type
1. Update `ACHIEVEMENT_DEFINITIONS` in `achievementService.js`
2. Add logic to `checkAchievements()` for new trigger conditions
3. Update UI to display new achievement type

### Debugging Auth Issues
1. Check browser console for auth errors
2. Verify environment variables are set correctly
3. Test Supabase connection: `cd server && npm run test-supabase`
4. Check RLS policies in Supabase dashboard
5. Verify JWT token in browser's Application/Storage tab

### Working on File Uploads
1. Ensure storage buckets exist in Supabase
2. Check bucket permissions (public vs private)
3. File size limits: Adjust in `fileUploadHelpers.js`
4. Supported formats: Defined in upload helper validation

## Deployment Notes

### Vercel Configuration
- **Build Command:** `npm run build` (defined in root `package.json`)
- **Output Directory:** `client/dist`
- **Serverless Functions:** `server/server.js` handled by `@vercel/node`
- **Routes:** Configured in `vercel.json` to route `/api/*` to server

### Environment Variables for Production
Set these in Vercel dashboard under Settings → Environment Variables:
- All `VITE_*` variables for client
- All server variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`)
- Ensure `NODE_ENV=production` is set

### CORS Configuration
Server CORS is configured to accept:
- Production: `https://*.vercel.app` domains
- Development: `http://localhost:5173` and `http://localhost:3000`

### Build Optimization
Vite build configuration includes:
- Code splitting by vendor (React, Chart.js, Supabase, etc.)
- Terser minification with console.log removal
- No source maps in production for security
- Chunk size limit: 1MB warning threshold

## Important Documentation

Key documentation files in `docs/` directory:
- `MVP_FEATURE_REPORT.md` - Complete feature list and implementation details
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Full deployment walkthrough
- `VERCEL_DEPLOYMENT_FIXES.md` - Known deployment issues and solutions
- `FUTURE_ROADMAP.md` - Planned enhancements and feature ideas
- `coachgg_database_schema.md` - Database schema documentation
- `database_setup_guide.md` - Step-by-step database setup


## Notes

- **No Test Suite:** Currently no automated tests configured (no Jest/Vitest)
- **AI Features:** Uses OpenRouter API which supports multiple LLM models (Claude, GPT-4, Llama, etc.)
- **Mobile Support:** Basic responsive design; full PWA implementation is on roadmap
- **Real-time Features:** Supabase Realtime available but not fully implemented yet
