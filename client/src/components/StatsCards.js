import React from 'react';
import '../styles/StatsCards.css';

const StatsCards = ({ stats }) => {
  const {
    totalMatches,
    wins,
    losses,
    winRate,
    currentStreak,
    bestStreak
  } = stats;

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <p className="stat-label">Total Matches</p>
            <p className="stat-value">{totalMatches}</p>
          </div>
          <div className="stat-icon">🎮</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <p className="stat-label">Win Rate</p>
            <p className="stat-value">{winRate}%</p>
          </div>
          <div className="stat-icon">🏆</div>
        </div>
        <div className="stat-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${winRate}%` }}
          ></div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <p className="stat-label">Wins / Losses</p>
            <p className="stat-value">{wins} / {losses}</p>
          </div>
          <div className="stat-icon">📊</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <p className="stat-label">Current Streak</p>
            <p className="stat-value">{currentStreak}</p>
          </div>
          <div className="stat-icon">🔥</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <p className="stat-label">Best Streak</p>
            <p className="stat-value">{bestStreak}</p>
          </div>
          <div className="stat-icon">⭐</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;