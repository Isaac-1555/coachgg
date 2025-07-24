import React, { useState } from 'react';
import { IconList } from '@tabler/icons-react';
import '../styles/Calendar.css';

const Calendar = ({ events, onDeleteEvent, managerId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'list'

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return formatDate(dateString);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.event_date) >= now)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, 5);
  };

  const getPastEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.event_date) < now)
      .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
      .slice(0, 10);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent(eventId);
    }
  };

  const getEventTypeIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('practice')) return '🏃';
    if (lowerTitle.includes('match') || lowerTitle.includes('game')) return '🎮';
    if (lowerTitle.includes('meeting')) return '💬';
    if (lowerTitle.includes('tournament')) return '🏆';
    if (lowerTitle.includes('review')) return '📊';
    return '📅';
  };

  const getEventPriority = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffHours = (eventDate - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'past';
    if (diffHours < 24) return 'urgent';
    if (diffHours < 72) return 'soon';
    return 'future';
  };

  if (events.length === 0) {
    return (
      <div className="calendar-empty">
        <div className="empty-icon">📅</div>
        <h3>No events scheduled</h3>
        <p>Schedule practice sessions, matches, and team meetings to keep your team organized.</p>
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="view-controls">
          <button 
            className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            📅 Month View
          </button>
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <IconList size={16} /> List View
          </button>
        </div>
        
        <div className="calendar-stats">
          <span className="stat">
            {getUpcomingEvents().length} upcoming
          </span>
          <span className="stat">
            {events.length} total events
          </span>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="calendar-list">
          {/* Upcoming Events */}
          <div className="events-section">
            <h3>🔜 Upcoming Events</h3>
            {getUpcomingEvents().length === 0 ? (
              <div className="no-events">No upcoming events</div>
            ) : (
              <div className="events-list">
                {getUpcomingEvents().map(event => (
                  <div 
                    key={event.id} 
                    className={`event-item ${getEventPriority(event.event_date)}`}
                  >
                    <div className="event-main">
                      <div className="event-icon">
                        {getEventTypeIcon(event.title)}
                      </div>
                      
                      <div className="event-info">
                        <h4 className="event-title">{event.title}</h4>
                        {event.description && (
                          <p className="event-description">{event.description}</p>
                        )}
                        <div className="event-meta">
                          <span className="event-date">
                            {formatDateTime(event.event_date)}
                          </span>
                          <span className="event-time">
                            {formatTime(event.event_date)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="event-actions">
                        <button 
                          className="delete-event-button"
                          onClick={() => handleDeleteEvent(event.id)}
                          title="Delete event"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Events */}
          {getPastEvents().length > 0 && (
            <div className="events-section">
              <h3>📚 Recent Events</h3>
              <div className="events-list">
                {getPastEvents().map(event => (
                  <div 
                    key={event.id} 
                    className="event-item past"
                  >
                    <div className="event-main">
                      <div className="event-icon">
                        {getEventTypeIcon(event.title)}
                      </div>
                      
                      <div className="event-info">
                        <h4 className="event-title">{event.title}</h4>
                        {event.description && (
                          <p className="event-description">{event.description}</p>
                        )}
                        <div className="event-meta">
                          <span className="event-date">
                            {formatDateTime(event.event_date)}
                          </span>
                          <span className="event-time">
                            {formatTime(event.event_date)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="event-actions">
                        <button 
                          className="delete-event-button"
                          onClick={() => handleDeleteEvent(event.id)}
                          title="Delete event"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="calendar-month">
          <div className="month-header">
            <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <p>Month view coming soon - showing list view for now</p>
          </div>
          
          {/* For now, show the same list view */}
          <div className="events-list">
            {events
              .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
              .map(event => (
                <div 
                  key={event.id} 
                  className={`event-item ${getEventPriority(event.event_date)}`}
                >
                  <div className="event-main">
                    <div className="event-icon">
                      {getEventTypeIcon(event.title)}
                    </div>
                    
                    <div className="event-info">
                      <h4 className="event-title">{event.title}</h4>
                      {event.description && (
                        <p className="event-description">{event.description}</p>
                      )}
                      <div className="event-meta">
                        <span className="event-date">
                          {formatDate(event.event_date)}
                        </span>
                        <span className="event-time">
                          {formatTime(event.event_date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="event-actions">
                      <button 
                        className="delete-event-button"
                        onClick={() => handleDeleteEvent(event.id)}
                        title="Delete event"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;