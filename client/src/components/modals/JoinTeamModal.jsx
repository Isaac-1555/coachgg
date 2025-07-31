import React, { useState } from 'react';
import { IconLink } from '@tabler/icons-react';
import '../../styles/JoinTeamModal.css';

const JoinTeamModal = ({ onClose, onSubmit }) => {
  const [teamCode, setTeamCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTeamCode(value);
    
    // Clear error when user starts typing
    if (errors.teamCode) {
      setErrors(prev => ({
        ...prev,
        teamCode: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!teamCode.trim()) {
      newErrors.teamCode = 'Team ID is required';
    } else if (teamCode.trim().length < 10) {
      newErrors.teamCode = 'Team ID must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await onSubmit(teamCode.trim());
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || 'Failed to join team' });
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
          <h2>Join Team</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="join-team-form">
          <div className="form-group">
            <label htmlFor="teamCode">Team ID *</label>
            <input
              type="text"
              id="teamCode"
              name="teamCode"
              value={teamCode}
              onChange={handleInputChange}
              placeholder="Paste team ID here"
              className={errors.teamCode ? 'error' : ''}
            />
            {errors.teamCode && <span className="error-text">{errors.teamCode}</span>}
          </div>

          <div className="info-box">
            <h4><IconLink size={16} /> How to Join a Team</h4>
            <ul>
              <li>Get the team ID from your team captain</li>
              <li>Paste the complete team ID in the field above</li>
              <li>You'll be added as a team member</li>
              <li>You can leave the team anytime (except if you're captain)</li>
            </ul>
          </div>

          <div className="example-box">
            <h4>📝 Example Team ID</h4>
            <code>a1b2c3d4-e5f6-7890-abcd-ef1234567890</code>
            <p>Team IDs are long unique identifiers like the example above</p>
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
              {isSubmitting ? 'Joining...' : 'Join Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinTeamModal;