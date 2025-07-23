import { supabase } from '../config/supabase';

// Achievement definitions with unlock conditions
export const ACHIEVEMENT_TYPES = {
  // First-time achievements
  FIRST_MATCH: {
    id: 'first_match',
    title: 'Welcome to the Arena',
    description: 'Play your first match',
    icon: '🎮',
    color: '#39FF14',
    condition: (stats) => stats.totalMatches >= 1
  },
  FIRST_WIN: {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first match',
    icon: '🏆',
    color: '#FFD700',
    condition: (stats) => stats.wins >= 1
  },
  FIRST_TEAM: {
    id: 'first_team',
    title: 'Team Player',
    description: 'Join your first team',
    icon: '👥',
    color: '#9B30FF',
    condition: (stats) => stats.teamsJoined >= 1
  },
  FIRST_AI_ANALYSIS: {
    id: 'first_ai_analysis',
    title: 'Seeking Wisdom',
    description: 'Use AI Coach for the first time',
    icon: '🤖',
    color: '#3BFFFF',
    condition: (stats) => stats.aiAnalysisUsed >= 1
  },

  // Match milestones
  MATCHES_10: {
    id: 'matches_10',
    title: 'Committed',
    description: 'Play 10 matches',
    icon: '📊',
    color: '#39FF14',
    condition: (stats) => stats.totalMatches >= 10
  },
  MATCHES_25: {
    id: 'matches_25',
    title: 'Dedicated',
    description: 'Play 25 matches',
    icon: '📈',
    color: '#39FF14',
    condition: (stats) => stats.totalMatches >= 25
  },
  MATCHES_50: {
    id: 'matches_50',
    title: 'Veteran',
    description: 'Play 50 matches',
    icon: '⭐',
    color: '#FFD700',
    condition: (stats) => stats.totalMatches >= 50
  },
  MATCHES_100: {
    id: 'matches_100',
    title: 'Legend',
    description: 'Play 100 matches',
    icon: '👑',
    color: '#FF3BFF',
    condition: (stats) => stats.totalMatches >= 100
  },

  // Win streaks
  STREAK_3: {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Win 3 matches in a row',
    icon: '🔥',
    color: '#FF3B3B',
    condition: (stats) => stats.bestStreak >= 3
  },
  STREAK_5: {
    id: 'streak_5',
    title: 'Unstoppable',
    description: 'Win 5 matches in a row',
    icon: '⚡',
    color: '#FFFF3B',
    condition: (stats) => stats.bestStreak >= 5
  },
  STREAK_10: {
    id: 'streak_10',
    title: 'Legendary Streak',
    description: 'Win 10 matches in a row',
    icon: '🌟',
    color: '#FF3BFF',
    condition: (stats) => stats.bestStreak >= 10
  },

  // Win rate achievements
  WIN_RATE_60: {
    id: 'win_rate_60',
    title: 'Skilled Player',
    description: 'Achieve 60% win rate (min 10 matches)',
    icon: '🎯',
    color: '#39FF14',
    condition: (stats) => stats.totalMatches >= 10 && stats.winRate >= 60
  },
  WIN_RATE_75: {
    id: 'win_rate_75',
    title: 'Elite Performer',
    description: 'Achieve 75% win rate (min 20 matches)',
    icon: '💎',
    color: '#3BFFFF',
    condition: (stats) => stats.totalMatches >= 20 && stats.winRate >= 75
  },
  WIN_RATE_90: {
    id: 'win_rate_90',
    title: 'Dominator',
    description: 'Achieve 90% win rate (min 10 matches)',
    icon: '👑',
    color: '#FFD700',
    condition: (stats) => stats.totalMatches >= 10 && stats.winRate >= 90
  },

  // Team achievements
  TEAM_CAPTAIN: {
    id: 'team_captain',
    title: 'Captain',
    description: 'Create your first team',
    icon: '👑',
    color: '#9B30FF',
    condition: (stats) => stats.teamsCreated >= 1
  },
  TEAM_LEADER: {
    id: 'team_leader',
    title: 'Team Leader',
    description: 'Manage 3 teams',
    icon: '🏅',
    color: '#FFD700',
    condition: (stats) => stats.teamsCreated >= 3
  },

  // Social achievements
  HELPFUL_TEAMMATE: {
    id: 'helpful_teammate',
    title: 'Helpful Teammate',
    description: 'Be part of 5 different teams',
    icon: '🤝',
    color: '#39FF14',
    condition: (stats) => stats.teamsJoined >= 5
  },

  // Performance achievements
  IMPROVING: {
    id: 'improving',
    title: 'Getting Better',
    description: 'Improve win rate by 10% over 10 matches',
    icon: '📈',
    color: '#39FF14',
    condition: (stats) => stats.improvementDetected
  },

  // Special achievements
  NIGHT_OWL: {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Play 10 matches after midnight',
    icon: '🦉',
    color: '#9B30FF',
    condition: (stats) => stats.nightMatches >= 10
  },
  EARLY_BIRD: {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Play 10 matches before 8 AM',
    icon: '🐦',
    color: '#FFFF3B',
    condition: (stats) => stats.earlyMatches >= 10
  }
};

class AchievementService {
  constructor() {
    this.listeners = [];
  }

  // Add listener for achievement unlocks
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of new achievement
  notifyListeners(achievement) {
    this.listeners.forEach(listener => listener(achievement));
  }

  // Get user's current achievements
  async getUserAchievements(userId) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }

  // Calculate user stats for achievement checking
  async calculateUserStats(userId) {
    try {
      // Get user matches
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('player_id', userId)
        .order('match_date', { ascending: false });

      if (matchError) throw matchError;

      // Get user teams
      const { data: teamMemberships, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId);

      if (teamError) throw teamError;

      // Get teams created by user
      const { data: teamsCreated, error: teamsError } = await supabase
        .from('teams')
        .select('id')
        .eq('captain_id', userId);

      if (teamsError) throw teamsError;

      // Calculate basic stats
      const totalMatches = matches?.length || 0;
      const wins = matches?.filter(match => match.result === 'win').length || 0;
      const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

      // Calculate streaks
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;
      let lastResult = null;

      for (const match of matches || []) {
        if (match.result === 'win') {
          if (lastResult === 'win' || lastResult === null) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
          if (lastResult === null) {
            currentStreak = tempStreak;
          }
        } else {
          if (lastResult === null) {
            currentStreak = 0;
          }
          tempStreak = 0;
        }
        
        bestStreak = Math.max(bestStreak, tempStreak);
        lastResult = match.result;
      }

      // Calculate time-based stats
      const now = new Date();
      let nightMatches = 0;
      let earlyMatches = 0;

      matches?.forEach(match => {
        const matchTime = new Date(match.match_date);
        const hour = matchTime.getHours();
        
        if (hour >= 0 && hour < 6) nightMatches++;
        if (hour >= 5 && hour < 8) earlyMatches++;
      });

      // Check for improvement (simplified)
      let improvementDetected = false;
      if (totalMatches >= 20) {
        const recentMatches = matches.slice(0, 10);
        const olderMatches = matches.slice(10, 20);
        
        const recentWinRate = recentMatches.filter(m => m.result === 'win').length / recentMatches.length * 100;
        const olderWinRate = olderMatches.filter(m => m.result === 'win').length / olderMatches.length * 100;
        
        improvementDetected = recentWinRate - olderWinRate >= 10;
      }

      return {
        totalMatches,
        wins,
        winRate,
        currentStreak,
        bestStreak,
        teamsJoined: teamMemberships?.length || 0,
        teamsCreated: teamsCreated?.length || 0,
        nightMatches,
        earlyMatches,
        improvementDetected,
        aiAnalysisUsed: 0 // Will be tracked separately
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {};
    }
  }

  // Check and unlock new achievements
  async checkAchievements(userId) {
    try {
      // Get current achievements
      const currentAchievements = await this.getUserAchievements(userId);
      const unlockedTypes = new Set(currentAchievements.map(a => a.type));

      // Calculate current stats
      const stats = await this.calculateUserStats(userId);

      // Check each achievement type
      const newAchievements = [];
      
      for (const [key, achievement] of Object.entries(ACHIEVEMENT_TYPES)) {
        // Skip if already unlocked
        if (unlockedTypes.has(achievement.id)) continue;

        // Check if condition is met
        if (achievement.condition(stats)) {
          // Unlock achievement
          const { data, error } = await supabase
            .from('achievements')
            .insert({
              user_id: userId,
              type: achievement.id,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              color: achievement.color,
              value: this.getAchievementValue(achievement.id, stats)
            })
            .select()
            .single();

          if (!error && data) {
            newAchievements.push(data);
            // Notify listeners
            this.notifyListeners(data);
          }
        }
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Get achievement value for display
  getAchievementValue(achievementId, stats) {
    switch (achievementId) {
      case 'matches_10':
      case 'matches_25':
      case 'matches_50':
      case 'matches_100':
        return stats.totalMatches;
      case 'streak_3':
      case 'streak_5':
      case 'streak_10':
        return stats.bestStreak;
      case 'win_rate_60':
      case 'win_rate_75':
      case 'win_rate_90':
        return stats.winRate;
      default:
        return 1;
    }
  }

  // Track AI analysis usage
  async trackAiAnalysis(userId) {
    try {
      // Update user stats or create a separate tracking mechanism
      // For now, we'll check achievements after AI usage
      await this.checkAchievements(userId);
    } catch (error) {
      console.error('Error tracking AI analysis:', error);
    }
  }

  // Get achievement progress for display
  getAchievementProgress(achievementType, stats) {
    const achievement = ACHIEVEMENT_TYPES[achievementType];
    if (!achievement) return null;

    // Calculate progress based on achievement type
    switch (achievementType) {
      case 'MATCHES_10':
        return Math.min(stats.totalMatches / 10 * 100, 100);
      case 'MATCHES_25':
        return Math.min(stats.totalMatches / 25 * 100, 100);
      case 'MATCHES_50':
        return Math.min(stats.totalMatches / 50 * 100, 100);
      case 'MATCHES_100':
        return Math.min(stats.totalMatches / 100 * 100, 100);
      case 'STREAK_3':
        return Math.min(stats.bestStreak / 3 * 100, 100);
      case 'STREAK_5':
        return Math.min(stats.bestStreak / 5 * 100, 100);
      case 'STREAK_10':
        return Math.min(stats.bestStreak / 10 * 100, 100);
      case 'WIN_RATE_60':
        return stats.totalMatches >= 10 ? Math.min(stats.winRate / 60 * 100, 100) : stats.totalMatches / 10 * 50;
      case 'WIN_RATE_75':
        return stats.totalMatches >= 20 ? Math.min(stats.winRate / 75 * 100, 100) : stats.totalMatches / 20 * 50;
      case 'WIN_RATE_90':
        return stats.totalMatches >= 10 ? Math.min(stats.winRate / 90 * 100, 100) : stats.totalMatches / 10 * 50;
      default:
        return achievement.condition(stats) ? 100 : 0;
    }
  }

  // Get all achievements with progress
  async getAchievementsWithProgress(userId) {
    try {
      const [userAchievements, stats] = await Promise.all([
        this.getUserAchievements(userId),
        this.calculateUserStats(userId)
      ]);

      const unlockedTypes = new Set(userAchievements.map(a => a.type));

      const allAchievements = Object.entries(ACHIEVEMENT_TYPES).map(([key, achievement]) => ({
        ...achievement,
        unlocked: unlockedTypes.has(achievement.id),
        progress: this.getAchievementProgress(key, stats),
        unlockedAt: userAchievements.find(a => a.type === achievement.id)?.created_at
      }));

      return {
        achievements: allAchievements,
        stats,
        unlockedCount: userAchievements.length,
        totalCount: Object.keys(ACHIEVEMENT_TYPES).length
      };
    } catch (error) {
      console.error('Error getting achievements with progress:', error);
      return {
        achievements: [],
        stats: {},
        unlockedCount: 0,
        totalCount: 0
      };
    }
  }
}

export const achievementService = new AchievementService();
export default achievementService;