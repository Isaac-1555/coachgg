import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { openRouterService } from '../../config/openrouter';
import { achievementService } from '../../services/achievementService';
import '../../styles/AICoach.css';

const AICoach = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [aiInsights, setAiInsights] = useState({
    performanceAnalysis: null,
    trendAnalysis: null,
    goalSuggestions: null
  });
  const [loading, setLoading] = useState(true);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user matches
      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          *,
          games (
            name,
            description
          )
        `)
        .eq('player_id', user.id)
        .order('match_date', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(matchesData || []);
      calculateStats(matchesData || []);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (matchesData) => {
    const totalMatches = matchesData.length;
    const wins = matchesData.filter(match => match.result === 'win').length;
    const losses = matchesData.filter(match => match.result === 'loss').length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastResult = null;

    for (const match of matchesData) {
      if (match.result === 'win') {
        if (lastResult === 'win' || lastResult === null) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        if (lastResult === null) {
          currentStreak = tempStreak;
        }
      } else {
        if (lastResult === null) {
          currentStreak = 0;
        }
        tempStreak = 0;
      }
      
      bestStreak = Math.max(bestStreak, tempStreak);
      lastResult = match.result;
    }

    setStats({
      totalMatches,
      wins,
      losses,
      winRate,
      currentStreak,
      bestStreak
    });
  };

  const generateAIInsights = async () => {
    if (matches.length === 0) {
      alert('No matches found. Add some matches to get AI coaching insights!');
      return;
    }

    try {
      setGeneratingInsights(true);
      const insights = {};

      // Generate performance analysis (overview of recent performance)
      if (matches.length > 0) {
        insights.performanceAnalysis = await openRouterService.analyzePerformanceTrend(matches.slice(0, 5));
      }

      // Generate trend analysis
      if (matches.length >= 3) {
        insights.trendAnalysis = await openRouterService.analyzePerformanceTrend(matches);
      }

      // Generate goal suggestions
      insights.goalSuggestions = await openRouterService.generateGoalSuggestions(stats);

      setAiInsights(insights);
      
      // Track AI analysis usage for achievements
      achievementService.trackAiAnalysis(user.id);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      alert('Failed to generate AI insights. Please check your OpenRouter API configuration.');
    } finally {
      setGeneratingInsights(false);
    }
  };

  const analyzeSpecificMatch = async (match) => {
    try {
      setGeneratingInsights(true);
      
      // Clear previous specific match analysis
      setAiInsights(prev => ({
        ...prev,
        specificMatch: null
      }));
      
      // Switch to specific analysis tab immediately
      setSelectedAnalysis('specific');
      
      const analysis = await openRouterService.analyzeMatch(match, stats);
      
      // Update the specific match analysis
      setAiInsights(prev => ({
        ...prev,
        specificMatch: {
          matchId: match.id,
          matchData: match,
          analysis
        }
      }));
      
    } catch (error) {
      console.error('Error analyzing specific match:', error);
      alert('Failed to analyze match. Please try again.');
      // Reset to matches tab on error
      setSelectedAnalysis('matches');
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-coach loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading AI Coach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-coach">
      <div className="ai-coach-header">
        <div className="header-content">
          <h1>🤖 AI Coach</h1>
          <p>Get personalized insights and coaching recommendations powered by AI</p>
        </div>
        <button 
          className="add-match-button"
          onClick={generateAIInsights}
          disabled={generatingInsights || matches.length === 0}
        >
          {generatingInsights ? (
            <>
              <span className="button-spinner"></span>
              Analyzing...
            </>
          ) : (
            'Generate AI Insights'
          )}
        </button>
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <h2>Performance Overview</h2>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-value">{stats.totalMatches}</span>
            <span className="stat-label">Total Matches</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{stats.winRate}%</span>
            <span className="stat-label">Win Rate</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Current Streak</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{stats.bestStreak}</span>
            <span className="stat-label">Best Streak</span>
          </div>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="analysis-tabs">
        <button 
          className={`tab ${selectedAnalysis === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedAnalysis('overview')}
        >
          📊 Overview Analysis
        </button>
        <button 
          className={`tab ${selectedAnalysis === 'trends' ? 'active' : ''}`}
          onClick={() => setSelectedAnalysis('trends')}
        >
          📈 Trend Analysis
        </button>
        <button 
          className={`tab ${selectedAnalysis === 'goals' ? 'active' : ''}`}
          onClick={() => setSelectedAnalysis('goals')}
        >
          🎯 Goal Suggestions
        </button>
        <button 
          className={`tab ${selectedAnalysis === 'matches' ? 'active' : ''}`}
          onClick={() => setSelectedAnalysis('matches')}
        >
          🎮 Match Analysis
        </button>
      </div>

      {/* Analysis Content */}
      <div className="analysis-content">
        {selectedAnalysis === 'overview' && (
          <div className="analysis-section">
            <h3>Performance Analysis</h3>
            {aiInsights.performanceAnalysis ? (
              <div className="ai-insight">
                <div className="insight-content">
                  {aiInsights.performanceAnalysis}
                </div>
              </div>
            ) : (
              <div className="no-insights">
                <p>Click "Generate AI Insights" to get personalized performance analysis!</p>
              </div>
            )}
          </div>
        )}

        {selectedAnalysis === 'trends' && (
          <div className="analysis-section">
            <h3>Trend Analysis</h3>
            {aiInsights.trendAnalysis ? (
              <div className="ai-insight">
                <div className="insight-content">
                  {aiInsights.trendAnalysis}
                </div>
              </div>
            ) : (
              <div className="no-insights">
                <p>Need at least 3 matches for trend analysis. {matches.length < 3 ? `Add ${3 - matches.length} more matches!` : 'Click "Generate AI Insights" to analyze trends!'}</p>
              </div>
            )}
          </div>
        )}

        {selectedAnalysis === 'goals' && (
          <div className="analysis-section">
            <h3>Personalized Goals</h3>
            {aiInsights.goalSuggestions ? (
              <div className="ai-insight">
                <div className="insight-content">
                  {aiInsights.goalSuggestions}
                </div>
              </div>
            ) : (
              <div className="no-insights">
                <p>Get AI-generated improvement goals based on your performance!</p>
              </div>
            )}
          </div>
        )}

        {selectedAnalysis === 'matches' && (
          <div className="analysis-section">
            <h3>Individual Match Analysis</h3>
            {matches.length === 0 ? (
              <div className="no-insights">
                <p>No matches available for analysis. Add some matches first!</p>
              </div>
            ) : (
              <div className="matches-list">
                <p>Click on any match to get AI analysis:</p>
                {matches.slice(0, 10).map(match => (
                  <div 
                    key={match.id} 
                    className={`match-item ${generatingInsights ? 'disabled' : ''}`} 
                    onClick={() => !generatingInsights && analyzeSpecificMatch(match)}
                  >
                    <div className="match-info">
                      <span className="match-game">{match.games?.name || 'Unknown Game'}</span>
                      <span className={`match-result ${match.result}`}>
                        {match.result.toUpperCase()}
                      </span>
                      <span className="match-date">
                        {new Date(match.match_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="analyze-button">
                      {generatingInsights ? '⏳ Analyzing...' : '🔍 Analyze'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedAnalysis === 'specific' && (
          <div className="analysis-section">
            <h3>Match Analysis</h3>
            {generatingInsights ? (
              <div className="ai-insight">
                <div className="insight-loading">
                  <div className="spinner"></div>
                  <p>Analyzing match performance...</p>
                </div>
              </div>
            ) : aiInsights.specificMatch ? (
              <div className="specific-match-analysis">
                <div className="match-header">
                  <h4>
                    {aiInsights.specificMatch.matchData?.games?.name || 'Unknown Game'} - 
                    <span className={`result ${aiInsights.specificMatch.matchData?.result}`}>
                      {aiInsights.specificMatch.matchData?.result?.toUpperCase()}
                    </span>
                  </h4>
                  <button 
                    className="back-button"
                    onClick={() => setSelectedAnalysis('matches')}
                  >
                    ← Back to Matches
                  </button>
                </div>
                <div className="ai-insight">
                  <div className="insight-content">
                    {aiInsights.specificMatch.analysis}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-insights">
                <p>No match analysis available. Go back and select a match to analyze.</p>
                <button 
                  className="back-button"
                  onClick={() => setSelectedAnalysis('matches')}
                >
                  ← Back to Matches
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;