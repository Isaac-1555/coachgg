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

const TeamVsIndividualChart = ({ teamStats, memberStats, members }) => {
  // Process data to compare team vs individual performance
  const processComparisonData = () => {
    if (!teamStats || !memberStats || !members || members.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Calculate average individual performance
    const memberWinRates = members.map(member => {
      const stats = memberStats[member.user_id];
      return stats ? stats.winRate : 0;
    });

    const avgIndividualWinRate = memberWinRates.length > 0 
      ? memberWinRates.reduce((sum, rate) => sum + rate, 0) / memberWinRates.length 
      : 0;

    const avgIndividualMatches = members.map(member => {
      const stats = memberStats[member.user_id];
      return stats ? stats.totalMatches : 0;
    }).reduce((sum, matches) => sum + matches, 0) / members.length;

    return {
      labels: ['Team Performance', 'Average Individual Performance'],
      datasets: [
        {
          label: 'Win Rate %',
          data: [teamStats.winRate, avgIndividualWinRate],
          backgroundColor: [
            'rgba(155, 48, 255, 0.8)',
            'rgba(57, 255, 20, 0.8)'
          ],
          borderColor: [
            '#9B30FF',
            '#39FF14'
          ],
          borderWidth: 2
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
        text: 'Team vs Individual Performance',
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
          color: '#AAAAAA'
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
    }
  };

  const data = processComparisonData();

  if (data.labels.length === 0 || !teamStats.totalMatches) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">⚖️</div>
          <h4>No comparison data</h4>
          <p>Team and individual performance comparison will appear here!</p>
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

export default TeamVsIndividualChart;