import React, { useState } from 'react';
import { 
  IconInfoCircle, 
  IconCalendar, 
  IconRun, 
  IconDeviceGamepad2, 
  IconMessage, 
  IconChartBar 
} from '@tabler/icons-react';
import '../../styles/CreateEventModal.css';

const CreateEventModal = ({ onClose, onSubmit, team }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: ''
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

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.event_date) {
      newErrors.event_date = 'Event date is required';
    }

    if (!formData.event_time) {
      newErrors.event_time = 'Event time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`);
      
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        event_date: eventDateTime.toISOString()
      };

      const result = await onSubmit(eventData);
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || 'Failed to create event' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default date to today and time to current hour + 1
  React.useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaultDate = tomorrow.toISOString().split('T')[0];
    const defaultTime = `${String(now.getHours() + 1).padStart(2, '0')}:00`;
    
    setFormData(prev => ({
      ...prev,
      event_date: defaultDate,
      event_time: defaultTime
    }));
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule New Event</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Team Practice, Match vs Team Alpha"
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event_date">Date *</label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className={errors.event_date ? 'error' : ''}
              />
              {errors.event_date && <span className="error-text">{errors.event_date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="event_time">Time *</label>
              <input
                type="time"
                id="event_time"
                name="event_time"
                value={formData.event_time}
                onChange={handleInputChange}
                className={errors.event_time ? 'error' : ''}
              />
              {errors.event_time && <span className="error-text">{errors.event_time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about the event, objectives, or special instructions..."
              rows={4}
              maxLength={500}
            />
            <small className="field-hint">
              {500 - formData.description.length} characters remaining
            </small>
          </div>

          <div className="event-types">
            <h4><IconCalendar size={16} /> Common Event Types</h4>
            <div className="event-type-buttons">
              <button 
                type="button"
                className="event-type-button"
                onClick={() => setFormData(prev => ({ ...prev, title: 'Team Practice' }))}
              >
                <IconRun size={16} /> Practice
              </button>
              <button 
                type="button"
                className="event-type-button"
                onClick={() => setFormData(prev => ({ ...prev, title: 'Competitive Match' }))}
              >
                <IconDeviceGamepad2 size={16} /> Match
              </button>
              <button 
                type="button"
                className="event-type-button"
                onClick={() => setFormData(prev => ({ ...prev, title: 'Team Meeting' }))}
              >
                <IconMessage size={16} /> Meeting
              </button>
              <button 
                type="button"
                className="event-type-button"
                onClick={() => setFormData(prev => ({ ...prev, title: 'Strategy Review' }))}
              >
                <IconChartBar size={16} /> Review
              </button>
            </div>
          </div>

          {team && (
            <div className="team-info">
              <p><IconInfoCircle size={16} /> Scheduling for team: <strong>{team.name}</strong></p>
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
              {isSubmitting ? 'Scheduling...' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;