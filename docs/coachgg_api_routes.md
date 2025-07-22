# 🔌 CoachGG – REST API Routes

This API design supports frontend calls for users, teams, stats, and AI coach functionality.

## 🔐 Auth

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| POST   | `/auth/register`   | Register new user         |
| POST   | `/auth/login`      | Login and get JWT         |
| GET    | `/auth/me`         | Get current user profile  |
| POST   | `/auth/logout`     | Logout user               |

---

## 👤 Users

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/users/:id`     | Get user by ID            |
| PUT    | `/users/:id`     | Update user profile       |

---

## 👥 Teams

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/teams`            | Create a new team            |
| GET    | `/teams/:id`        | Get team by ID               |
| PUT    | `/teams/:id`        | Update team info             |
| DELETE | `/teams/:id`        | Delete a team                |

---

## 👤 Team Members

| Method | Endpoint                      | Description                      |
|--------|-------------------------------|----------------------------------|
| POST   | `/teams/:id/members`          | Invite/add user to team          |
| DELETE | `/teams/:id/members/:userId`  | Remove user from team            |

---

## 🎮 Games

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | `/games`         | List all games        |
| POST   | `/games`         | Add custom game       |

---

## 📝 Matches

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/matches`         | Submit match + stats            |
| GET    | `/matches`         | Get all matches (user scoped)   |
| GET    | `/matches/:id`     | Get single match                |
| PUT    | `/matches/:id`     | Edit match                      |
| DELETE | `/matches/:id`     | Delete match                    |

---

## 📊 Stats + AI Coach

| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| GET    | `/stats/overview`        | Get user summary stats          |
| GET    | `/stats/game/:gameId`    | Stats breakdown per game        |
| GET    | `/coach/feedback`        | AI-generated suggestions        |

---

## 🏆 Achievements

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | `/achievements`       | Get all achievements           |
| POST   | `/achievements`       | Add new achievement            |

---

## 🗓️ Calendar

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/calendar`         | Get events for user/team     |
| POST   | `/calendar`         | Create event                 |
| PUT    | `/calendar/:id`     | Update event                 |
| DELETE | `/calendar/:id`     | Delete event                 |