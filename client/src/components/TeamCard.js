import React from 'react';
import '../styles/TeamCard.css';

const TeamCard = ({ team, isSelected, onClick, onLeave, currentUserId }) => {
  const isCaptain = team.captain_id === currentUserId;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleLeaveClick = (e) => {
    e.stopPropagation();
    
    if (isCaptain) {
      alert('As team captain, you cannot leave the team. Transfer captaincy first or delete the team.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to leave "${team.name}"?`)) {
      onLeave(team.id);
    }
  };

  return (
    <div 
      className={`team-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="team-card-header">
        <div className="team-info">
          <h4 className="team-name">{team.name}</h4>
          <div className="team-meta">
            <span className="captain-info">
              👑 {team.captain?.username || 'Unknown'}
            </span>
            {isCaptain && (
              <span className="captain-badge">Captain</span>
            )}
          </div>
        </div>
        
        {!isCaptain && (
          <button 
            className="leave-button"
            onClick={handleLeaveClick}
            title="Leave team"
          >
            🚪
          </button>
        )}
      </div>

      <div className="team-card-body">
        <div className="member-info">
          <span className="nickname">
            Playing as: <strong>{team.memberInfo?.nickname || 'Unknown'}</strong>
          </span>
        </div>
        
        <div className="join-date">
          Joined: {formatDate(team.memberInfo?.joined_at || team.created_at)}
        </div>
      </div>

      <div className="team-card-footer">
        <div className="team-id">
          <span className="id-label">Team ID:</span>
          <span className="id-value">{team.id.slice(0, 8)}...</span>
        </div>
        
        {isSelected && (
          <div className="selected-indicator">
            ✓ Selected
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;