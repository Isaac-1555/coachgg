import React, { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { IconTrendingUp } from '@tabler/icons-react';
import ChartControls from './ChartControls';
import { exportChart, filterMatches, getAvailableGames, generateFilename } from '../../utils/chartExport';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const EnhancedWinRateChart = ({ matches, title = 'Enhanced Win Rate Over Time' }) => {
  const chartRef = useRef(null);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    gameFilter: 'all',
    resultFilter: 'all'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);

  useEffect(() => {
    if (matches && matches.length > 0) {
      setAvailableGames(getAvailableGames(matches));
    }
  }, [matches]);

  // Process matches with filters applied
  const processMatchData = () => {
    const filteredMatches = filterMatches(matches, filters);
    
    if (!filteredMatches || filteredMatches.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Sort matches by date (oldest first for chronological progression)
    const sortedMatches = [...filteredMatches].sort((a, b) => 
      new Date(a.match_date) - new Date(b.match_date)
    );

    const labels = [];
    const winRateData = [];
    const trendlineData = [];
    let wins = 0;
    let totalMatches = 0;

    sortedMatches.forEach((match, index) => {
      totalMatches++;
      if (match.result === 'win') {
        wins++;
      }
      
      const winRate = (wins / totalMatches) * 100;
      const date = new Date(match.match_date);
      
      // Format date for display
      labels.push(date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: sortedMatches.length > 30 ? '2-digit' : undefined
      }));
      winRateData.push(winRate);
      
      // Calculate moving average for trendline (last 5 matches)
      const start = Math.max(0, index - 4);
      const subset = sortedMatches.slice(start, index + 1);
      const subsetWins = subset.filter(m => m.result === 'win').length;
      const movingAvg = (subsetWins / subset.length) * 100;
      trendlineData.push(movingAvg);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Win Rate',
          data: winRateData,
          borderColor: '#39FF14',
          backgroundColor: 'rgba(57, 255, 20, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#39FF14',
          pointBorderColor: '#0D0D0D',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Trend (5-match average)',
          data: trendlineData,
          borderColor: '#9B30FF',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: title,
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: '#AAAAAA',
        borderColor: '#39FF14',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Win Rate: ${context.parsed.y.toFixed(1)}%`;
            } else {
              return `Trend: ${context.parsed.y.toFixed(1)}%`;
            }
          },
          afterBody: function(context) {
            const index = context[0].dataIndex;
            const filteredMatches = filterMatches(matches, filters);
            const sortedMatches = [...filteredMatches].sort((a, b) => 
              new Date(a.match_date) - new Date(b.match_date)
            );
            const match = sortedMatches[index];
            if (match) {
              return [
                `Game: ${match.games?.name || 'Unknown'}`,
                `Result: ${match.result.toUpperCase()}`,
                `Date: ${new Date(match.match_date).toLocaleDateString()}`
              ];
            }
            return [];
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#AAAAAA',
          maxTicksLimit: 10
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#AAAAAA',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const handleDateRangeChange = (dateRange) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleGameFilterChange = (gameFilter) => {
    setFilters(prev => ({ ...prev, gameFilter }));
  };

  const handleResultFilterChange = (resultFilter) => {
    setFilters(prev => ({ ...prev, resultFilter }));
  };

  const handleExport = async (format) => {
    if (!chartRef.current) return;
    
    setIsExporting(true);
    try {
      const filename = generateFilename('winrate', filters);
      await exportChart(chartRef, format, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    // Reset zoom
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const data = processMatchData();
  const filteredMatches = filterMatches(matches, filters);

  if (!matches || matches.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon"><IconTrendingUp size={48} /></div>
          <h4>No match data</h4>
          <p>Add some matches to see your win rate progression!</p>
        </div>
      </div>
    );
  }

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <ChartControls
          onDateRangeChange={handleDateRangeChange}
          onGameFilterChange={handleGameFilterChange}
          onResultFilterChange={handleResultFilterChange}
          onExport={handleExport}
          onRefresh={handleRefresh}
          availableGames={availableGames}
          dateRange={filters.dateRange}
          gameFilter={filters.gameFilter}
          resultFilter={filters.resultFilter}
        />
        <div className="chart-empty-state">
          <div className="empty-icon"><IconTrendingUp size={48} /></div>
          <h4>No data matches your filters</h4>
          <p>Try adjusting your filters to see more data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-chart-container">
      <ChartControls
        onDateRangeChange={handleDateRangeChange}
        onGameFilterChange={handleGameFilterChange}
        onResultFilterChange={handleResultFilterChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        availableGames={availableGames}
        dateRange={filters.dateRange}
        gameFilter={filters.gameFilter}
        resultFilter={filters.resultFilter}
      />
      
      <div className="chart-container" ref={chartRef}>
        <div className="chart-wrapper">
          <Line data={data} options={options} />
        </div>
        <div className="chart-info">
          <div className="chart-stats">
            <span>Showing {filteredMatches.length} of {matches.length} matches</span>
            {filteredMatches.length > 0 && (
              <span>
                • Win Rate: {((filteredMatches.filter(m => m.result === 'win').length / filteredMatches.length) * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="chart-controls-hint">
            <small>💡 Use mouse wheel to zoom, drag to pan, or use the controls above</small>
          </div>
        </div>
      </div>
      
      {isExporting && (
        <div className="export-overlay">
          <div className="export-spinner">
            <div className="spinner"></div>
            <span>Exporting chart...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWinRateChart;