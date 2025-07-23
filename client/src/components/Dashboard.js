import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Overview from './tabs/Overview';
import SoloTracker from './tabs/SoloTracker';
import TeamManagement from './tabs/TeamManagement';
import ManagerDashboard from './tabs/ManagerDashboard';
import AICoach from './tabs/AICoach';
import Settings from './tabs/Settings';
import AchievementManager from './AchievementManager';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview user={user} />;
      case 'solo':
        return <SoloTracker user={user} />;
      case 'team':
        return <TeamManagement user={user} />;
      case 'manager':
        return <ManagerDashboard user={user} />;
      case 'ai-coach':
        return <AICoach user={user} />;
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