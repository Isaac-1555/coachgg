# CoachGG - Project Context & Implementation Guide

## 📋 Project Overview

CoachGG is a web application designed to help aspiring professional esports gamers improve their skills through stat tracking, AI coaching, and team collaboration. The platform consolidates solo and team competitive gaming experiences into a single, gamified ecosystem.

## 🎯 Vision & Goals

**Vision Statement:** "CoachGG empowers gamers to grow from casual players to competitive pros by turning data into insight, and insight into action."

**Key Objectives:**
- Achieve 5K active users within 6 months
- Maintain 85%+ match form submission rate
- Reduce player performance variance by 10% using AI coach feedback

## 👥 Target User Personas

1. **Solo Player (Kyle)** - Late-night Valorant/LoL player wanting to improve KDA and win rate
2. **Team Captain (Zara)** - College Dota 2 team manager needing performance history and compatibility reports
3. **Manager/Coach (Alex)** - Runs training groups for regional tournaments, needs calendar and performance tracking

## 🏗️ Technical Architecture

### Current Project Structure
```
├── client/          # React frontend (Vite + React)
├── server/          # Node.js backend (Express)
├── docs/            # Documentation and UI reference
└── docs/coachgg-app/ # Next.js UI/UX reference implementation
```

### Tech Stack (MVP)
- **Frontend**: React + CSS (converting from TypeScript/Tailwind reference)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT + Bcrypt
- **AI Service**: OpenAI API integration
- **Charts**: Chart.js + react-chartjs-2

## 🎨 Design System

### Color Palette
- **Background**: `#0D0D0D` (Dark charcoal/black)
- **Card Backgrounds**: `#1A1A1A`
- **Neon Green**: `#39FF14` (Primary highlights, buttons, graphs)
- **Neon Purple**: `#9B30FF` (Secondary highlights)
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#AAAAAA`

### UI/UX Principles
- Discord-style left sidebar navigation
- Dark theme with neon accents
- Gamified interactions and achievements
- Responsive card-based layout
- Smooth transitions and hover effects

## 📊 Database Schema

### Core Tables
1. **users** - User profiles with authentication
2. **teams** - Team management
3. **team_members** - Many-to-many relationship
4. **games** - Supported games (Valorant, LoL, Dota 2, etc.)
5. **matches** - Match records with flexible JSON stats
6. **achievements** - Gamification system
7. **calendar_events** - Manager scheduling

### Key Relationships
- Users can belong to multiple teams
- Matches belong to users and optionally teams
- Flexible JSON stats field for game-specific data

## 🔌 API Routes Structure

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - Login with JWT
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Core Features
- **Users**: Profile management
- **Teams**: Team creation and management
- **Matches**: Match submission and tracking
- **Stats**: Performance analytics
- **AI Coach**: Feedback and suggestions
- **Achievements**: Gamification
- **Calendar**: Event management

## 🎮 Core Features

### 1. Overview Dashboard
- User profile summary
- Recent games and stats
- Achievement showcase
- AI coach insights

### 2. Solo Tracker
- Manual match entry
- Performance trends (win %, KDA)
- Game-specific statistics
- Progress tracking

### 3. Team Management
- Team creation and invites
- Member performance overview
- AI compatibility scoring
- Team statistics

### 4. Manager Dashboard
- Multi-user tracking
- Coaching notes
- Event calendar
- Performance reports

### 5. AI Coach
- Real-time feedback
- Weakness detection
- Actionable suggestions
- Performance analysis

### 6. Gamification
- Achievement system
- Progress tracking
- Unlockable titles/badges
- Streak tracking

## 🎯 Implementation Requirements

### Frontend (React + CSS)
- Convert TypeScript components to JavaScript
- Replace Tailwind with custom CSS using design system variables
- Implement responsive layouts
- Create reusable UI components
- Connect to backend APIs

### Backend (Node.js + Express)
- Implement authentication system
- Create database models and migrations
- Build RESTful API endpoints
- Integrate AI coaching service
- Handle file uploads and data validation

### Database (PostgreSQL)
- Set up database schema
- Create migration scripts
- Implement data relationships
- Add indexes for performance

## 📁 Reference Implementation

The `docs/coachgg-app/` folder contains a complete Next.js implementation with:
- TypeScript components (to be converted to JS)
- Tailwind CSS styling (to be converted to custom CSS)
- Complete UI/UX design
- Component structure and interactions
- **Note**: Contains dummy data - needs to be replaced with empty states and real API connections

## 🚀 Development Phases

1. **Phase 1**: Project setup and authentication
2. **Phase 2**: Core UI components and routing
3. **Phase 3**: Database integration and API development
4. **Phase 4**: Feature implementation (Solo, Team, Manager)
5. **Phase 5**: AI coach integration
6. **Phase 6**: Testing and deployment

## ⚠️ Important Notes

- Use `.js` files and `.css` for styling (no TypeScript/Tailwind)
- Remove all dummy data from reference implementation
- Create empty states for all features
- Ensure proper database connectivity
- Implement real authentication flow
- Focus on creating a working MVP with actual data flow

## 🔧 Current Status

- Basic project structure exists
- Client has React setup with Vite
- Server has Express basic setup
- Reference UI/UX implementation available
- Database schema documented
- API routes planned

## 📝 Next Steps

1. Set up database connection and models
2. Convert TypeScript components to JavaScript
3. Replace Tailwind with custom CSS
4. Implement authentication system
5. Create API endpoints
6. Connect frontend to backend
7. Remove dummy data and implement real data flow