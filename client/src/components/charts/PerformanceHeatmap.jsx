import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { IconCalendarTime } from '@tabler/icons-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceHeatmap = ({ matches }) => {
  // Process matches to create heatmap data (day of week vs hour of day)
  const processHeatmapData = () => {
    if (!matches || matches.length === 0) {
      return {
        datasets: []
      };
    }

    const heatmapData = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Process each match
    matches.forEach(match => {
      const date = new Date(match.match_date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = date.getHours();
      const winRate = match.result === 'win' ? 100 : 0;
      
      heatmapData.push({
        x: hour,
        y: dayOfWeek,
        winRate: winRate,
        matchCount: 1,
        date: match.match_date,
        game: match.games?.name || 'Unknown'
      });
    });

    // Aggregate data by hour and day
    const aggregatedData = {};
    heatmapData.forEach(point => {
      const key = `${point.x}-${point.y}`;
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          x: point.x,
          y: point.y,
          totalWinRate: 0,
          matchCount: 0,
          wins: 0
        };
      }
      aggregatedData[key].totalWinRate += point.winRate;
      aggregatedData[key].matchCount += 1;
      if (point.winRate === 100) aggregatedData[key].wins += 1;
    });

    // Convert to chart format
    const scatterData = Object.values(aggregatedData).map(point => ({
      x: point.x,
      y: point.y,
      winRate: point.matchCount > 0 ? point.totalWinRate / point.matchCount : 0,
      matchCount: point.matchCount,
      wins: point.wins
    }));

    // Create color-coded points based on win rate and match count
    const datasets = [{
      label: 'Performance Heatmap',
      data: scatterData,
      backgroundColor: scatterData.map(point => {
        const alpha = Math.min(point.matchCount / 5, 1); // More matches = more opaque
        if (point.winRate >= 70) return `rgba(57, 255, 20, ${alpha})`;
        if (point.winRate >= 50) return `rgba(255, 255, 59, ${alpha})`;
        return `rgba(255, 59, 59, ${alpha})`;
      }),
      borderColor: scatterData.map(point => {
        if (point.winRate >= 70) return '#39FF14';
        if (point.winRate >= 50) return '#FFFF3B';
        return '#FF3B3B';
      }),
      borderWidth: 2,
      pointRadius: scatterData.map(point => Math.max(5, Math.min(point.matchCount * 2, 15))),
      pointHoverRadius: scatterData.map(point => Math.max(7, Math.min(point.matchCount * 2 + 2, 17)))
    }];

    return { datasets };
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
        text: 'Performance Heatmap (Day vs Hour)',
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
          title: function(context) {
            const point = context[0];
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const hour = point.parsed.x;
            const day = dayNames[point.parsed.y];
            return `${day} at ${hour}:00`;
          },
          label: function(context) {
            const point = context.raw;
            return [
              `Matches: ${point.matchCount}`,
              `Wins: ${point.wins}`,
              `Win Rate: ${point.winRate.toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 23,
        title: {
          display: true,
          text: 'Hour of Day',
          color: '#FFFFFF'
        },
        ticks: {
          color: '#AAAAAA',
          stepSize: 2,
          callback: function(value) {
            return value + ':00';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        type: 'linear',
        min: -0.5,
        max: 6.5,
        title: {
          display: true,
          text: 'Day of Week',
          color: '#FFFFFF'
        },
        ticks: {
          color: '#AAAAAA',
          stepSize: 1,
          callback: function(value) {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return dayNames[value] || '';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
    interaction: {
      intersect: false
    }
  };

  const data = processHeatmapData();

  if (data.datasets.length === 0 || data.datasets[0].data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon"><IconCalendarTime size={48} /></div>
          <h4>No heatmap data</h4>
          <p>Add more matches to see your performance patterns by time and day!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Scatter data={data} options={options} />
      </div>
      <div className="heatmap-legend">
        <div className="legend-title">Performance Legend:</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#39FF14' }}></div>
            <span>High Win Rate (70%+)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFFF3B' }}></div>
            <span>Medium Win Rate (50-70%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FF3B3B' }}></div>
            <span>Low Win Rate (&lt;50%)</span>
          </div>
          <div className="legend-note">
            <small>Bubble size indicates number of matches played</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;