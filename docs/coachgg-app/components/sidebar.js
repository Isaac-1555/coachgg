"use client"

import { BarChart3, Users, Crown, Bot, Settings, GamepadIcon, Trophy } from "lucide-react"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "solo", label: "Solo", icon: GamepadIcon },
  { id: "team", label: "Team", icon: Users },
  { id: "manager", label: "Manager", icon: Crown },
  { id: "ai-coach", label: "AI Coach", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function Sidebar({ activeTab, onTabChange, user }) {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green rounded-xl flex items-center justify-center glow-green">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CoachGG</h1>
            <p className="text-xs text-secondary">Level up your game</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            {user.profile_avatar ? (
              <img src={user.profile_avatar} alt={user.username} />
            ) : (
              <span className="bg-green text-primary font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.username}</p>
            <p className="text-xs text-secondary capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`${isActive ? "active" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-center">
          <p className="text-xs text-muted">CoachGG v1.0</p>
          <p className="text-xs text-muted">Level up your esports</p>
        </div>
      </div>
    </div>
  )
}