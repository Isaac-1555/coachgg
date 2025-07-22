import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import '../styles/TeamDetails.css';

const TeamDetails = ({ team, currentUserId, onTeamUpdate }) => {
  const [members, setMembers] = useState([]);
  const [teamStats, setTeamStats] = useState({
    totalMatches: 0,
    teamWins: 0,
    teamLosses: 0,
    winRate: 0
  });
  const [loading, setLoading] = useState(true);

  const isCaptain = team.captain_id === currentUserId;

  useEffect(() => {
    if (team?.id) {
      fetchTeamMembers();
      fetchTeamStats();
    }
  }, [team?.id]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          users (
            id,
            username,
            profile_avatar,
            role
          )
        `)
        .eq('team_id', team.id)
        .order('joined_at');

      if (error) {
        console.error('Error fetching team members:', error);
        return;
      }

      setMembers(data || []);
    } catch (error) {
      console.error('Error in fetchTeamMembers:', error);
    }
  };

  const fetchTeamStats = async () => {
    try {
      setLoading(true);
      
      // Get team matches
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .eq('team_id', team.id);

      if (error) {
        console.error('Error fetching team stats:', error);
        return;
      }

      const totalMatches = matches?.length || 0;
      const teamWins = matches?.filter(match => match.result === 'win').length || 0;
      const teamLosses = matches?.filter(match => match.result === 'loss').length || 0;
      const winRate = totalMatches > 0 ? Math.round((teamWins / totalMatches) * 100) : 0;

      setTeamStats({
        totalMatches,
        teamWins,
        teamLosses,
        winRate
      });
    } catch (error) {
      console.error('Error in fetchTeamStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!isCaptain) {
      alert('Only the team captain can remove members.');
      return;
    }

    if (memberId === currentUserId) {
      alert('You cannot remove yourself as captain. Transfer captaincy first.');
      return;
    }

    const member = members.find(m => m.user_id === memberId);
    if (!member) return;

    if (window.confirm(`Remove ${member.users.username} from the team?`)) {
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', team.id)
          .eq('user_id', memberId);

        if (error) {
          console.error('Error removing member:', error);
          alert('Failed to remove member');
          return;
        }

        // Update local state
        setMembers(prev => prev.filter(m => m.user_id !== memberId));
      } catch (error) {
        console.error('Error in handleRemoveMember:', error);
        alert('Failed to remove member');
      }
    }
  };

  const copyTeamId = () => {
    navigator.clipboard.writeText(team.id);
    alert('Team ID copied to clipboard! Share this with players to invite them.');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="team-details">
      <div className="team-details-header">
        <div className="team-title">
          <h2>{team.name}</h2>
          <div className="team-badges">
            {isCaptain && <span className="captain-badge">👑 Captain</span>}
            <span className="member-count">{members.length} members</span>
          </div>
        </div>
        
        <div className="team-actions">
          <button 
            className="copy-id-button"
            onClick={copyTeamId}
            title="Copy team ID to invite players"
          >
            📋 Copy Team ID
          </button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="team-stats-section">
        <h3>Team Statistics</h3>
        {loading ? (
          <div className="stats-loading">Loading stats...</div>
        ) : (
          <div className="team-stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Matches</span>
              <span className="stat-value">{teamStats.totalMatches}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Team Wins</span>
              <span className="stat-value">{teamStats.teamWins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Team Losses</span>
              <span className="stat-value">{teamStats.teamLosses}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win Rate</span>
              <span className="stat-value">{teamStats.winRate}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Team Members */}
      <div className="team-members-section">
        <h3>Team Members</h3>
        <div className="members-list">
          {members.map(member => (
            <div key={member.user_id} className="member-item">
              <div className="member-info">
                <div className="member-avatar">
                  {member.users.profile_avatar ? (
                    <img src={member.users.profile_avatar} alt={member.users.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {member.users.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="member-details">
                  <div className="member-names">
                    <span className="username">{member.users.username}</span>
                    {member.nickname && member.nickname !== member.users.username && (
                      <span className="nickname">({member.nickname})</span>
                    )}
                  </div>
                  <div className="member-meta">
                    <span className="role">{member.users.role}</span>
                    <span className="join-date">Joined {formatDate(member.joined_at)}</span>
                  </div>
                </div>
              </div>

              <div className="member-actions">
                {member.user_id === team.captain_id && (
                  <span className="captain-indicator">👑</span>
                )}
                
                {isCaptain && member.user_id !== currentUserId && (
                  <button 
                    className="remove-member-button"
                    onClick={() => handleRemoveMember(member.user_id)}
                    title="Remove member"
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Info */}
      <div className="team-info-section">
        <h3>Team Information</h3>
        <div className="team-info-grid">
          <div className="info-item">
            <span className="info-label">Created</span>
            <span className="info-value">{formatDate(team.created_at)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Team ID</span>
            <span className="info-value team-id-display">
              {team.id}
              <button 
                className="copy-button"
                onClick={copyTeamId}
                title="Copy to clipboard"
              >
                📋
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;