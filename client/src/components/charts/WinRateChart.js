import React from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WinRateChart = ({ matches }) => {
  // Process matches to create win rate over time data
  const processMatchData = () => {
    if (!matches || matches.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Sort matches by date (oldest first for chronological progression)
    const sortedMatches = [...matches].sort((a, b) => 
      new Date(a.match_date) - new Date(b.match_date)
    );

    const labels = [];
    const winRateData = [];
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
        day: 'numeric' 
      }));
      winRateData.push(winRate);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Win Rate %',
          data: winRateData,
          borderColor: '#39FF14',
          backgroundColor: 'rgba(57, 255, 20, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#39FF14',
          pointBorderColor: '#0D0D0D',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Win Rate Over Time',
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
            return `Win Rate: ${context.parsed.y.toFixed(1)}%`;
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
          color: '#AAAAAA',
          maxTicksLimit: 8
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

  const data = processMatchData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">📈</div>
          <h4>No match data</h4>
          <p>Add some matches to see your win rate progression!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WinRateChart;