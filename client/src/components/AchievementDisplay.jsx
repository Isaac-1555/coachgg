import React, { useState, useEffect } from 'react';
import { achievementService } from '../services/achievementService';
import '../styles/AchievementDisplay.css';

const AchievementDisplay = ({ userId }) => {
  const [achievementData, setAchievementData] = useState({
    achievements: [],
    stats: {},
    unlockedCount: 0,
    totalCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (userId) {
      loadAchievements();
    }
  }, [userId]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await achievementService.getAchievementsWithProgress(userId);
      setAchievementData(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return '#39FF14';
    if (progress >= 75) return '#FFFF3B';
    if (progress >= 50) return '#FF9B3B';
    if (progress >= 25) return '#9B30FF';
    return '#AAAAAA';
  };

  if (loading) {
    return (
      <div className="content-card">
        <div className="card-header">
          <h3>🏆 Achievements</h3>
          <p>Loading your achievements...</p>
        </div>
        <div className="card-content">
          <div className="achievement-loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  const { achievements, unlockedCount, totalCount } = achievementData;
  const recentAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 3);

  const displayAchievements = showAll ? achievements : recentAchievements;

  return (
    <div className="content-card">
      <div className="card-header">
        <h3>🏆 Achievements</h3>
        <p>
          {unlockedCount > 0 
            ? `${unlockedCount} of ${totalCount} unlocked`
            : 'Complete challenges to unlock achievements!'
          }
        </p>
      </div>
      <div className="card-content">
        {unlockedCount === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎖️</div>
            <h4>No achievements yet</h4>
            <p>Play matches and complete challenges to unlock achievements!</p>
          </div>
        ) : (
          <div className="achievements-container">
            <div className="achievement-stats">
              <div className="stat-item">
                <span className="stat-value">{unlockedCount}</span>
                <span className="stat-label">Unlocked</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Math.round((unlockedCount / totalCount) * 100)}%</span>
                <span className="stat-label">Complete</span>
              </div>
            </div>

            <div className="achievements-list">
              {displayAchievements.map((achievement, index) => (
                <div 
                  key={achievement.id} 
                  className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon" style={{ color: achievement.unlocked ? achievement.color : '#666' }}>
                    {achievement.icon}
                  </div>
                  <div className="achievement-info">
                    <div className="achievement-title">{achievement.title}</div>
                    <div className="achievement-description">{achievement.description}</div>
                    {achievement.unlocked ? (
                      <div className="achievement-unlocked">
                        Unlocked {formatDate(achievement.unlockedAt)}
                      </div>
                    ) : (
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${achievement.progress}%`,
                              backgroundColor: getProgressColor(achievement.progress)
                            }}
                          />
                        </div>
                        <span className="progress-text">{Math.round(achievement.progress)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!showAll && achievements.length > 3 && (
              <button 
                className="show-all-button"
                onClick={() => setShowAll(true)}
              >
                View All Achievements ({totalCount})
              </button>
            )}

            {showAll && (
              <button 
                className="show-all-button"
                onClick={() => setShowAll(false)}
              >
                Show Recent Only
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementDisplay;