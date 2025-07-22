import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import AddMatchModal from '../modals/AddMatchModal';
import MatchList from '../MatchList';
import StatsCards from '../StatsCards';
import '../../styles/SoloTracker.css';

const SoloTracker = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchGames();
      fetchMatches();
    }
  }, [user?.id]);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching games:', error);
        return;
      }

      setGames(data || []);
    } catch (error) {
      console.error('Error in fetchGames:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          games (
            name,
            description
          )
        `)
        .eq('player_id', user.id)
        .order('match_date', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (matchesData) => {
    const totalMatches = matchesData.length;
    const wins = matchesData.filter(match => match.result === 'win').length;
    const losses = matchesData.filter(match => match.result === 'loss').length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    // Calculate current streak
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastResult = null;

    for (const match of matchesData) {
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

    setStats({
      totalMatches,
      wins,
      losses,
      winRate,
      currentStreak,
      bestStreak
    });
  };

  const handleAddMatch = async (matchData) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          ...matchData,
          player_id: user.id,
          created_by: user.id
        })
        .select(`
          *,
          games (
            name,
            description
          )
        `)
        .single();

      if (error) {
        console.error('Error adding match:', error);
        throw error;
      }

      // Add new match to the beginning of the list
      setMatches(prev => [data, ...prev]);
      calculateStats([data, ...matches]);
      setIsAddModalOpen(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error in handleAddMatch:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId)
        .eq('player_id', user.id); // Ensure user can only delete their own matches

      if (error) {
        console.error('Error deleting match:', error);
        return;
      }

      // Remove match from state
      const updatedMatches = matches.filter(match => match.id !== matchId);
      setMatches(updatedMatches);
      calculateStats(updatedMatches);
    } catch (error) {
      console.error('Error in handleDeleteMatch:', error);
    }
  };

  if (loading) {
    return (
      <div className="solo-tracker loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="solo-tracker">
      <div className="solo-tracker-header">
        <div className="header-content">
          <h1>Solo Tracker</h1>
          <p>Track your individual game performance and improve your skills</p>
        </div>
        <button 
          className="add-match-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="button-icon">+</span>
          Add Match
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Matches Section */}
      <div className="matches-section">
        <div className="section-header">
          <h2>Recent Matches</h2>
          <p>Your latest gaming sessions</p>
        </div>

        {matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No matches recorded yet</h3>
            <p>Start tracking your games to see your performance and improvement over time!</p>
            <button 
              className="cta-button"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Your First Match
            </button>
          </div>
        ) : (
          <MatchList 
            matches={matches} 
            onDeleteMatch={handleDeleteMatch}
          />
        )}
      </div>

      {/* Add Match Modal */}
      {isAddModalOpen && (
        <AddMatchModal
          games={games}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddMatch}
        />
      )}
    </div>
  );
};

export default SoloTracker;