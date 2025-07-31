// Modern Icon System for CoachGG
// Replaces emoji usage with sleek SVG icons that match the gaming theme

import React from 'react';

// Base Icon Component
const Icon = ({ children, size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`icon ${className}`}
    {...props}
  >
    {children}
  </svg>
);

// Gaming Controller Icon (replaces 🎮)
export const GamepadIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M7 12C7 10.8954 7.89543 10 9 10H15C16.1046 10 17 10.8954 17 12V14C17 15.1046 16.1046 16 15 16H9C7.89543 16 7 15.1046 7 14V12Z"
      fill="currentColor"
    />
    <path
      d="M5 11C4.44772 11 4 11.4477 4 12V14C4 14.5523 4.44772 15 5 15C5.55228 15 6 14.5523 6 14V12C6 11.4477 5.55228 11 5 11Z"
      fill="currentColor"
    />
    <path
      d="M19 11C18.4477 11 18 11.4477 18 12V14C18 14.5523 18.4477 15 19 15C19.5523 15 20 14.5523 20 14V12C20 11.4477 19.5523 11 19 11Z"
      fill="currentColor"
    />
    <circle cx="10" cy="13" r="0.5" fill="#1A1A1A" />
    <circle cx="14" cy="13" r="0.5" fill="#1A1A1A" />
  </Icon>
);

// AI/Robot Icon (replaces 🤖)
export const AIIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <rect x="6" y="4" width="12" height="16" rx="2" fill="currentColor" />
    <circle cx="9" cy="8" r="1" fill="#1A1A1A" />
    <circle cx="15" cy="8" r="1" fill="#1A1A1A" />
    <rect x="8" y="11" width="8" height="1" rx="0.5" fill="#1A1A1A" />
    <rect x="9" y="13" width="6" height="1" rx="0.5" fill="#1A1A1A" />
    <path d="M4 10L6 8V12L4 10Z" fill="currentColor" />
    <path d="M20 10L18 8V12L20 10Z" fill="currentColor" />
  </Icon>
);

// Target/Goal Icon (replaces 🎯)
export const TargetIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </Icon>
);

// Analytics/Chart Icon (replaces 📊)
export const AnalyticsIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <rect x="3" y="16" width="4" height="5" fill="currentColor" />
    <rect x="10" y="10" width="4" height="11" fill="currentColor" />
    <rect x="17" y="6" width="4" height="15" fill="currentColor" />
  </Icon>
);

// Trending Up Icon (replaces 📈)
export const TrendingIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M3 17L9 11L13 15L21 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M16 7H21V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

// Settings/Gear Icon (replaces ⚙️)
export const SettingsIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

// User/Profile Icon (replaces 👤)
export const UserIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path
      d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Icon>
);

// Trophy/Achievement Icon (replaces 🏆)
export const TrophyIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M6 9C6 10.6569 7.34315 12 9 12C10.6569 12 12 10.6569 12 9V6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6V9Z"
      fill="currentColor"
    />
    <path
      d="M12 9C12 10.6569 13.3431 12 15 12C16.6569 12 18 10.6569 18 9V6C18 4.34315 16.6569 3 15 3C13.3431 3 12 4.34315 12 6V9Z"
      fill="currentColor"
    />
    <rect x="8" y="12" width="8" height="2" fill="currentColor" />
    <rect x="10" y="14" width="4" height="6" fill="currentColor" />
    <rect x="7" y="20" width="10" height="2" rx="1" fill="currentColor" />
  </Icon>
);

// Overview/Dashboard Icon (replaces 📊)
export const OverviewIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
  </Icon>
);

// Team Icon
export const TeamIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <circle cx="9" cy="7" r="3" fill="currentColor" />
    <circle cx="15" cy="7" r="3" fill="currentColor" />
    <path
      d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M9 21V19C9 16.7909 10.7909 15 13 15H17C19.2091 15 21 16.7909 21 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Icon>
);

// Manager Icon
export const ManagerIcon = ({ size, className, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <circle cx="12" cy="6" r="3" fill="currentColor" />
    <path
      d="M4 21V19C4 16.7909 5.79086 15 8 15H16C18.2091 15 20 16.7909 20 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="10" y="10" width="4" height="2" rx="1" fill="currentColor" />
  </Icon>
);

// Export all icons
export const Icons = {
  Gamepad: GamepadIcon,
  AI: AIIcon,
  Target: TargetIcon,
  Analytics: AnalyticsIcon,
  Trending: TrendingIcon,
  Settings: SettingsIcon,
  User: UserIcon,
  Trophy: TrophyIcon,
  Overview: OverviewIcon,
  Team: TeamIcon,
  Manager: ManagerIcon,
};

export default Icons;