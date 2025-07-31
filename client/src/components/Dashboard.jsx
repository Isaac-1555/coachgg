import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar.jsx';
import Overview from './tabs/Overview.jsx';
import SoloTracker from './tabs/SoloTracker.jsx';
import TeamManagement from './tabs/TeamManagement.jsx';
import CalendarTab from './tabs/Calendar.jsx';
import ManagerDashboard from './tabs/ManagerDashboard.jsx';
import AICoach from './tabs/AICoach.jsx';
import AdvancedCharts from './tabs/AdvancedCharts.jsx';
import Settings from './tabs/Settings.jsx';
import AchievementManager from './AchievementManager.jsx';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview user={user} onTabChange={setActiveTab} />;
      case 'solo':
        return <SoloTracker user={user} />;
      case 'team':
        return <TeamManagement user={user} />;
      case 'calendar':
        return <CalendarTab user={user} />;
      case 'manager':
        return <ManagerDashboard user={user} />;
      case 'ai-coach':
        return <AICoach user={user} />;
      case 'advanced-charts':
        return <AdvancedCharts user={user} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <Overview user={user} />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      <main className="dashboard-main">
        {renderActiveTab()}
      </main>
      <AchievementManager />
    </div>
  );
};

export default Dashboard;