import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const GameDistributionChart = ({ matches }) => {
  // Process matches to create game distribution data
  const processGameData = () => {
    if (!matches || matches.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Count matches per game
    const gameCount = {};
    matches.forEach(match => {
      const gameName = match.games?.name || 'Unknown Game';
      gameCount[gameName] = (gameCount[gameName] || 0) + 1;
    });

    const labels = Object.keys(gameCount);
    const data = Object.values(gameCount);

    // Generate colors for each game
    const colors = [
      '#39FF14', // Neon Green
      '#9B30FF', // Neon Purple
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
        text: 'Games Played Distribution',
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

  const data = processGameData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">🎮</div>
          <h4>No game data</h4>
          <p>Add matches to see your game distribution!</p>
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

export default GameDistributionChart;