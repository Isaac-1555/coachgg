import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import '../styles/PlayerOverview.css';

const PlayerOverview = ({ team, players, managerId }) => {
  const [playerStats, setPlayerStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (team && players.length > 0) {
      fetchPlayerStats();
    }
  }, [team, players]);

  const fetchPlayerStats = async () => {
    try {
      setLoading(true);
      const stats = {};

      // Fetch stats for each player
      for (const player of players) {
        const { data: matches, error } = await supabase
          .from('matches')
          .select('*')
          .eq('player_id', player.user_id);

        if (error) {
          console.error(`Error fetching stats for player ${player.user_id}:`, error);
          continue;
        }

        const totalMatches = matches?.length || 0;
        const wins = matches?.filter(match => match.result === 'win').length || 0;
        const losses = matches?.filter(match => match.result === 'loss').length || 0;
        const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

        // Calculate recent performance (last 10 matches)
        const recentMatches = matches
          ?.sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
          .slice(0, 10) || [];
        
        const recentWins = recentMatches.filter(match => match.result === 'win').length;
        const recentWinRate = recentMatches.length > 0 ? Math.round((recentWins / recentMatches.length) * 100) : 0;

        // Calculate average stats
        const avgStats = calculateAverageStats(matches || []);

        stats[player.user_id] = {
          totalMatches,
          wins,
          losses,
          winRate,
          recentMatches: recentMatches.length,
          recentWinRate,
          avgStats,
          lastMatch: matches?.length > 0 ? matches[0]?.match_date : null
        };
      }

      setPlayerStats(stats);
    } catch (error) {
      console.error('Error in fetchPlayerStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageStats = (matches) => {
    if (matches.length === 0) return {};

    const statTotals = {};
    const statCounts = {};

    matches.forEach(match => {
      if (match.stats) {
        Object.entries(match.stats).forEach(([key, value]) => {
          if (typeof value === 'number') {
            statTotals[key] = (statTotals[key] || 0) + value;
            statCounts[key] = (statCounts[key] || 0) + 1;
          }
        });
      }
    });

    const avgStats = {};
    Object.keys(statTotals).forEach(key => {
      avgStats[key] = Math.round((statTotals[key] / statCounts[key]) * 100) / 100;
    });

    return avgStats;
  };

  const formatLastMatch = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const getPerformanceColor = (winRate) => {
    if (winRate >= 70) return '#39FF14';
    if (winRate >= 50) return '#FFA500';
    return '#EF4444';
  };

  const getPerformanceTrend = (overallWinRate, recentWinRate) => {
    const diff = recentWinRate - overallWinRate;
    if (diff > 10) return { icon: '📈', text: 'Improving', color: '#39FF14' };
    if (diff < -10) return { icon: '📉', text: 'Declining', color: '#EF4444' };
    return { icon: '➡️', text: 'Stable', color: '#FFA500' };
  };

  if (loading) {
    return (
      <div className="player-overview loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading player statistics...</p>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="player-overview-empty">
        <div className="empty-icon">👥</div>
        <h3>No players in team</h3>
        <p>Invite players to your team to start tracking their performance.</p>
      </div>
    );
  }

  return (
    <div className="player-overview">
      <div className="overview-header">
        <h3>Team Performance Overview</h3>
        <p>Track individual player statistics and performance trends</p>
      </div>

      <div className="players-grid">
        {players.map(player => {
          const stats = playerStats[player.user_id] || {};
          const trend = getPerformanceTrend(stats.winRate || 0, stats.recentWinRate || 0);
          
          return (
            <div key={player.user_id} className="player-card">
              <div className="player-header">
                <div className="player-avatar">
                  {player.users.profile_avatar ? (
                    <img src={player.users.profile_avatar} alt={player.users.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {player.users.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="player-info">
                  <h4 className="player-name">{player.users.username}</h4>
                  {player.nickname && player.nickname !== player.users.username && (
                    <span className="player-nickname">({player.nickname})</span>
                  )}
                  <span className="player-role">{player.users.role}</span>
                </div>
                
                <div className="performance-trend">
                  <span 
                    className="trend-icon"
                    style={{ color: trend.color }}
                    title={trend.text}
                  >
                    {trend.icon}
                  </span>
                </div>
              </div>

              <div className="player-stats">
                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-label">Matches</span>
                    <span className="stat-value">{stats.totalMatches || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Win Rate</span>
                    <span 
                      className="stat-value"
                      style={{ color: getPerformanceColor(stats.winRate || 0) }}
                    >
                      {stats.winRate || 0}%
                    </span>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-label">Recent (10)</span>
                    <span 
                      className="stat-value"
                      style={{ color: getPerformanceColor(stats.recentWinRate || 0) }}
                    >
                      {stats.recentWinRate || 0}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Match</span>
                    <span className="stat-value">{formatLastMatch(stats.lastMatch)}</span>
                  </div>
                </div>

                {/* Average Stats */}
                {stats.avgStats && Object.keys(stats.avgStats).length > 0 && (
                  <div className="avg-stats">
                    <h5>Average Stats</h5>
                    <div className="avg-stats-grid">
                      {Object.entries(stats.avgStats)
                        .slice(0, 4) // Show top 4 stats
                        .map(([key, value]) => (
                          <div key={key} className="avg-stat">
                            <span className="avg-stat-label">{key.replace(/_/g, ' ')}</span>
                            <span className="avg-stat-value">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="player-actions">
                <button 
                  className="view-details-button"
                  onClick={() => {
                    // Could open a detailed player modal
                    alert(`Detailed stats for ${player.users.username} - Feature coming soon!`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Summary */}
      <div className="team-summary">
        <h3>Team Summary</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Players</span>
            <span className="summary-value">{players.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Active Players</span>
            <span className="summary-value">
              {Object.values(playerStats).filter(stats => stats.totalMatches > 0).length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Team Avg Win Rate</span>
            <span className="summary-value">
              {Object.values(playerStats).length > 0 
                ? Math.round(
                    Object.values(playerStats)
                      .reduce((sum, stats) => sum + (stats.winRate || 0), 0) / 
                    Object.values(playerStats).length
                  )
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerOverview;