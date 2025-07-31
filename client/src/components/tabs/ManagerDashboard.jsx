import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import Calendar from '../Calendar';
import PlayerOverview from '../PlayerOverview';
import CoachingNotes from '../CoachingNotes';
import CreateEventModal from '../modals/CreateEventModal';
import AddNoteModal from '../modals/AddNoteModal';
import ManagerTeamComparisonChart from '../charts/ManagerTeamComparisonChart';
import PlayerPerformanceTrendChart from '../charts/PlayerPerformanceTrendChart';
import CoachingEffectivenessChart from '../charts/CoachingEffectivenessChart';
import TeamActivityOverviewChart from '../charts/TeamActivityOverviewChart';
import { IconCrown, IconNote, IconCalendar, IconChartBar } from '@tabler/icons-react';
import '../../styles/ManagerDashboard.css';
import '../../styles/Charts.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [managedTeams, setManagedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [playerMatches, setPlayerMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchManagerData();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamEvents();
      fetchTeamPlayers();
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (managedTeams.length > 0) {
      fetchAllTeamStats();
    }
  }, [managedTeams]);

  useEffect(() => {
    if (players.length > 0) {
      fetchPlayerMatches();
    }
  }, [players]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      
      // Get teams where user is captain (manager)
      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            count
          )
        `)
        .eq('captain_id', user.id);

      if (error) {
        console.error('Error fetching managed teams:', error);
        return;
      }

      setManagedTeams(teams || []);
      
      // Auto-select first team if available
      if (teams && teams.length > 0 && !selectedTeam) {
        setSelectedTeam(teams[0]);
      }
    } catch (error) {
      console.error('Error in fetchManagerData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamEvents = async () => {
    if (!selectedTeam) return;

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('team_id', selectedTeam.id)
        .eq('manager_id', user.id)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error in fetchTeamEvents:', error);
    }
  };

  const fetchTeamPlayers = async () => {
    if (!selectedTeam) return;

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
        .eq('team_id', selectedTeam.id);

      if (error) {
        console.error('Error fetching team players:', error);
        return;
      }

      setPlayers(data || []);
    } catch (error) {
      console.error('Error in fetchTeamPlayers:', error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          manager_id: user.id,
          team_id: selectedTeam?.id || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      setEvents(prev => [...prev, data]);
      setIsCreateEventOpen(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error in handleCreateEvent:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('manager_id', user.id);

      if (error) {
        console.error('Error deleting event:', error);
        return;
      }

      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error in handleDeleteEvent:', error);
    }
  };

  const fetchAllTeamStats = async () => {
    try {
      const stats = {};
      
      for (const team of managedTeams) {
        // Get team members count
        const { data: members, error: membersError } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', team.id);

        if (membersError) {
          console.error(`Error fetching members for team ${team.id}:`, membersError);
          continue;
        }

        // Get team and member matches
        const memberIds = members?.map(m => m.user_id) || [];
        let allMatches = [];

        // Get team-specific matches
        const { data: teamMatches } = await supabase
          .from('matches')
          .select('*')
          .eq('team_id', team.id);

        // Get individual member matches
        if (memberIds.length > 0) {
          const { data: memberMatches } = await supabase
            .from('matches')
            .select('*')
            .in('player_id', memberIds);
          
          allMatches = [...(teamMatches || []), ...(memberMatches || [])];
        }

        // Remove duplicates and calculate stats
        const uniqueMatches = allMatches.filter((match, index, self) => 
          index === self.findIndex(m => m.id === match.id)
        );

        const totalMatches = uniqueMatches.length;
        const wins = uniqueMatches.filter(match => match.result === 'win').length;
        const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

        stats[team.id] = {
          totalMatches,
          wins,
          winRate,
          memberCount: members?.length || 0
        };
      }
      
      setTeamStats(stats);
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
  };

  const fetchPlayerMatches = async () => {
    try {
      const matches = {};
      
      for (const player of players) {
        const { data: playerMatches, error } = await supabase
          .from('matches')
          .select(`
            *,
            games (
              name,
              description
            )
          `)
          .eq('player_id', player.user_id)
          .order('match_date', { ascending: false });

        if (!error && playerMatches) {
          matches[player.user_id] = playerMatches;
        }
      }
      
      setPlayerMatches(matches);
    } catch (error) {
      console.error('Error fetching player matches:', error);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      // For now, we'll store notes in a simple format
      // In a real app, you might want a separate notes table
      const newNote = {
        id: Date.now().toString(),
        ...noteData,
        manager_id: user.id,
        team_id: selectedTeam?.id,
        created_at: new Date().toISOString()
      };

      setNotes(prev => [newNote, ...prev]);
      setIsAddNoteOpen(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error in handleAddNote:', error);
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <div className="manager-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading manager dashboard...</p>
        </div>
      </div>
    );
  }

  if (managedTeams.length === 0) {
    return (
      <div className="manager-dashboard">
        <div className="manager-header">
          <div className="header-content">
            <h1>Manager Dashboard</h1>
            <p>Manage teams, schedule events, and track player performance</p>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">
            <IconCrown size={48} />
          </div>
          <h3>No teams to manage</h3>
          <p>
            You need to be a team captain to access the manager dashboard. 
            Create a team in the Team Management section to get started!
          </p>
          <button 
            className="cta-button"
            onClick={() => window.location.hash = '#team'}
          >
            Go to Team Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      <div className="manager-header">
        <div className="header-content">
          <h1>Manager Dashboard</h1>
          <p>Manage your teams and track player performance</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="add-note-button"
            onClick={() => setIsAddNoteOpen(true)}
          >
            <IconNote size={16} />
            Add Note
          </button>
          <button 
            className="create-event-button"
            onClick={() => setIsCreateEventOpen(true)}
          >
            <IconCalendar size={16} />
            Schedule Event
          </button>
        </div>
      </div>

      {/* Team Selector */}
      <div className="team-selector">
        <label htmlFor="team-select">Managing Team:</label>
        <select 
          id="team-select"
          value={selectedTeam?.id || ''}
          onChange={(e) => {
            const team = managedTeams.find(t => t.id === e.target.value);
            setSelectedTeam(team);
          }}
        >
          {managedTeams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <span className="team-info">
          {selectedTeam && `${players.length} players`}
        </span>
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={`tab ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          <IconChartBar size={16} /> Overview
        </button>
        <button 
          className={`tab ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          <IconCalendar size={16} /> Calendar
        </button>
        <button 
          className={`tab ${activeView === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveView('notes')}
        >
          <IconNote size={16} /> Notes
        </button>
      </div>

      {/* Content */}
      <div className="manager-content">
        {activeView === 'overview' && (
          <div className="manager-overview">
            {/* Manager Analytics Charts */}
            <div className="chart-section">
              <div className="chart-section-header">
                <h2>Manager Analytics Dashboard</h2>
                <p>Comprehensive insights across all managed teams and players</p>
              </div>
              
              {/* Team Comparison and Activity */}
              <div className="charts-grid">
                <ManagerTeamComparisonChart 
                  managedTeams={managedTeams} 
                  teamStats={teamStats} 
                />
                <TeamActivityOverviewChart 
                  playerMatches={playerMatches} 
                  events={events} 
                  players={players} 
                />
              </div>
              
              {/* Player Performance and Coaching Effectiveness */}
              <div className="charts-grid">
                <PlayerPerformanceTrendChart 
                  players={players} 
                  playerMatches={playerMatches} 
                />
                <CoachingEffectivenessChart 
                  events={events} 
                  playerMatches={playerMatches} 
                  players={players} 
                />
              </div>
            </div>

            {/* Player Overview */}
            <PlayerOverview 
              team={selectedTeam}
              players={players}
              managerId={user.id}
            />
          </div>
        )}
        
        {activeView === 'calendar' && (
          <Calendar 
            events={events}
            onDeleteEvent={handleDeleteEvent}
            managerId={user.id}
          />
        )}
        
        {activeView === 'notes' && (
          <CoachingNotes 
            notes={notes}
            team={selectedTeam}
            players={players}
          />
        )}
      </div>

      {/* Modals */}
      {isCreateEventOpen && (
        <CreateEventModal
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={handleCreateEvent}
          team={selectedTeam}
        />
      )}

      {isAddNoteOpen && (
        <AddNoteModal
          onClose={() => setIsAddNoteOpen(false)}
          onSubmit={handleAddNote}
          team={selectedTeam}
          players={players}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;