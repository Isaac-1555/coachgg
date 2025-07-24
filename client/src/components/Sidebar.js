import React from 'react';
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
  IconLogout
} from '@tabler/icons-react';
import '../styles/Sidebar.css';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: IconLayoutDashboard },
  { id: 'solo', label: 'Solo', icon: IconDeviceGamepad2 },
  { id: 'team', label: 'Team', icon: IconUsers },
  { id: 'manager', label: 'Manager', icon: IconCrown },
  { id: 'ai-coach', label: 'AI Coach', icon: IconRobot },
  { id: 'advanced-charts', label: 'Analytics', icon: IconChartBar },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

const Sidebar = ({ activeTab, onTabChange, user }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <IconTrophy size={20} />
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
                onClick={() => onTabChange(item.id)}
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
  );
};

export default Sidebar;