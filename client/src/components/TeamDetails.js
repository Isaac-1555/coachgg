import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import TeamWinRateChart from './charts/TeamWinRateChart';
import MemberPerformanceChart from './charts/MemberPerformanceChart';
import TeamVsIndividualChart from './charts/TeamVsIndividualChart';
import TeamGameDistributionChart from './charts/TeamGameDistributionChart';
import '../styles/TeamDetails.css';
import '../styles/Charts.css';

const TeamDetails = ({ team, currentUserId, onTeamUpdate }) => {
  const [members, setMembers] = useState([]);
  const [teamStats, setTeamStats] = useState({
    totalMatches: 0,
    teamWins: 0,
    teamLosses: 0,
    winRate: 0
  });
  const [teamMatches, setTeamMatches] = useState([]);
  const [memberStats, setMemberStats] = useState({});
  const [loading, setLoading] = useState(true);

  const isCaptain = team.captain_id === currentUserId;

  useEffect(() => {
    if (team?.id) {
      fetchTeamMembers();
    }
  }, [team?.id]);

  useEffect(() => {
    if (members.length > 0) {
      fetchTeamStats(); // Fetch team stats after members are loaded
      fetchMemberStats();
    }
  }, [members]);

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
      
      // Get team-specific matches (matches played as a team)
      const { data: teamMatches, error: teamError } = await supabase
        .from('matches')
        .select(`
          *,
          games (
            name,
            description
          )
        `)
        .eq('team_id', team.id)
        .order('match_date', { ascending: false });

      if (teamError) {
        console.error('Error fetching team matches:', teamError);
      }

      // Get individual matches from all team members for comprehensive team view
      const memberIds = members.map(member => member.user_id);
      let allMemberMatches = [];
      
      if (memberIds.length > 0) {
        const { data: memberMatches, error: memberError } = await supabase
          .from('matches')
          .select(`
            *,
            games (
              name,
              description
            )
          `)
          .in('player_id', memberIds)
          .order('match_date', { ascending: false });

        if (!memberError && memberMatches) {
          allMemberMatches = memberMatches;
        }
      }

      // Combine team matches and member matches for comprehensive view
      const allMatches = [
        ...(teamMatches || []),
        ...allMemberMatches
      ];

      // Remove duplicates (in case a match has both team_id and player_id)
      const uniqueMatches = allMatches.filter((match, index, self) => 
        index === self.findIndex(m => m.id === match.id)
      );

      // Sort by date
      uniqueMatches.sort((a, b) => new Date(b.match_date) - new Date(a.match_date));

      // Calculate stats from team-specific matches only for team stats
      const teamSpecificMatches = teamMatches || [];
      const totalTeamMatches = teamSpecificMatches.length;
      const teamWins = teamSpecificMatches.filter(match => match.result === 'win').length;
      const teamLosses = teamSpecificMatches.filter(match => match.result === 'loss').length;
      const teamWinRate = totalTeamMatches > 0 ? Math.round((teamWins / totalTeamMatches) * 100) : 0;

      setTeamMatches(uniqueMatches); // Use all matches for charts
      setTeamStats({
        totalMatches: totalTeamMatches, // Team-specific stats
        teamWins,
        teamLosses,
        winRate: teamWinRate
      });
    } catch (error) {
      console.error('Error in fetchTeamStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberStats = async () => {
    try {
      const memberStatsData = {};
      
      // Fetch individual stats for each member
      for (const member of members) {
        const { data: memberMatches, error } = await supabase
          .from('matches')
          .select('*')
          .eq('player_id', member.user_id);

        if (!error && memberMatches) {
          const totalMatches = memberMatches.length;
          const wins = memberMatches.filter(match => match.result === 'win').length;
          const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
          
          memberStatsData[member.user_id] = {
            totalMatches,
            wins,
            winRate
          };
        }
      }
      
      setMemberStats(memberStatsData);
    } catch (error) {
      console.error('Error fetching member stats:', error);
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

      {/* Team Performance Charts */}
      {!loading && teamMatches.length > 0 && (
        <div className="chart-section">
          <div className="chart-section-header">
            <h3>Team Performance Analytics</h3>
            <p>Combined view of team matches and individual member performance</p>
          </div>
          <div className="charts-grid">
            <TeamWinRateChart teamMatches={teamMatches} />
            <TeamVsIndividualChart 
              teamStats={teamStats} 
              memberStats={memberStats} 
              members={members} 
            />
          </div>
          <div className="charts-grid">
            <MemberPerformanceChart 
              members={members} 
              memberStats={memberStats} 
            />
            <TeamGameDistributionChart teamMatches={teamMatches} />
          </div>
        </div>
      )}

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