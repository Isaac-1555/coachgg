import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Overview from './tabs/Overview';
import SoloTracker from './tabs/SoloTracker';
import TeamManagement from './tabs/TeamManagement';
import ManagerDashboard from './tabs/ManagerDashboard';
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
        return <div className="tab-content">AI Coach - Coming Soon</div>;
      case 'settings':
        return <div className="tab-content">Settings - Coming Soon</div>;
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
    </div>
  );
};

export default Dashboard;