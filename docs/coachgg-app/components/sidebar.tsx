"use client"

import { BarChart3, Users, Crown, Bot, Settings, GamepadIcon, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: any
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "solo", label: "Solo", icon: GamepadIcon },
  { id: "team", label: "Team", icon: Users },
  { id: "manager", label: "Manager", icon: Crown },
  { id: "ai-coach", label: "AI Coach", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function Sidebar({ activeTab, onTabChange, user }: SidebarProps) {
  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-[#333333] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#39FF14] to-[#9B30FF] rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#0D0D0D]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CoachGG</h1>
            <p className="text-xs text-[#AAAAAA]">Level up your game</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-[#333333]">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.profile_avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-[#39FF14] text-[#0D0D0D]">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.username}</p>
            <p className="text-xs text-[#AAAAAA] capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-[#39FF14] text-[#0D0D0D] shadow-lg shadow-[#39FF14]/20"
                      : "text-[#AAAAAA] hover:text-white hover:bg-[#333333]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#0D0D0D]" : "group-hover:text-[#39FF14]"}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#333333]">
        <div className="text-center">
          <p className="text-xs text-[#666666]">CoachGG v1.0</p>
          <p className="text-xs text-[#666666]">Level up your esports</p>
        </div>
      </div>
    </div>
  )
}
