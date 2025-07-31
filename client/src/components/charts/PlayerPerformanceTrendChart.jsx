import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PlayerPerformanceTrendChart = ({ players, playerMatches }) => {
  // Process player data to show performance trends
  const processPlayerTrendData = () => {
    if (!players || players.length === 0 || !playerMatches) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Get last 10 matches for trend analysis
    const allMatches = [];
    Object.values(playerMatches).forEach(matches => {
      allMatches.push(...matches);
    });

    // Sort all matches by date and get recent ones
    const sortedMatches = allMatches
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .slice(-10);

    if (sortedMatches.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = sortedMatches.map((match, index) => {
      const date = new Date(match.match_date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Create datasets for top performing players
    const topPlayers = players
      .map(player => {
        const matches = playerMatches[player.user_id] || [];
        const wins = matches.filter(m => m.result === 'win').length;
        const winRate = matches.length > 0 ? (wins / matches.length) * 100 : 0;
        return { ...player, winRate, totalMatches: matches.length };
      })
      .filter(player => player.totalMatches > 0)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 5); // Top 5 players

    const colors = ['#39FF14', '#9B30FF', '#FF3B3B', '#3BFFFF', '#FFFF3B'];

    const datasets = topPlayers.map((player, index) => {
      const playerData = sortedMatches.map(match => {
        // Calculate running win rate up to this match for this player
        const playerMatchesUpToDate = (playerMatches[player.user_id] || [])
          .filter(m => new Date(m.match_date) <= new Date(match.match_date))
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
        
        if (playerMatchesUpToDate.length === 0) return null;
        
        const wins = playerMatchesUpToDate.filter(m => m.result === 'win').length;
        return (wins / playerMatchesUpToDate.length) * 100;
      });

      return {
        label: player.nickname || player.users.username,
        data: playerData,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        spanGaps: true
      };
    });

    return { labels, datasets };
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
        text: 'Player Performance Trends (Top 5)',
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
            return `${context.dataset.label}: ${context.parsed.y?.toFixed(1)}%`;
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
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const data = processPlayerTrendData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">📈</div>
          <h4>No player trend data</h4>
          <p>Player performance trends will appear here once they start playing!</p>
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

export default PlayerPerformanceTrendChart;