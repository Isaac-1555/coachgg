# 🧱 CoachGG – Backend Model Relationships

This defines how each entity connects to others in the CoachGG platform, supporting solo and team-based esports players.

## Entity Diagram (Simplified)

```
User ─────────┐
              └─────┐
                    ▼
               TeamMember ─────┐
                               ▼
Game ────────▶ Match ◀────────┘
               ▲
               │
        Achievement
               │
         CalendarEvent
```

---

## Models

### `User`
- Has many `TeamMember`
- Has many `Matches`
- Has many `Achievements`
- Can be a `Manager` (for CalendarEvents)

---

### `Team`
- Has many `TeamMembers`
- Has many `Matches` (optional if used in team)

---

### `TeamMember`
- Belongs to `User`
- Belongs to `Team`

---

### `Game`
- Has many `Matches`

---

### `Match`
- Belongs to `Game`
- Belongs to `User`
- Optional: Belongs to `Team`
- Includes flexible `stats` JSON

---

### `Achievement`
- Belongs to `User`

---

### `CalendarEvent`
- Belongs to `User` (Manager)
- Optional: Belongs to `Team`