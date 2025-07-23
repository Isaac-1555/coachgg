import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import WinRateChart from '../charts/WinRateChart';
import GameDistributionChart from '../charts/GameDistributionChart';
import '../../styles/Overview.css';
import '../../styles/Charts.css';

const Overview = ({ user }) => {
  const { user: authUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
    hoursPlayed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?.id) {
      fetchUserData();
    }
  }, [authUser?.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          *,
          games (
            name,
            description
          )
        `)
        .eq('player_id', authUser.id)
        .order('match_date', { ascending: false })
        .limit(20); // Get recent matches for overview

      if (matchesError) {
        console.error('Error fetching matches:', matchesError);
        return;
      }

      setMatches(matchesData || []);
      calculateOverviewStats(matchesData || []);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverviewStats = (matchesData) => {
    const totalMatches = matchesData.length;
    const wins = matchesData.filter(match => match.result === 'win').length;
    const losses = matchesData.filter(match => match.result === 'loss').length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    // Calculate current streak
    let currentStreak = 0;
    if (matchesData.length > 0) {
      const lastResult = matchesData[0].result;
      for (const match of matchesData) {
        if (match.result === lastResult) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Estimate hours played (assuming 30 min average per match)
    const hoursPlayed = Math.round((totalMatches * 0.5) * 10) / 10;

    setStats({
      totalMatches,
      wins,
      losses,
      winRate,
      currentStreak,
      hoursPlayed
    });
  };

  if (loading) {
    return (
      <div className="overview loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview">
      <div className="overview-header">
        <h1>Welcome back, {user.username}!</h1>
        <p>Ready to level up your game today?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Matches</p>
              <p className="stat-value">{stats.totalMatches}</p>
            </div>
            <div className="stat-icon">🎮</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Win Rate</p>
              <p className="stat-value">{stats.winRate}%</p>
            </div>
            <div className="stat-icon">🏆</div>
          </div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: `${stats.winRate}%` }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Current Streak</p>
              <p className="stat-value">{stats.currentStreak}</p>
            </div>
            <div className="stat-icon">📈</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Hours Played</p>
              <p className="stat-value">{stats.hoursPlayed}</p>
            </div>
            <div className="stat-icon">⏰</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {matches.length > 0 && (
        <div className="chart-section">
          <div className="chart-section-header">
            <h2>Performance Overview</h2>
            <p>Quick insights into your recent gaming activity</p>
          </div>
          <div className="charts-grid">
            <WinRateChart matches={matches} />
            <GameDistributionChart matches={matches} />
          </div>
        </div>
      )}

      <div className="content-grid">
        {/* Recent Matches */}
        <div className="content-card">
          <div className="card-header">
            <h3>🎮 Recent Matches</h3>
            <p>Your latest gaming sessions</p>
          </div>
          <div className="card-content">
            {matches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h4>No matches yet</h4>
                <p>Start tracking your games to see your progress here!</p>
                <button className="cta-button">Add Your First Match</button>
              </div>
            ) : (
              <div className="recent-matches-list">
                {matches.slice(0, 5).map((match) => (
                  <div key={match.id} className="recent-match-item">
                    <div className={`match-result ${match.result}`}>
                      {match.result === 'win' ? '✓' : match.result === 'loss' ? '✗' : '−'}
                    </div>
                    <div className="match-info">
                      <span className="match-game">{match.games?.name || 'Unknown Game'}</span>
                      <span className="match-date">
                        {new Date(match.match_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`match-result-text ${match.result}`}>
                      {match.result.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="content-card">
          <div className="card-header">
            <h3>🏆 Recent Achievements</h3>
            <p>Your latest unlocks and milestones</p>
          </div>
          <div className="card-content">
            <div className="empty-state">
              <div className="empty-icon">🎖️</div>
              <h4>No achievements yet</h4>
              <p>Play matches and complete challenges to unlock achievements!</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Suggestion */}
      <div className="ai-coach-card">
        <div className="ai-coach-content">
          <div className="ai-coach-icon">
            <span>🤖</span>
          </div>
          <div className="ai-coach-text">
            <h3>AI Coach Insight</h3>
            <p>
              {matches.length === 0 
                ? "Welcome to CoachGG! Start by adding your first match to get personalized insights and recommendations to improve your gameplay."
                : stats.winRate >= 70 
                  ? `Great performance! Your ${stats.winRate}% win rate shows strong consistency. Keep focusing on your current strategies.`
                  : stats.winRate >= 50
                    ? `You're on the right track with a ${stats.winRate}% win rate. Try analyzing your losses to identify improvement areas.`
                    : `Your ${stats.winRate}% win rate has room for improvement. Focus on fundamentals and consider reviewing your gameplay patterns.`
              }
            </p>
            <button className="ai-coach-button">
              {matches.length === 0 ? 'Get Started' : 'View AI Analysis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;