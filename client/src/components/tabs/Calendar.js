import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconCalendarEvent,
  IconClock,
  IconUsers,
  IconMapPin
} from '@tabler/icons-react';
import '../../styles/CalendarTab.css';

const CalendarTab = ({ user }) => {
  const { user: authUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    if (authUser?.id) {
      fetchUserTeamsAndEvents();
    }
  }, [authUser?.id]);

  const fetchUserTeamsAndEvents = async () => {
    try {
      setLoading(true);

      // Get team memberships first (simple query)
      const { data: membershipData, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', authUser.id);

      if (membershipError) {
        console.error('Error fetching team memberships:', membershipError);
        setUserTeams([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      if (!membershipData || membershipData.length === 0) {
        console.log('No team memberships found');
        setUserTeams([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      // Get team details separately
      const teamIds = membershipData.map(m => m.team_id);
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name')
        .in('id', teamIds);

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        setUserTeams([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      const teams = teamsData || [];
      console.log('User teams:', teams); // Debug log
      setUserTeams(teams);

      if (teams.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      console.log('Team IDs for events:', teamIds); // Debug log

      // Fetch calendar events for user's teams
      const { data: eventsData, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .in('team_id', teamIds)
        .order('event_date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setEvents([]);
        return;
      }

      console.log('Events data:', eventsData); // Debug log
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error in fetchUserTeamsAndEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return events.filter(event => {
      // Convert event date to local date string
      const eventDate = new Date(event.event_date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
      const eventDay = String(eventDate.getDate()).padStart(2, '0');
      const eventDateString = `${eventYear}-${eventMonth}-${eventDay}`;
      
      return eventDateString === dateString;
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday(date) ? 'today' : ''} ${isPastDate(date) ? 'past' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <span className="day-number">{day}</span>
          {dayEvents.length > 0 && (
            <div className="event-indicators">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div key={event.id} className="event-dot" title={event.title}></div>
              ))}
              {dayEvents.length > 3 && (
                <div className="event-more">+{dayEvents.length - 3}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.event_date) >= now)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, 5);
  };

  const getTeamName = (teamId) => {
    const team = userTeams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  if (loading) {
    return (
      <div className="calendar-tab loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-tab">
      <div className="calendar-header">
        <div className="header-content">
          <h1>Team Calendar</h1>
          <p>View scheduled events from your team managers</p>
        </div>
      </div>

      {userTeams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Teams Found</h3>
          <p>Join a team to see scheduled events and activities!</p>
        </div>
      ) : (
        <div className="calendar-content">
          <div className="calendar-main">
            {/* Calendar Navigation */}
            <div className="calendar-nav">
              <button onClick={() => navigateMonth(-1)} className="nav-button">
                <IconChevronLeft size={20} />
              </button>
              <h2 className="current-month">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={() => navigateMonth(1)} className="nav-button">
                <IconChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-container">
              <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="calendar-grid">
                {renderCalendarGrid()}
              </div>
            </div>
          </div>

          <div className="calendar-sidebar">
            {/* Selected Date Events */}
            {selectedDate && (
              <div className="selected-date-events">
                <h3>{formatDate(selectedDate)}</h3>
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="events-list">
                    {getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="event-item">
                        <div className="event-time">
                          <IconClock size={16} />
                          {formatTime(event.event_date)}
                        </div>
                        <div className="event-details">
                          <h4>{event.title}</h4>
                          <p>{event.description}</p>
                          <div className="event-meta">
                            <span className="event-team">
                              <IconUsers size={14} />
                              {getTeamName(event.team_id)}
                            </span>
                            {event.location && (
                              <span className="event-location">
                                <IconMapPin size={14} />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-events">No events scheduled for this date</p>
                )}
              </div>
            )}

            {/* Upcoming Events */}
            <div className="upcoming-events">
              <h3>Upcoming Events</h3>
              {getUpcomingEvents().length > 0 ? (
                <div className="events-list">
                  {getUpcomingEvents().map(event => (
                    <div key={event.id} className="event-item upcoming">
                      <div className="event-date">
                        <IconCalendarEvent size={16} />
                        {new Date(event.event_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="event-details">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <div className="event-meta">
                          <span className="event-team">
                            <IconUsers size={14} />
                            {getTeamName(event.team_id)}
                          </span>
                          <span className="event-time">
                            <IconClock size={14} />
                            {formatTime(event.event_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-events">No upcoming events</p>
              )}
            </div>

            {/* Team Info */}
            <div className="team-info">
              <h3>Your Teams</h3>
              <div className="teams-list">
                {userTeams.map(team => (
                  <div key={team.id} className="team-item">
                    <h4>{team.name}</h4>
                    <p>Team ID: {team.id}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;