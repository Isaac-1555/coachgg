import React from 'react';
import '../../styles/Overview.css';

const Overview = ({ user }) => {
  return (
    <div className="overview">
      <div className="overview-header">
        <h1>Welcome back, {user.username}!</h1>
        <p>Ready to level up your game today?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Matches</p>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-icon">🎮</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Win Rate</p>
              <p className="stat-value">0%</p>
            </div>
            <div className="stat-icon">🏆</div>
          </div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: '0%' }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Current Streak</p>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-icon">📈</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Hours Played</p>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-icon">⏰</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Recent Matches */}
        <div className="content-card">
          <div className="card-header">
            <h3>🎮 Recent Matches</h3>
            <p>Your latest gaming sessions</p>
          </div>
          <div className="card-content">
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h4>No matches yet</h4>
              <p>Start tracking your games to see your progress here!</p>
              <button className="cta-button">Add Your First Match</button>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="content-card">
          <div className="card-header">
            <h3>🏆 Recent Achievements</h3>
            <p>Your latest unlocks and milestones</p>
          </div>
          <div className="card-content">
            <div className="empty-state">
              <div className="empty-icon">🎖️</div>
              <h4>No achievements yet</h4>
              <p>Play matches and complete challenges to unlock achievements!</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Suggestion */}
      <div className="ai-coach-card">
        <div className="ai-coach-content">
          <div className="ai-coach-icon">
            <span>🤖</span>
          </div>
          <div className="ai-coach-text">
            <h3>AI Coach Insight</h3>
            <p>
              Welcome to CoachGG! Start by adding your first match to get personalized 
              insights and recommendations to improve your gameplay.
            </p>
            <button className="ai-coach-button">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;