import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { IconDeviceGamepad2 } from '@tabler/icons-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const TeamGameDistributionChart = ({ teamMatches }) => {
  // Process team matches to create game distribution data
  const processTeamGameData = () => {
    if (!teamMatches || teamMatches.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Count matches per game for the team
    const gameCount = {};
    teamMatches.forEach(match => {
      const gameName = match.games?.name || 'Unknown Game';
      gameCount[gameName] = (gameCount[gameName] || 0) + 1;
    });

    const labels = Object.keys(gameCount);
    const data = Object.values(gameCount);

    // Generate colors for each game (team-themed colors)
    const colors = [
      '#9B30FF', // Neon Purple (primary team color)
      '#39FF14', // Neon Green
      '#FF3B3B', // Neon Red
      '#3BFFFF', // Neon Cyan
      '#FFFF3B', // Neon Yellow
      '#FF3BFF', // Neon Magenta
      '#3BFF3B', // Bright Green
      '#FF9B3B'  // Neon Orange
    ];

    const backgroundColors = labels.map((_, index) => colors[index % colors.length]);
    const borderColors = backgroundColors.map(color => color);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverBorderWidth: 3
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#FFFFFF',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Team Games Distribution',
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
        borderColor: '#9B30FF',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} matches (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  const data = processTeamGameData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon"><IconDeviceGamepad2 size={48} /></div>
          <h4>No team game data</h4>
          <p>Team game distribution will appear here once matches are played!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TeamGameDistributionChart;