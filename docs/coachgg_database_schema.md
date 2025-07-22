# 📦 CoachGG – Database Schema

This schema supports stat tracking for solo and team-based esports players in CoachGG. It is structured around a team > player > match hierarchy but works for solo players by creating a default dummy team.

## 🧑‍💻 `users`

| Field          | Type          | Description                        |
|----------------|---------------|------------------------------------|
| id             | UUID          | Primary Key                        |
| username       | String        | Unique gamer tag                   |
| email          | String        | For authentication                 |
| password_hash  | String        | Secure hashed password             |
| profile_avatar | String        | URL to avatar                      |
| role           | Enum          | `player`, `manager`, `both`        |
| created_at     | Timestamp     | Account creation time              |

---

## 🛡️ `teams`

| Field       | Type          | Description                |
|-------------|---------------|----------------------------|
| id          | UUID          | Primary Key                |
| name        | String        | Team name                  |
| captain_id  | FK (users.id) | Team leader                |
| created_at  | Timestamp     | Team creation time         |

---

## 👥 `team_members`

| Field       | Type           | Description                |
|-------------|----------------|----------------------------|
| team_id     | FK (teams.id)  |                            |
| user_id     | FK (users.id)  |                            |
| nickname    | String         | Optional display name      |
| joined_at   | Timestamp      |                            |

---

## 🎮 `games`

| Field       | Type     | Description                             |
|-------------|----------|-----------------------------------------|
| id          | UUID     | Primary Key                             |
| name        | Enum     | `Smash Bros`, `Valorant`, `LoL`         |
| description | String   | Optional description                    |

---

## 📊 `matches`

| Field        | Type             | Description                              |
|--------------|------------------|------------------------------------------|
| id           | UUID             | Primary Key                              |
| game_id      | FK (games.id)    |                                          |
| team_id      | FK (teams.id)    | Nullable (solo users use dummy team)     |
| player_id    | FK (users.id)    |                                          |
| match_date   | DateTime         |                                          |
| result       | Enum             | `win`, `loss`, `draw`                    |
| stats        | JSONB            | Flexible key-value object                |
| created_by   | FK (users.id)    | Who submitted the match                  |
| created_at   | Timestamp        |                                          |

Example `stats` JSON:
```json
{
  "kills": 8,
  "deaths": 4,
  "assists": 5,
  "gpm": 450,
  "xpm": 600,
  "custom": {
    "net_worth": 12000,
    "items_bought": 15
  }
}
```

---

## 🏆 `achievements`

| Field        | Type           | Description                               |
|--------------|----------------|-------------------------------------------|
| id           | UUID           |                                           |
| user_id      | FK (users.id)  |                                           |
| type         | Enum           | `login_streak`, `games_played`, etc.     |
| description  | String         | Textual description of the achievement    |
| value        | Int            | Numeric threshold reached                 |
| created_at   | Timestamp      |                                           |

---

## 📅 `calendar_events`

| Field        | Type           | Description                             |
|--------------|----------------|-----------------------------------------|
| id           | UUID           |                                         |
| manager_id   | FK (users.id)  |                                         |
| team_id      | FK (teams.id)  | Optional                                |
| title        | String         | Event title                             |
| description  | Text           | Optional details                        |
| date         | DateTime       | Scheduled date                          |