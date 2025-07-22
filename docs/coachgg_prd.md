# 📘 CoachGG – Product Requirements Document (PRD)

## 1. 🎯 Product Overview

CoachGG is a web app designed to help aspiring pro esports gamers improve their skills and habits through stat tracking, AI coaching, and team collaboration. It consolidates the solo and team competitive experience into a single, gamified ecosystem.

---

## 2. 🚀 Goals & Objectives

### Vision Statement:
“CoachGG empowers gamers to grow from casual players to competitive pros by turning data into insight, and insight into action.”

### OKRs:
- Achieve 5K active users within 6 months
- Maintain 85%+ match form submission rate
- Reduce player performance variance by 10% using AI coach feedback

---

## 3. 🔍 User Personas

### 🎮 Solo Player (Kyle)
- Plays late-night matches in Valorant and LoL
- Wants to improve KDA and win rate
- Uses AI coach for self-improvement

### 🧑‍🤝‍🧑 Team Captain (Zara)
- Manages a college Dota 2 team
- Needs performance history for each teammate
- Uses compatibility reports to pick lineups

### 🧢 Manager/Coach (Alex)
- Runs a group of players training for regional tournaments
- Needs calendar, performance logs, and manual stat input
- Tracks each player’s growth curve

---

## 4. 📐 Features

### 4.1 Overview
- User profile summary
- Recent games played
- Top stats and ranks
- Achievements dashboard

### 4.2 Solo Tracker
- Add games manually
- Record match stats
- View trends (win %, KDA)
- AI coach feedback

### 4.3 Team Management
- Create team + invite players
- View teammates’ stats
- AI compatibility scoring

### 4.4 Manager Dashboard
- Track multiple users
- Submit stats for them
- Add coaching notes
- Event calendar

### 4.5 AI Coach
- Real-time feedback based on stats
- Detects weak spots (e.g., "low GPM over 3 games")
- Gives actionable suggestions

### 4.6 Gamification
- Achievements for matches, login streaks
- Unlockable titles and badges
- Progress bar per skill

---

## 5. 💻 Tech Stack (MVP)

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: JWT + Bcrypt
- **AI Service**: OpenAI API (custom model wrapper)
- **Hosting**: Vercel (Frontend) + Railway or Render (Backend)

---

## 6. 🗂️ Data Model & APIs

See `coachgg_database_schema.md` and `coachgg_api_routes.md`

---

## 7. 🧪 Success Metrics

- 7-day retention > 50%
- Daily stats submission per user > 2
- AI feedback accepted/actioned rate > 30%

---

## 8. 📆 Timeline (3-Month MVP Plan)

| Week | Milestone                        |
|------|----------------------------------|
| 1–2  | Auth, layout, DB models          |
| 3–4  | Solo tab + match submission      |
| 5–6  | Team creation + team stats       |
| 7–8  | Manager tab + calendar           |
| 9–10 | AI coach integration             |
| 11–12| QA + Launch + Marketing Prep     |

---

## 9. 🔐 Security & Privacy

- Encrypted password storage (bcrypt)
- Role-based access control
- Optional anonymized data for AI analysis