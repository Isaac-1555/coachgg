import React, { useState } from 'react';
import '../../styles/CreateTeamModal.css';

const CreateTeamModal = ({ onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: currentUser.username
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Team name must be less than 50 characters';
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Your team nickname is required';
    } else if (formData.nickname.trim().length < 2) {
      newErrors.nickname = 'Nickname must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await onSubmit({
        name: formData.name.trim(),
        nickname: formData.nickname.trim()
      });
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || 'Failed to create team' });
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
          <h2>Create New Team</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-team-form">
          <div className="form-group">
            <label htmlFor="name">Team Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter team name"
              className={errors.name ? 'error' : ''}
              maxLength={50}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nickname">Your Team Nickname *</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="How you'll appear in this team"
              className={errors.nickname ? 'error' : ''}
              maxLength={30}
            />
            {errors.nickname && <span className="error-text">{errors.nickname}</span>}
            <small className="field-hint">
              This is how your name will appear to other team members
            </small>
          </div>

          <div className="info-box">
            <h4>📋 Team Creation Info</h4>
            <ul>
              <li>You will be the team captain</li>
              <li>You can invite players using the team ID</li>
              <li>Team captains can manage members and settings</li>
              <li>Team matches will be tracked separately from solo matches</li>
            </ul>
          </div>

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
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;