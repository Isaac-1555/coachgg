# 📍 Emoji Locations & Mantine UI Replacement Guide

This document catalogs all emoji usage throughout the CoachGG codebase and provides Mantine UI icon replacements.

## 🎯 Overview

**Total Files with Emojis**: 32 files
**Categories**: Navigation, UI Elements, Achievements, Charts, Modals, Services

## 📋 Emoji Usage by Category

### 1. Navigation & Core UI

#### Sidebar (✅ Already Fixed)
- **File**: `client/src/components/Sidebar.js`
- **Status**: ✅ Converted to Mantine icons

#### Main Tabs Headers

**File**: `client/src/components/tabs/AICoach.js`
- Line 193: `<h1>🤖 AI Coach</h1>`
- Line 241: `📊 Overview Analysis`
- Line 247: `📈 Trend Analysis`
- Line 253: `🎯 Goal Suggestions`
- Line 259: `🎮 Match Analysis`

**File**: `client/src/components/tabs/Settings.js`
- Line 140: `<h1>⚙️ Settings</h1>`
- Line 148: `<h2>👤 Profile Settings</h2>`
- Line 235: `<h2>🤖 AI Coach Configuration</h2>`

**File**: `client/src/components/tabs/Overview.js`
- Line 118: `<div className="stat-icon">🎮</div>`
- Line 128: `<div className="stat-icon">🏆</div>`
- Line 141: `<div className="stat-icon">📈</div>`
- Line 174: `<h3>🎮 Recent Matches</h3>`
- Line 180: `<div className="empty-icon">🎯</div>`
- Line 216: `<span>🤖</span>`

**File**: `client/src/components/tabs/SoloTracker.js`
- Line 244: `<div className="empty-icon">🎯</div>`

**File**: `client/src/components/tabs/ManagerDashboard.js`
- Line 386: `📊 Overview`

**File**: `client/src/components/tabs/TeamManagement.js`
- Various team-related emojis (need to check specific lines)

### 2. Stats & Cards Components

**File**: `client/src/components/StatsCards.js`
- Line 22: `<div className="stat-icon">🎮</div>`
- Line 32: `<div className="stat-icon">🏆</div>`
- Line 48: `<div className="stat-icon">📊</div>`

**File**: `client/src/components/TeamCard.js`
- Team-related emojis (need specific extraction)

**File**: `client/src/components/TeamDetails.js`
- Team management emojis

### 3. Chart Components (Empty States)

**File**: `client/src/components/charts/WinRateChart.js`
- Line 151: `<div className="empty-icon">📈</div>`

**File**: `client/src/components/charts/PerformanceChart.js`
- Line 174: `<div className="empty-icon">📊</div>`

**File**: `client/src/components/charts/GameDistributionChart.js`
- Line 114: `<div className="empty-icon">🎮</div>`

**File**: `client/src/components/charts/TeamWinRateChart.js`
- Line 151: `<div className="empty-icon">📈</div>`

**File**: `client/src/components/charts/TeamGameDistributionChart.js`
- Line 114: `<div className="empty-icon">🎮</div>`

**File**: `client/src/components/charts/CoachingEffectivenessChart.js`
- Line 191: `<div className="empty-icon">📊</div>`

**File**: `client/src/components/charts/PlayerPerformanceTrendChart.js`
- Line 167: `<div className="empty-icon">📈</div>`

### 4. Modal Components

**File**: `client/src/components/modals/AddNoteModal.js`
- Line 17: `{ value: 'improvement', label: 'Improvement', icon: '📈' }`
- Line 19: `{ value: 'achievement', label: 'Achievement', icon: '🏆' }`
- Line 20: `{ value: 'strategy', label: 'Strategy', icon: '🎯' }`
- Line 209: `📈 Improvement`
- Line 221: `🎯 Strategy`

**File**: `client/src/components/modals/CreateEventModal.js`
- Line 181: `🎮 Match`
- Line 195: `📊 Review`

**File**: `client/src/components/modals/AddMatchModal.js`
- Various match-related emojis

### 5. Achievement System

**File**: `client/src/services/achievementService.js`
- Line 10: `icon: '🎮'` (First Match)
- Line 18: `icon: '🏆'` (First Win)
- Line 34: `icon: '🤖'` (AI Analysis)
- Line 44: `icon: '📊'` (Data Driven)
- Line 52: `icon: '📈'` (Streak achievements)
- Line 104: `icon: '🎯'` (Win rate achievements)
- Line 112: `icon: '💎'` (High win rate)
- Line 120: `icon: '👑'` (Dominator)
- Line 130: `icon: '👑'` (Team Captain)
- Line 138: `icon: '🏅'` (Team Leader)
- Line 148: `icon: '🤝'` (Helpful Teammate)
- Line 158: `icon: '📈'` (Improving)
- Line 168: `icon: '🦉'` (Night Owl)
- Line 176: `icon: '🐦'` (Early Bird)

**File**: `client/src/components/AchievementDisplay.js`
- Line 55: `<h3>🏆 Achievements</h3>`
- Line 78: `<h3>🏆 Achievements</h3>`

**File**: `client/src/components/AchievementNotification.js`
- Achievement notification emojis

### 6. Other Components

**File**: `client/src/components/AuthForm.js`
- Line 114: `<span>🏆</span>`

**File**: `client/src/components/Calendar.js`
- Line 58: `if (lowerTitle.includes('match') || lowerTitle.includes('game')) return '🎮';`
- Line 60: `if (lowerTitle.includes('tournament')) return '🏆';`
- Line 61: `if (lowerTitle.includes('review')) return '📊';`

**File**: `client/src/components/CoachingNotes.js`
- Line 25: `case 'improvement': return '📈';`
- Line 27: `case 'achievement': return '🏆';`
- Line 28: `case 'strategy': return '🎯';`
- Line 80: `👤 {getPlayerName(note.player_id)}`

**File**: `client/src/components/FileUpload.js`
- Line 126: `<div className="upload-icon">📁</div>`

## 🔄 Mantine UI Icon Replacements

### Core Navigation Icons
| Emoji | Mantine Icon | Import |
|-------|--------------|--------|
| 🤖 | `IconRobot` | `@tabler/icons-react` |
| 📊 | `IconChartBar` | `@tabler/icons-react` |
| 📈 | `IconTrendingUp` | `@tabler/icons-react` |
| 🎯 | `IconTarget` | `@tabler/icons-react` |
| 🎮 | `IconDeviceGamepad2` | `@tabler/icons-react` |
| ⚙️ | `IconSettings` | `@tabler/icons-react` |
| 👤 | `IconUser` | `@tabler/icons-react` |
| 🏆 | `IconTrophy` | `@tabler/icons-react` |
| 👥 | `IconUsers` | `@tabler/icons-react` |
| 👑 | `IconCrown` | `@tabler/icons-react` |

### Achievement Icons
| Emoji | Mantine Icon | Import |
|-------|--------------|--------|
| 💎 | `IconDiamond` | `@tabler/icons-react` |
| 🏅 | `IconMedal` | `@tabler/icons-react` |
| 🤝 | `IconHandshake` | `@tabler/icons-react` |
| 🦉 | `IconMoon` | `@tabler/icons-react` |
| 🐦 | `IconSun` | `@tabler/icons-react` |

### UI Action Icons
| Emoji | Mantine Icon | Import |
|-------|--------------|--------|
| 📁 | `IconFolder` | `@tabler/icons-react` |
| 💾 | `IconDeviceFloppy` | `@tabler/icons-react` |
| ❌ | `IconX` | `@tabler/icons-react` |
| ✅ | `IconCheck` | `@tabler/icons-react` |
| 🔍 | `IconSearch` | `@tabler/icons-react` |
| 📅 | `IconCalendar` | `@tabler/icons-react` |

## 📝 Implementation Priority

### Phase 1: High Visibility (Immediate)
1. **Tab Headers** - AICoach, Settings, Overview
2. **Stats Cards** - Main dashboard metrics
3. **Achievement Display** - User-facing achievements

### Phase 2: Interactive Elements (Next)
1. **Modal Components** - AddNoteModal, CreateEventModal
2. **Chart Empty States** - All chart components
3. **Calendar Component** - Event type icons

### Phase 3: System Components (Later)
1. **Achievement Service** - Backend achievement definitions
2. **File Upload** - Upload placeholder icons
3. **Coaching Notes** - Note type indicators

## 🛠️ Implementation Template

### Basic Replacement Pattern
```javascript
// Before
<div className="icon">🎮</div>

// After
import { IconDeviceGamepad2 } from '@tabler/icons-react';
<div className="icon">
  <IconDeviceGamepad2 size={18} />
</div>
```

### Dynamic Icon Replacement
```javascript
// Before
const getIcon = (type) => {
  switch(type) {
    case 'match': return '🎮';
    case 'achievement': return '🏆';
    default: return '📊';
  }
};

// After
import { IconDeviceGamepad2, IconTrophy, IconChartBar } from '@tabler/icons-react';

const getIcon = (type, size = 18) => {
  switch(type) {
    case 'match': return <IconDeviceGamepad2 size={size} />;
    case 'achievement': return <IconTrophy size={size} />;
    default: return <IconChartBar size={size} />;
  }
};
```

### Achievement Service Pattern
```javascript
// Before
icon: '🎮'

// After
icon: 'IconDeviceGamepad2'

// Then in component:
import * as TablerIcons from '@tabler/icons-react';
const IconComponent = TablerIcons[achievement.icon];
<IconComponent size={24} />
```

## ✅ Completion Checklist

- [ ] Tab headers (AICoach, Settings, Overview)
- [ ] Stats cards components
- [ ] Chart empty states (11 files)
- [ ] Modal components (3 files)
- [ ] Achievement system (service + display)
- [ ] Calendar component
- [ ] Coaching notes
- [ ] File upload component
- [ ] Auth form
- [ ] Team components

## 📊 Statistics

- **Total Emoji Instances**: ~80+ occurrences
- **Files to Update**: 32 files
- **Icon Types Needed**: ~15 unique Mantine icons
- **Estimated Time**: 2-3 hours for complete replacement

## 🎯 Next Steps

1. Install additional Mantine icons if needed
2. Start with Phase 1 (high visibility components)
3. Test each component after replacement
4. Update achievement service to use icon names instead of emojis
5. Create reusable icon mapping utility for consistency