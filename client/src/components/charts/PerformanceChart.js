import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = ({ matches }) => {
  // Process matches to create performance metrics
  const processPerformanceData = () => {
    if (!matches || matches.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Get last 10 matches for performance overview
    const recentMatches = matches.slice(0, 10).reverse();
    
    const labels = [];
    const kdaData = [];
    const winData = [];

    recentMatches.forEach((match, index) => {
      const date = new Date(match.match_date);
      labels.push(date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }));

      // Calculate KDA if available
      let kda = 0;
      if (match.stats && match.stats.kills !== undefined && match.stats.deaths !== undefined) {
        const kills = match.stats.kills || 0;
        const deaths = match.stats.deaths || 0;
        const assists = match.stats.assists || 0;
        kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
      }
      
      kdaData.push(kda);
      winData.push(match.result === 'win' ? 1 : 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'KDA Ratio',
          data: kdaData,
          backgroundColor: 'rgba(57, 255, 20, 0.8)',
          borderColor: '#39FF14',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Win/Loss',
          data: winData,
          backgroundColor: winData.map(win => win ? 'rgba(57, 255, 20, 0.6)' : 'rgba(255, 59, 59, 0.6)'),
          borderColor: winData.map(win => win ? '#39FF14' : '#FF3B3B'),
          borderWidth: 1,
          yAxisID: 'y1'
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
          color: '#FFFFFF'
        }
      },
      title: {
        display: true,
        text: 'Recent Performance (Last 10 Matches)',
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
              return `KDA: ${context.parsed.y.toFixed(2)}`;
            } else {
              return context.parsed.y === 1 ? 'Win' : 'Loss';
            }
          }
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
          color: '#AAAAAA'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#AAAAAA'
        },
        title: {
          display: true,
          text: 'KDA Ratio',
          color: '#39FF14'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 1,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#AAAAAA',
          callback: function(value) {
            return value === 1 ? 'Win' : value === 0 ? 'Loss' : '';
          }
        },
        title: {
          display: true,
          text: 'Match Result',
          color: '#9B30FF'
        }
      }
    }
  };

  const data = processPerformanceData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">📊</div>
          <h4>No performance data</h4>
          <p>Add matches with KDA stats to see your performance trends!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;