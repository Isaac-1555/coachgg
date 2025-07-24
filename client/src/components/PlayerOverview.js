import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { IconUsers } from '@tabler/icons-react';
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
          recentWinRate,
          avgStats
        };
      }

      setPlayerStats(stats);
    } catch (error) {
      console.error('Error fetching player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageStats = (matches) => {
    if (!matches || matches.length === 0) {
      return { kills: 0, deaths: 0, assists: 0 };
    }

    const validMatches = matches.filter(match => match.stats && 
      typeof match.stats.kills === 'number' && 
      typeof match.stats.deaths === 'number'
    );

    if (validMatches.length === 0) {
      return { kills: 0, deaths: 0, assists: 0 };
    }

    const totals = validMatches.reduce((acc, match) => ({
      kills: acc.kills + (match.stats.kills || 0),
      deaths: acc.deaths + (match.stats.deaths || 0),
      assists: acc.assists + (match.stats.assists || 0)
    }), { kills: 0, deaths: 0, assists: 0 });

    return {
      kills: Math.round((totals.kills / validMatches.length) * 10) / 10,
      deaths: Math.round((totals.deaths / validMatches.length) * 10) / 10,
      assists: Math.round((totals.assists / validMatches.length) * 10) / 10
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="player-overview loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading player stats...</p>
        </div>
      </div>
    );
  }

  if (!team || players.length === 0) {
    return (
      <div className="player-overview">
        <div className="empty-state">
          <div className="empty-icon">
            <IconUsers size={48} />
          </div>
          <h3>No team selected</h3>
          <p>Select a team to view player performance overview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player-overview">
      <div className="overview-header">
        <h2>Player Performance Overview</h2>
        <p>Detailed statistics for {team.name} team members</p>
      </div>

      <div className="players-grid">
        {players.map(player => {
          const stats = playerStats[player.user_id] || {};
          
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
                  <h3>{player.users.username}</h3>
                  {player.nickname && player.nickname !== player.users.username && (
                    <p className="nickname">({player.nickname})</p>
                  )}
                  <span className="role">{player.users.role}</span>
                </div>
              </div>

              <div className="player-stats">
                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-label">Total Matches</span>
                    <span className="stat-value">{stats.totalMatches || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Win Rate</span>
                    <span className="stat-value">{stats.winRate || 0}%</span>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-label">Recent Form</span>
                    <span className="stat-value">{stats.recentWinRate || 0}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">W/L</span>
                    <span className="stat-value">{stats.wins || 0}/{stats.losses || 0}</span>
                  </div>
                </div>

                {stats.avgStats && (
                  <div className="stat-row">
                    <div className="stat-item">
                      <span className="stat-label">Avg KDA</span>
                      <span className="stat-value">
                        {stats.avgStats.kills}/{stats.avgStats.deaths}/{stats.avgStats.assists}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="player-meta">
                <span className="join-date">
                  Joined: {formatDate(player.joined_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerOverview;