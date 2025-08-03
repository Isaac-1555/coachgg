import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  IconTrophy,
  IconLayoutDashboard,
  IconDeviceGamepad2,
  IconUsers,
  IconCrown,
  IconRobot,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconCalendar,
  IconMenu2,
  IconX
} from '@tabler/icons-react';
import '../styles/Sidebar.css';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: IconLayoutDashboard },
  { id: 'solo', label: 'Solo', icon: IconDeviceGamepad2 },
  { id: 'team', label: 'Team', icon: IconUsers },
  { id: 'calendar', label: 'Calendar', icon: IconCalendar },
  { id: 'manager', label: 'Manager', icon: IconCrown },
  { id: 'ai-coach', label: 'AI Coach', icon: IconRobot },
  { id: 'advanced-charts', label: 'Analytics', icon: IconChartBar },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

const Sidebar = ({ activeTab, onTabChange, user }) => {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <IconMenu2 size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile ? (isMobileMenuOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        {/* Mobile Close Button */}
        {isMobile && (
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <IconX size={24} />
          </button>
        )}

        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <img src="/logo.svg" alt="CoachGG Logo" className="logo-svg" />
            </div>
            <div className="logo-text">
              <h1>CoachGG</h1>
              <p>Level up your game</p>
            </div>
          </div>
        </div>

      {/* User Profile */}
      <div className="user-profile">
        <div className="user-avatar">
          {user.profile_avatar ? (
            <img src={user.profile_avatar} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="user-info">
          <p className="username">{user.username}</p>
          <p className="user-role">{user.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleTabChange(item.id)}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  <item.icon size={18} />
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="nav-icon">
            <IconLogout size={18} />
          </span>
          <span className="nav-label">Logout</span>
        </button>
        <div className="version-info">
          <p>CoachGG v1.0</p>
          <p>Level up your esports</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;