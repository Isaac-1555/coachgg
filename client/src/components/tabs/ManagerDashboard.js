import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import Calendar from '../Calendar';
import PlayerOverview from '../PlayerOverview';
import CoachingNotes from '../CoachingNotes';
import CreateEventModal from '../modals/CreateEventModal';
import AddNoteModal from '../modals/AddNoteModal';
import '../../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [managedTeams, setManagedTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [players, setPlayers] = useState([]);
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
          <div className="empty-icon">👑</div>
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
            <span className="button-icon">📝</span>
            Add Note
          </button>
          <button 
            className="create-event-button"
            onClick={() => setIsCreateEventOpen(true)}
          >
            <span className="button-icon">📅</span>
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
          📊 Overview
        </button>
        <button 
          className={`tab ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          className={`tab ${activeView === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveView('notes')}
        >
          📝 Notes
        </button>
      </div>

      {/* Content */}
      <div className="manager-content">
        {activeView === 'overview' && (
          <PlayerOverview 
            team={selectedTeam}
            players={players}
            managerId={user.id}
          />
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