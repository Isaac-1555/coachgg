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

const ManagerTeamComparisonChart = ({ managedTeams, teamStats }) => {
  // Process data to compare all managed teams
  const processTeamComparisonData = () => {
    if (!managedTeams || managedTeams.length === 0 || !teamStats) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = managedTeams.map(team => team.name);
    const winRates = managedTeams.map(team => {
      const stats = teamStats[team.id];
      return stats ? stats.winRate : 0;
    });
    const totalMatches = managedTeams.map(team => {
      const stats = teamStats[team.id];
      return stats ? stats.totalMatches : 0;
    });
    const memberCounts = managedTeams.map(team => {
      const stats = teamStats[team.id];
      return stats ? stats.memberCount : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Win Rate %',
          data: winRates,
          backgroundColor: 'rgba(57, 255, 20, 0.8)',
          borderColor: '#39FF14',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Total Matches',
          data: totalMatches,
          backgroundColor: 'rgba(155, 48, 255, 0.8)',
          borderColor: '#9B30FF',
          borderWidth: 1,
          yAxisID: 'y1'
        },
        {
          label: 'Team Size',
          data: memberCounts,
          backgroundColor: 'rgba(255, 59, 59, 0.8)',
          borderColor: '#FF3B3B',
          borderWidth: 1,
          yAxisID: 'y2'
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
        text: 'Managed Teams Comparison',
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
              return `Win Rate: ${context.parsed.y}%`;
            } else if (context.datasetIndex === 1) {
              return `Total Matches: ${context.parsed.y}`;
            } else {
              return `Team Size: ${context.parsed.y} members`;
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
          color: '#AAAAAA',
          maxRotation: 45
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
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
        },
        title: {
          display: true,
          text: 'Win Rate %',
          color: '#39FF14'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#AAAAAA'
        },
        title: {
          display: true,
          text: 'Total Matches',
          color: '#9B30FF'
        }
      },
      y2: {
        type: 'linear',
        display: false,
        min: 0,
        max: 10
      }
    }
  };

  const data = processTeamComparisonData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">👑</div>
          <h4>No team comparison data</h4>
          <p>Manage multiple teams to see comparison analytics!</p>
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

export default ManagerTeamComparisonChart;