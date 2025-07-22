# 🎨 CoachGG – UI/UX Design Specification

## 🧠 Visual Style

- **Theme**: Gamer-themed but clean and minimal
- **Tone**: Professional + energetic
- **UX Goal**: Help users stay focused, track progress, and improve quickly

---

## 🌈 Color Palette

| Element           | Color Code     | Description                   |
|------------------|----------------|-------------------------------|
| Background        | `#0D0D0D`      | Dark charcoal/black           |
| Neon Green        | `#39FF14`      | Highlights, buttons, graphs   |
| Neon Purple       | `#9B30FF`      | Secondary highlights           |
| Primary Text      | `#FFFFFF`      | Main content text             |
| Secondary Text    | `#AAAAAA`      | Hints, labels                 |
| Card Backgrounds  | `#1A1A1A`      | Stat cards, match data boxes  |

---

## 🧭 Layout Structure

- **Left Sidebar (Discord-style)**:
  - Vertical tabs: Overview, Solo, Team, Manager, Settings, Profile
  - Icons + label on hover
  - Glow effect on active tab (green or purple)

- **Main Content Area**:
  - Responsive grid layout
  - Cards with shadows and rounded corners (`rounded-2xl`)
  - Graphs for stats, match tables, AI coach section
  - Floating “+ Add Match” buttons with neon glow

---

## 🧩 Components & Effects

- **Stat Cards**: Quick display of win %, KDA, GPM
- **Graph Module**: Line and bar charts for time series
- **Modal Forms**: Add match/game/stats via full-width modals or drawers
- **AI Coach Chat**: Message bubble layout + real-time suggestions
- **Calendar**: Grid + timeline style with color-coded events

---

## 🚀 Logo

- **Type**: Minimal icon-based logo, no text
- **Ideas**:
  - Abstract “GG” shape
  - Crown with controller outline
  - Crosshair blended with digital frame

---

## ✅ Interaction Principles

- Hover transitions on all clickable elements
- Smooth page transitions
- Gamified UI animations for achievement unlocks
- Light loading animations between tab switches