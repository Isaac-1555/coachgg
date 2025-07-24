import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { IconTarget } from '@tabler/icons-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SkillRadarChart = ({ matches, playerStats = null }) => {
  // Process matches to create skill metrics
  const processSkillData = () => {
    if (!matches || matches.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Define skill categories
    const skillCategories = [
      'Win Rate',
      'KDA Ratio', 
      'Consistency',
      'Recent Form',
      'Clutch Performance',
      'Game Variety'
    ];

    // Calculate skill metrics
    const calculateSkillMetrics = (matchData) => {
      const totalMatches = matchData.length;
      const wins = matchData.filter(m => m.result === 'win').length;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      // KDA calculation
      let totalKDA = 0;
      let kdaMatches = 0;
      matchData.forEach(match => {
        if (match.stats && match.stats.kills !== undefined) {
          const kills = match.stats.kills || 0;
          const deaths = match.stats.deaths || 0;
          const assists = match.stats.assists || 0;
          const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
          totalKDA += kda;
          kdaMatches++;
        }
      });
      const avgKDA = kdaMatches > 0 ? totalKDA / kdaMatches : 1;
      const kdaScore = Math.min((avgKDA / 2) * 100, 100); // Normalize to 0-100

      // Consistency (inverse of win rate variance)
      const recentMatches = matchData.slice(0, 10);
      const winRates = [];
      for (let i = 0; i < recentMatches.length; i++) {
        const subset = recentMatches.slice(0, i + 1);
        const subsetWins = subset.filter(m => m.result === 'win').length;
        winRates.push((subsetWins / subset.length) * 100);
      }
      const variance = winRates.length > 1 ? 
        winRates.reduce((acc, rate) => acc + Math.pow(rate - winRate, 2), 0) / winRates.length : 0;
      const consistency = Math.max(0, 100 - (variance / 10)); // Lower variance = higher consistency

      // Recent form (last 5 matches)
      const last5 = matchData.slice(0, 5);
      const recentWins = last5.filter(m => m.result === 'win').length;
      const recentForm = last5.length > 0 ? (recentWins / last5.length) * 100 : 0;

      // Clutch performance (performance in close games or important matches)
      // For now, we'll use performance in losses as a proxy
      const losses = matchData.filter(m => m.result === 'loss');
      let clutchScore = 50; // Default middle score
      if (losses.length > 0) {
        // If player has good KDA even in losses, they're clutch
        let lossKDA = 0;
        let lossKDACount = 0;
        losses.forEach(match => {
          if (match.stats && match.stats.kills !== undefined) {
            const kills = match.stats.kills || 0;
            const deaths = match.stats.deaths || 0;
            const assists = match.stats.assists || 0;
            const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
            lossKDA += kda;
            lossKDACount++;
          }
        });
        if (lossKDACount > 0) {
          const avgLossKDA = lossKDA / lossKDACount;
          clutchScore = Math.min((avgLossKDA / 1.5) * 100, 100);
        }
      }

      // Game variety (number of different games played)
      const uniqueGames = new Set(matchData.map(m => m.games?.name || 'Unknown')).size;
      const maxVariety = 5; // Assume 5 different games is high variety
      const gameVariety = Math.min((uniqueGames / maxVariety) * 100, 100);

      return [
        winRate,           // Win Rate
        kdaScore,          // KDA Ratio  
        consistency,       // Consistency
        recentForm,        // Recent Form
        clutchScore,       // Clutch Performance
        gameVariety        // Game Variety
      ];
    };

    const currentPlayerMetrics = calculateSkillMetrics(matches);

    const datasets = [{
      label: 'Your Skills',
      data: currentPlayerMetrics,
      backgroundColor: 'rgba(57, 255, 20, 0.2)',
      borderColor: '#39FF14',
      borderWidth: 2,
      pointBackgroundColor: '#39FF14',
      pointBorderColor: '#0D0D0D',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }];

    // Add comparison player if provided
    if (playerStats && playerStats.matches) {
      const comparisonMetrics = calculateSkillMetrics(playerStats.matches);
      datasets.push({
        label: playerStats.name || 'Comparison Player',
        data: comparisonMetrics,
        backgroundColor: 'rgba(155, 48, 255, 0.2)',
        borderColor: '#9B30FF',
        borderWidth: 2,
        pointBackgroundColor: '#9B30FF',
        pointBorderColor: '#0D0D0D',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      });
    }

    return {
      labels: skillCategories,
      datasets
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
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Skill Analysis Radar',
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
            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: '#FFFFFF',
          font: {
            size: 12
          }
        },
        ticks: {
          color: '#AAAAAA',
          backdropColor: 'transparent',
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 5,
        hoverRadius: 7
      }
    }
  };

  const data = processSkillData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon"><IconTarget size={48} /></div>
          <h4>No skill data</h4>
          <p>Add matches with detailed stats to see your skill analysis!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Radar data={data} options={options} />
      </div>
      <div className="radar-description">
        <h4>Skill Categories Explained:</h4>
        <div className="skill-explanations">
          <div className="skill-item">
            <strong>Win Rate:</strong> Overall percentage of matches won
          </div>
          <div className="skill-item">
            <strong>KDA Ratio:</strong> Kill/Death/Assist performance
          </div>
          <div className="skill-item">
            <strong>Consistency:</strong> How stable your performance is
          </div>
          <div className="skill-item">
            <strong>Recent Form:</strong> Performance in last 5 matches
          </div>
          <div className="skill-item">
            <strong>Clutch Performance:</strong> Performance under pressure
          </div>
          <div className="skill-item">
            <strong>Game Variety:</strong> Diversity of games played
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillRadarChart;