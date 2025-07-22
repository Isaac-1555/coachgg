import React from 'react';
import '../styles/CoachingNotes.css';

const CoachingNotes = ({ notes, team, players }) => {
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

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.user_id === playerId);
    return player ? player.users.username : 'Unknown Player';
  };

  const getNoteTypeIcon = (type) => {
    switch (type) {
      case 'improvement': return '📈';
      case 'issue': return '⚠️';
      case 'achievement': return '🏆';
      case 'strategy': return '🎯';
      case 'general': return '📝';
      default: return '📝';
    }
  };

  const getNoteTypeColor = (type) => {
    switch (type) {
      case 'improvement': return '#39FF14';
      case 'issue': return '#EF4444';
      case 'achievement': return '#FFD700';
      case 'strategy': return '#9B30FF';
      case 'general': return '#6B7280';
      default: return '#6B7280';
    }
  };

  if (notes.length === 0) {
    return (
      <div className="coaching-notes-empty">
        <div className="empty-icon">📝</div>
        <h3>No coaching notes yet</h3>
        <p>Start adding notes to track player progress, strategies, and important observations.</p>
      </div>
    );
  }

  return (
    <div className="coaching-notes">
      <div className="notes-header">
        <h3>Coaching Notes</h3>
        <p>Track player progress and team observations</p>
      </div>

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-item">
            <div className="note-header">
              <div className="note-type">
                <span 
                  className="type-icon"
                  style={{ color: getNoteTypeColor(note.type) }}
                >
                  {getNoteTypeIcon(note.type)}
                </span>
                <span className="type-label">{note.type}</span>
              </div>
              
              <div className="note-meta">
                <span className="note-date">{formatDate(note.created_at)}</span>
                {note.player_id && (
                  <span className="note-player">
                    👤 {getPlayerName(note.player_id)}
                  </span>
                )}
              </div>
            </div>

            <div className="note-content">
              <h4 className="note-title">{note.title}</h4>
              <p className="note-description">{note.content}</p>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="note-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachingNotes;