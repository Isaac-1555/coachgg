import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import EnhancedWinRateChart from '../charts/EnhancedWinRateChart';
import PerformanceHeatmap from '../charts/PerformanceHeatmap';
import SkillRadarChart from '../charts/SkillRadarChart';
import { 
  IconChartBar, 
  IconCalendarTime, 
  IconTarget,
  IconTrendingUp,
  IconZoom,
  IconDownload
} from '@tabler/icons-react';
import '../../styles/AdvancedCharts.css';
import '../../styles/Charts.css';

const AdvancedCharts = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('enhanced-winrate');

  useEffect(() => {
    if (user?.id) {
      fetchUserMatches();
    }
  }, [user?.id]);

  const fetchUserMatches = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          games (
            id,
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

      setMatches(data || []);
    } catch (error) {
      console.error('Error in fetchUserMatches:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartTabs = [
    {
      id: 'enhanced-winrate',
      label: 'Enhanced Win Rate',
      icon: IconTrendingUp,
      description: 'Interactive win rate chart with filters and zoom'
    },
    {
      id: 'heatmap',
      label: 'Performance Heatmap',
      icon: IconCalendarTime,
      description: 'Performance patterns by day and time'
    },
    {
      id: 'radar',
      label: 'Skill Analysis',
      icon: IconTarget,
      description: 'Multi-dimensional skill comparison'
    }
  ];

  const renderActiveChart = () => {
    switch (activeChart) {
      case 'enhanced-winrate':
        return (
          <EnhancedWinRateChart 
            matches={matches}
            title="Enhanced Win Rate Analysis"
          />
        );
      case 'heatmap':
        return (
          <PerformanceHeatmap 
            matches={matches}
          />
        );
      case 'radar':
        return (
          <SkillRadarChart 
            matches={matches}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="advanced-charts loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading advanced charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-charts">
      <div className="advanced-charts-header">
        <div className="header-content">
          <h1>
            <IconChartBar size={24} style={{marginRight: '8px'}} />
            Advanced Analytics
          </h1>
          <p>Deep dive into your performance with interactive charts and advanced visualizations</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{matches.length}</span>
            <span className="stat-label">Total Matches</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {matches.length > 0 ? 
                Math.round((matches.filter(m => m.result === 'win').length / matches.length) * 100) : 0
              }%
            </span>
            <span className="stat-label">Overall Win Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {new Set(matches.map(m => m.games?.name)).size}
            </span>
            <span className="stat-label">Games Played</span>
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <IconChartBar size={64} />
          </div>
          <h3>No Data for Advanced Analytics</h3>
          <p>
            You need to add some matches before you can use advanced charts. 
            Head over to the Solo Tracker to start recording your games!
          </p>
          <button 
            className="cta-button"
            onClick={() => window.location.hash = '#solo'}
          >
            Add Your First Match
          </button>
        </div>
      ) : (
        <>
          {/* Chart Navigation */}
          <div className="chart-navigation">
            <div className="chart-tabs">
              {chartTabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`chart-tab ${activeChart === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveChart(tab.id)}
                  >
                    <div className="tab-icon">
                      <IconComponent size={20} />
                    </div>
                    <div className="tab-content">
                      <span className="tab-label">{tab.label}</span>
                      <span className="tab-description">{tab.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Content */}
          <div className="chart-content">
            {renderActiveChart()}
          </div>

          {/* Features Info */}
          <div className="features-info">
            <h3>Advanced Chart Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <IconZoom size={20} />
                <div className="feature-content">
                  <h4>Interactive Zoom & Pan</h4>
                  <p>Use mouse wheel to zoom in/out and drag to pan across time periods</p>
                </div>
              </div>
              <div className="feature-item">
                <IconDownload size={20} />
                <div className="feature-content">
                  <h4>Export Charts</h4>
                  <p>Download charts as PNG, PDF, or SVG for reports and sharing</p>
                </div>
              </div>
              <div className="feature-item">
                <IconChartBar size={20} />
                <div className="feature-content">
                  <h4>Smart Filters</h4>
                  <p>Filter by date range, game type, or match result to focus on specific data</p>
                </div>
              </div>
              <div className="feature-item">
                <IconCalendarTime size={20} />
                <div className="feature-content">
                  <h4>Pattern Analysis</h4>
                  <p>Discover when you perform best with heatmap visualizations</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedCharts;