import React, { useState, useEffect } from 'react';
import '../styles/AchievementNotification.css';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!achievement) return null;

  return (
    <div className={`achievement-notification ${isVisible ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}>
      <div className="achievement-content">
        <div className="achievement-header">
          <div className="achievement-icon" style={{ color: achievement.color }}>
            {achievement.icon}
          </div>
          <div className="achievement-text">
            <div className="achievement-title">Achievement Unlocked!</div>
            <div className="achievement-name">{achievement.title}</div>
            <div className="achievement-description">{achievement.description}</div>
          </div>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="achievement-glow" style={{ backgroundColor: achievement.color }}></div>
      </div>
      
      <div className="achievement-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              '--delay': `${i * 0.1}s`,
              '--color': achievement.color 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementNotification;