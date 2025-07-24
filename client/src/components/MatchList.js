import React from 'react';
import { IconTrash, IconTrophy, IconX } from '@tabler/icons-react';
import '../styles/MatchList.css';

const MatchList = ({ matches, onDeleteMatch }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatStats = (stats) => {
    if (!stats) return 'No stats';
    
    const { kills, deaths, assists } = stats;
    if (kills !== undefined && deaths !== undefined && assists !== undefined) {
      return `${kills}/${deaths}/${assists}`;
    }
    
    // Show other stats if KDA not available
    const statEntries = Object.entries(stats)
      .filter(([key, value]) => value !== null && value !== undefined)
      .slice(0, 3);
    
    if (statEntries.length === 0) return 'No stats';
    
    return statEntries
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const handleDelete = (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      onDeleteMatch(matchId);
    }
  };

  return (
    <div className="match-list">
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          <div className="match-card-content">
            {/* Win/Loss Indicator */}
            <div className={`result-indicator ${match.result}`}>
              {match.result === 'win' ? (
                <IconTrophy size={16} />
              ) : (
                <IconX size={16} />
              )}
            </div>
            
            {/* Game Info */}
            <div className="match-info">
              <div className="game-name">{match.games?.name || 'Unknown Game'}</div>
              <div className="match-date">{formatDate(match.match_date)}</div>
            </div>
            
            {/* Stats */}
            <div className="match-stats">
              {match.stats && Object.entries(match.stats)
                .filter(([key, value]) => value !== null && value !== undefined)
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="stat-box">
                    <div className="stat-label">{key.replace(/_/g, ' ')}</div>
                    <div className="stat-value">{value}</div>
                  </div>
                ))}
            </div>
            
            {/* Delete Button */}
            <button 
              className="delete-button"
              onClick={() => handleDelete(match.id)}
              title="Delete match"
            >
              <IconTrash size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;