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

const TeamActivityOverviewChart = ({ playerMatches, events, players }) => {
  // Process data to show team activity over time
  const processActivityData = () => {
    if (!playerMatches || !players) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Get all matches from all players
    const allMatches = [];
    Object.values(playerMatches).forEach(matches => {
      allMatches.push(...matches);
    });

    if (allMatches.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group by week for the last 8 weeks
    const weeks = [];
    const matchCounts = [];
    const eventCounts = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const weekLabel = weekStart.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      weeks.push(weekLabel);

      // Count matches in this week
      const weekMatches = allMatches.filter(match => {
        const matchDate = new Date(match.match_date);
        return matchDate >= weekStart && matchDate < weekEnd;
      });
      matchCounts.push(weekMatches.length);

      // Count events in this week
      const weekEvents = (events || []).filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate >= weekStart && eventDate < weekEnd;
      });
      eventCounts.push(weekEvents.length);
    }

    return {
      labels: weeks,
      datasets: [
        {
          label: 'Matches Played',
          data: matchCounts,
          backgroundColor: 'rgba(57, 255, 20, 0.8)',
          borderColor: '#39FF14',
          borderWidth: 1
        },
        {
          label: 'Coaching Events',
          data: eventCounts,
          backgroundColor: 'rgba(155, 48, 255, 0.8)',
          borderColor: '#9B30FF',
          borderWidth: 1
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
        text: 'Team Activity Overview (Last 8 Weeks)',
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
              return `Matches: ${context.parsed.y}`;
            } else {
              return `Events: ${context.parsed.y}`;
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
        min: 0,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#AAAAAA',
          stepSize: 1
        }
      }
    }
  };

  const data = processActivityData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">📅</div>
          <h4>No activity data</h4>
          <p>Team activity overview will appear here once players start playing!</p>
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

export default TeamActivityOverviewChart;