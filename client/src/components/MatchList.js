import React from 'react';
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
        <div key={match.id} className="match-item">
          <div className="match-main">
            <div className="match-result">
              <div className={`result-indicator ${match.result}`}>
                {match.result === 'win' ? '✓' : match.result === 'loss' ? '✗' : '−'}
              </div>
            </div>
            
            <div className="match-info">
              <div className="match-game">
                <h4>{match.games?.name || 'Unknown Game'}</h4>
                <span className={`result-text ${match.result}`}>
                  {match.result.toUpperCase()}
                </span>
              </div>
              <div className="match-stats">
                <span className="stats-text">{formatStats(match.stats)}</span>
              </div>
            </div>
            
            <div className="match-meta">
              <div className="match-date">
                {formatDate(match.match_date)}
              </div>
              <button 
                className="delete-button"
                onClick={() => handleDelete(match.id)}
                title="Delete match"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {match.stats && Object.keys(match.stats).length > 3 && (
            <div className="match-details">
              <div className="stats-grid">
                {Object.entries(match.stats)
                  .filter(([key, value]) => value !== null && value !== undefined)
                  .map(([key, value]) => (
                    <div key={key} className="stat-item">
                      <span className="stat-key">{key.replace(/_/g, ' ')}</span>
                      <span className="stat-value">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MatchList;