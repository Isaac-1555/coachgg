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
import { IconUsers } from '@tabler/icons-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MemberPerformanceChart = ({ members, memberStats }) => {
  // Process member data to create performance comparison
  const processMemberData = () => {
    if (!members || members.length === 0 || !memberStats) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = members.map(member => member.nickname || member.users.username);
    const winRates = members.map(member => {
      const stats = memberStats[member.user_id];
      return stats ? stats.winRate : 0;
    });
    const totalMatches = members.map(member => {
      const stats = memberStats[member.user_id];
      return stats ? stats.totalMatches : 0;
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
        text: 'Team Member Performance Comparison',
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
            } else {
              return `Total Matches: ${context.parsed.y}`;
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
      }
    }
  };

  const data = processMemberData();

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty-state">
          <div className="empty-icon">
            <IconUsers size={48} />
          </div>
          <h4>No member performance data</h4>
          <p>Individual member statistics will appear here once they start playing!</p>
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

export default MemberPerformanceChart;