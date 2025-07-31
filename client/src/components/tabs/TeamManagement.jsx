import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { achievementService } from '../../services/achievementService';
import CreateTeamModal from '../modals/CreateTeamModal.jsx';
import JoinTeamModal from '../modals/JoinTeamModal.jsx';
import TeamCard from '../TeamCard.jsx';
import TeamDetails from '../TeamDetails.jsx';
import { IconLink, IconUsers } from '@tabler/icons-react';
import '../../styles/TeamManagement.css';

const TeamManagement = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserTeams();
    }
  }, [user?.id]);

  const fetchUserTeams = async () => {
    try {
      setLoading(true);
      
      // Get teams where user is captain
      const { data: captainTeams, error: captainError } = await supabase
        .from('teams')
        .select(`
          *,
          captain:users!teams_captain_id_fkey (
            id,
            username,
            profile_avatar
          )
        `)
        .eq('captain_id', user.id);

      if (captainError) {
        console.error('Error fetching captain teams:', captainError);
      }

      // Get teams where user is a member (but not captain)
      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select(`
          nickname,
          joined_at,
          team_id
        `)
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error fetching member teams:', memberError);
      }

      // For member teams, fetch the team details separately
      const memberTeamDetails = [];
      if (memberTeams && memberTeams.length > 0) {
        for (const membership of memberTeams) {
          // Skip if user is already captain of this team
          const isAlreadyCaptain = captainTeams?.some(team => team.id === membership.team_id);
          if (isAlreadyCaptain) continue;

          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select(`
              *,
              captain:users!teams_captain_id_fkey (
                id,
                username,
                profile_avatar
              )
            `)
            .eq('id', membership.team_id)
            .single();

          if (!teamError && teamData) {
            memberTeamDetails.push({
              ...teamData,
              memberInfo: {
                nickname: membership.nickname,
                joined_at: membership.joined_at
              }
            });
          }
        }
      }

      // Combine captain teams and member teams
      const allTeams = [
        ...(captainTeams || []).map(team => ({
          ...team,
          memberInfo: {
            nickname: user.username,
            joined_at: team.created_at
          }
        })),
        ...memberTeamDetails
      ];

      setTeams(allTeams);
      
      // Auto-select first team if available
      if (allTeams.length > 0 && !selectedTeam) {
        setSelectedTeam(allTeams[0]);
      }
    } catch (error) {
      console.error('Error in fetchUserTeams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      // Create the team
      const { data: newTeam, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          captain_id: user.id
        })
        .select(`
          *,
          captain:users!teams_captain_id_fkey (
            id,
            username,
            profile_avatar
          )
        `)
        .single();

      if (teamError) {
        console.error('Error creating team:', teamError);
        throw teamError;
      }

      // Add creator as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: newTeam.id,
          user_id: user.id,
          nickname: teamData.nickname || user.username
        });

      if (memberError) {
        console.error('Error adding team member:', memberError);
        throw memberError;
      }

      // Add member info to team object
      const teamWithMemberInfo = {
        ...newTeam,
        memberInfo: {
          nickname: teamData.nickname || user.username,
          joined_at: new Date().toISOString()
        }
      };

      // Update state
      setTeams(prev => [teamWithMemberInfo, ...prev]);
      setSelectedTeam(teamWithMemberInfo);
      setIsCreateModalOpen(false);
      
      // Check for team creation achievements
      setTimeout(() => {
        achievementService.checkAchievements(user.id);
      }, 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Error in handleCreateTeam:', error);
      return { success: false, error: error.message };
    }
  };

  const handleJoinTeam = async (teamCode) => {
    try {
      // Find team by ID (using team code as team ID for now)
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
          captain:users!teams_captain_id_fkey (
            id,
            username,
            profile_avatar
          )
        `)
        .eq('id', teamCode)
        .single();

      if (teamError || !team) {
        throw new Error('Team not found');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this team');
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          nickname: user.username
        });

      if (memberError) {
        throw memberError;
      }

      // Add member info to team object
      const teamWithMemberInfo = {
        ...team,
        memberInfo: {
          nickname: user.username,
          joined_at: new Date().toISOString()
        }
      };

      // Update state
      setTeams(prev => [teamWithMemberInfo, ...prev]);
      setSelectedTeam(teamWithMemberInfo);
      setIsJoinModalOpen(false);
      
      // Check for team joining achievements
      setTimeout(() => {
        achievementService.checkAchievements(user.id);
      }, 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Error in handleJoinTeam:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update state
      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      
      // Update selected team
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(updatedTeams.length > 0 ? updatedTeams[0] : null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error leaving team:', error);
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <div className="team-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-management">
      <div className="team-management-header">
        <div className="header-content">
          <h1>Team Management</h1>
          <p>Create teams, collaborate with teammates, and track group performance</p>
        </div>
        <div className="header-actions">
          <button 
            className="join-team-button"
            onClick={() => setIsJoinModalOpen(true)}
          >
            <IconLink size={16} />
            Join Team
          </button>
          <button 
            className="create-team-button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="button-icon">+</span>
            Create Team
          </button>
        </div>
      </div>

      <div className="team-content">
        {teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <IconUsers size={48} />
            </div>
            <h3>No teams yet</h3>
            <p>Create your first team or join an existing one to start collaborating with other players!</p>
            <div className="empty-actions">
              <button 
                className="cta-button primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Your First Team
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => setIsJoinModalOpen(true)}
              >
                Join Existing Team
              </button>
            </div>
          </div>
        ) : (
          <div className="team-layout">
            {/* Team List */}
            <div className="team-list">
              <h3>Your Teams ({teams.length})</h3>
              <div className="teams-grid">
                {teams.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isSelected={selectedTeam?.id === team.id}
                    onClick={() => setSelectedTeam(team)}
                    onLeave={handleLeaveTeam}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            </div>

            {/* Team Details */}
            {selectedTeam && (
              <div className="team-details">
                <TeamDetails 
                  team={selectedTeam}
                  currentUserId={user.id}
                  onTeamUpdate={fetchUserTeams}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTeam}
          currentUser={user}
        />
      )}

      {isJoinModalOpen && (
        <JoinTeamModal
          onClose={() => setIsJoinModalOpen(false)}
          onSubmit={handleJoinTeam}
        />
      )}
    </div>
  );
};

export default TeamManagement;