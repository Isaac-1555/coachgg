import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { achievementService } from '../services/achievementService';
import AchievementNotification from './AchievementNotification.jsx';

const AchievementManager = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    // Add achievement listener
    const handleNewAchievement = (achievement) => {
      setNotifications(prev => [...prev, { ...achievement, id: Date.now() }]);
    };

    achievementService.addListener(handleNewAchievement);

    // Initial achievement check
    achievementService.checkAchievements(user.id);

    return () => {
      achievementService.removeListener(handleNewAchievement);
    };
  }, [user?.id]);

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="achievement-manager">
      {notifications.map((notification) => (
        <AchievementNotification
          key={notification.id}
          achievement={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default AchievementManager;