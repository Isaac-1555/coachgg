import React, { useState } from 'react';
import '../../styles/AddNoteModal.css';

const AddNoteModal = ({ onClose, onSubmit, team, players }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    player_id: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const noteTypes = [
    { value: 'general', label: 'General Note', icon: '📝' },
    { value: 'improvement', label: 'Improvement', icon: '📈' },
    { value: 'issue', label: 'Issue/Concern', icon: '⚠️' },
    { value: 'achievement', label: 'Achievement', icon: '🏆' },
    { value: 'strategy', label: 'Strategy', icon: '🎯' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Note title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Note content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        player_id: formData.player_id || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      const result = await onSubmit(noteData);
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || 'Failed to add note' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Coaching Note</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-note-form">
          <div className="form-group">
            <label htmlFor="title">Note Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Improved aim accuracy, Strategy discussion"
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Note Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                {noteTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="player_id">Specific Player (Optional)</label>
              <select
                id="player_id"
                name="player_id"
                value={formData.player_id}
                onChange={handleInputChange}
              >
                <option value="">All team members</option>
                {players.map(player => (
                  <option key={player.user_id} value={player.user_id}>
                    {player.users.username}
                    {player.nickname && player.nickname !== player.users.username && 
                      ` (${player.nickname})`
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Note Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Describe the observation, feedback, or strategy in detail..."
              rows={6}
              className={errors.content ? 'error' : ''}
              maxLength={1000}
            />
            {errors.content && <span className="error-text">{errors.content}</span>}
            <small className="field-hint">
              {1000 - formData.content.length} characters remaining
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (Optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., aim, strategy, teamwork (separate with commas)"
              maxLength={200}
            />
            <small className="field-hint">
              Separate tags with commas to help organize your notes
            </small>
          </div>

          <div className="note-templates">
            <h4>📝 Quick Templates</h4>
            <div className="template-buttons">
              <button 
                type="button"
                className="template-button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  title: 'Practice Session Review',
                  content: 'Today\'s practice focused on...\n\nStrengths observed:\n- \n\nAreas for improvement:\n- \n\nNext session goals:\n- ',
                  type: 'general'
                }))}
              >
                🏃 Practice Review
              </button>
              <button 
                type="button"
                className="template-button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  title: 'Player Improvement',
                  content: 'Noticed significant improvement in...\n\nSpecific examples:\n- \n\nRecommendations to maintain progress:\n- ',
                  type: 'improvement'
                }))}
              >
                📈 Improvement
              </button>
              <button 
                type="button"
                className="template-button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  title: 'Strategy Discussion',
                  content: 'Strategy topic: \n\nKey points discussed:\n- \n\nAction items:\n- \n\nNext review date: ',
                  type: 'strategy'
                }))}
              >
                🎯 Strategy
              </button>
            </div>
          </div>

          {team && (
            <div className="team-info">
              <p>📋 Adding note for team: <strong>{team.name}</strong></p>
            </div>
          )}

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;