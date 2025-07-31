import React, { useState } from 'react';
import FileUpload from '../FileUpload.jsx';
import '../../styles/AddMatchModal.css';

const AddMatchModal = ({ games, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    game_id: '',
    result: '',
    match_date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
    screenshot_url: '',
    stats: {
      kills: '',
      deaths: '',
      assists: '',
      duration: '',
      score: ''
    }
  });
  const [customStats, setCustomStats] = useState([]);
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

  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: value
      }
    }));
  };

  const addCustomStat = () => {
    setCustomStats(prev => [...prev, { key: '', value: '' }]);
  };

  const updateCustomStat = (index, field, value) => {
    setCustomStats(prev => 
      prev.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    );
  };

  const removeCustomStat = (index) => {
    setCustomStats(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.game_id) {
      newErrors.game_id = 'Please select a game';
    }

    if (!formData.result) {
      newErrors.result = 'Please select a result';
    }

    if (!formData.match_date) {
      newErrors.match_date = 'Please select a date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare stats object
      const stats = { ...formData.stats };
      
      // Convert numeric fields
      ['kills', 'deaths', 'assists', 'duration', 'score'].forEach(field => {
        if (stats[field] && stats[field] !== '') {
          const num = parseInt(stats[field]);
          if (!isNaN(num)) {
            stats[field] = num;
          } else {
            delete stats[field];
          }
        } else {
          delete stats[field];
        }
      });

      // Add custom stats
      customStats.forEach(({ key, value }) => {
        if (key && value) {
          const numValue = parseInt(value);
          stats[key] = !isNaN(numValue) ? numValue : value;
        }
      });

      const matchData = {
        game_id: formData.game_id,
        result: formData.result,
        match_date: formData.match_date,
        screenshot_url: formData.screenshot_url,
        stats: Object.keys(stats).length > 0 ? stats : null
      };

      const result = await onSubmit(matchData);
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || 'Failed to add match' });
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
          <h2>Add New Match</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-match-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="game_id">Game *</label>
              <select
                id="game_id"
                name="game_id"
                value={formData.game_id}
                onChange={handleInputChange}
                className={errors.game_id ? 'error' : ''}
              >
                <option value="">Select a game</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
              {errors.game_id && <span className="error-text">{errors.game_id}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="result">Result *</label>
              <select
                id="result"
                name="result"
                value={formData.result}
                onChange={handleInputChange}
                className={errors.result ? 'error' : ''}
              >
                <option value="">Select result</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="draw">Draw</option>
              </select>
              {errors.result && <span className="error-text">{errors.result}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="match_date">Date & Time *</label>
            <input
              type="datetime-local"
              id="match_date"
              name="match_date"
              value={formData.match_date}
              onChange={handleInputChange}
              className={errors.match_date ? 'error' : ''}
            />
            {errors.match_date && <span className="error-text">{errors.match_date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="screenshot_url">Match Screenshot (Optional)</label>
            <FileUpload
              currentImageUrl={formData.screenshot_url}
              onUploadComplete={(url) => {
                setFormData(prev => ({
                  ...prev,
                  screenshot_url: url || ''
                }));
              }}
              onUploadError={(error) => {
                console.error('Screenshot upload error:', error);
                setErrors(prev => ({
                  ...prev,
                  screenshot: 'Failed to upload screenshot. Please try again.'
                }));
              }}
              bucketName="match-screenshots"
              className="screenshot-upload"
              placeholder="Upload Screenshot"
              maxSizeBytes={5 * 1024 * 1024} // 5MB for screenshots
            />
            <small className="form-help">Upload a match screenshot (max 5MB, JPG/PNG/GIF/WebP)</small>
            {errors.screenshot && <span className="error-text">{errors.screenshot}</span>}
          </div>

          <div className="stats-section">
            <h3>Match Statistics</h3>
            <p>Add your performance stats (optional)</p>

            <div className="stats-grid">
              <div className="form-group">
                <label htmlFor="kills">Kills</label>
                <input
                  type="number"
                  id="kills"
                  name="kills"
                  value={formData.stats.kills}
                  onChange={handleStatsChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deaths">Deaths</label>
                <input
                  type="number"
                  id="deaths"
                  name="deaths"
                  value={formData.stats.deaths}
                  onChange={handleStatsChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assists">Assists</label>
                <input
                  type="number"
                  id="assists"
                  name="assists"
                  value={formData.stats.assists}
                  onChange={handleStatsChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="score">Score</label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  value={formData.stats.score}
                  onChange={handleStatsChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.stats.duration}
                  onChange={handleStatsChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Custom Stats */}
            <div className="custom-stats">
              <div className="custom-stats-header">
                <h4>Custom Statistics</h4>
                <button 
                  type="button" 
                  className="add-stat-button"
                  onClick={addCustomStat}
                >
                  + Add Stat
                </button>
              </div>

              {customStats.map((stat, index) => (
                <div key={index} className="custom-stat-row">
                  <input
                    type="text"
                    placeholder="Stat name"
                    value={stat.key}
                    onChange={(e) => updateCustomStat(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={stat.value}
                    onChange={(e) => updateCustomStat(index, 'value', e.target.value)}
                  />
                  <button 
                    type="button"
                    className="remove-stat-button"
                    onClick={() => removeCustomStat(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
              {isSubmitting ? 'Adding...' : 'Add Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMatchModal;