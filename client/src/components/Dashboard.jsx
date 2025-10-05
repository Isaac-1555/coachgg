import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [isLoadingTab, setIsLoadingTab] = useState(true);
  const [openAddMatchModal, setOpenAddMatchModal] = useState(false);

  // Determine initial tab based on whether user has matches
  useEffect(() => {
    const determineInitialTab = async () => {
      if (!user?.id) {
        setIsLoadingTab(false);
        return;
      }

      try {
        // Check if user has any matches
        const { data, error } = await supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .eq('player_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error checking user matches:', error);
          setActiveTab('overview');
        } else {
          // If no matches exist, show Solo Tracker; otherwise show Overview
          const hasMatches = data && data.length > 0;
          setActiveTab(hasMatches ? 'overview' : 'solo');
        }
      } catch (error) {
        console.error('Error determining initial tab:', error);
        setActiveTab('overview');
      } finally {
        setIsLoadingTab(false);
      }
    };

    determineInitialTab();
  }, [user]);

  const handleTabChange = (tab, options = {}) => {
    setActiveTab(tab);
    if (options.openAddMatchModal) {
      setOpenAddMatchModal(true);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview user={user} onTabChange={handleTabChange} />;
      case 'solo':
        return <SoloTracker user={user} onTabChange={handleTabChange} openAddMatchModal={openAddMatchModal} setOpenAddMatchModal={setOpenAddMatchModal} />;
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

  // Show loading state while determining initial tab
  if (isLoadingTab || activeTab === null) {
    return (
      <div className="dashboard">
        <Sidebar activeTab="overview" onTabChange={handleTabChange} user={user} />
        <main className="dashboard-main">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} user={user} />
      <main className="dashboard-main">
        {renderActiveTab()}
      </main>
      <AchievementManager />
    </div>
  );
};

export default Dashboard;