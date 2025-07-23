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

const CoachingEffectivenessChart = ({ events, playerMatches, players }) => {
  // Process data to show coaching effectiveness over time
  const processCoachingData = () => {
    if (!events || events.length === 0 || !playerMatches || !players) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    
    if (sortedEvents.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Create time periods around events
    const labels = [];
    const beforeEventPerformance = [];
    const afterEventPerformance = [];

    sortedEvents.forEach((event, index) => {
      const eventDate = new Date(event.event_date);
      const beforeDate = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week before
      const afterDate = new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week after

      labels.push(eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

      // Calculate team performance before and after event
      const allMatches = [];
      Object.values(playerMatches).forEach(matches => {
        allMatches.push(...matches);
      });

      const beforeMatches = allMatches.filter(match => {
        const matchDate = new Date(match.match_date);
        return matchDate >= beforeDate && matchDate < eventDate;
      });

      const afterMatches = allMatches.filter(match => {
        const matchDate = new Date(match.match_date);
        return matchDate > eventDate && matchDate <= afterDate;
      });

      const beforeWinRate = beforeMatches.length > 0 
        ? (beforeMatches.filter(m => m.result === 'win').length / beforeMatches.length) * 100 
        : 0;

      const afterWinRate = afterMatches.length > 0 
        ? (afterMatches.filter(m => m.result === 'win').length / afterMatches.length) * 100 
        : 0;

      beforeEventPerformance.push(beforeWinRate);
      afterEventPerformance.push(afterWinRate);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Performance Before Event',
          data: beforeEventPerformance,
          borderColor: '#FF3B3B',
          backgroundColor: 'rgba(255, 59, 59, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FF3B3B',
          pointBorderColor: '#0D0D0D',
          pointBorderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Performance After Event',
          data: afterEventPerformance,
          borderColor: '#39FF14',
          backgroundColor: 'rgba(57, 255, 20, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#39FF14',
          pointBorderColor: '#0D0D0D',
          pointBorderWidth: 2,
          pointRadius: 5
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
        text: 'Coaching Event Effectiveness',
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
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          },
          afterLabel: function(context) {
            const improvement = context.chart.data.datasets[1].data[context.dataIndex] - 
                              context.chart.data.datasets[0].data[context.dataIndex];
            return improvement > 0 
              ? `Improvement: +${improvement.toFixed(1)}%` 
              : `Change: ${improvement.toFixed(1)}%`;
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

  const data = processCoachingData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">📊</div>
          <h4>No coaching effectiveness data</h4>
          <p>Schedule coaching events to track their impact on team performance!</p>
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

export default CoachingEffectivenessChart;