import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Overview from './tabs/Overview';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview user={user} />;
      case 'solo':
        return <div className="tab-content">Solo Tracker - Coming Soon</div>;
      case 'team':
        return <div className="tab-content">Team Management - Coming Soon</div>;
      case 'manager':
        return <div className="tab-content">Manager Dashboard - Coming Soon</div>;
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