"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Overview from "@/components/tabs/overview"
import SoloTracker from "@/components/tabs/solo-tracker"
import TeamManagement from "@/components/tabs/team-management"
import ManagerDashboard from "@/components/tabs/manager-dashboard"
import AICoach from "@/components/tabs/ai-coach"
import Settings from "@/components/tabs/settings"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview user={user} />
      case "solo":
        return <SoloTracker user={user} />
      case "team":
        return <TeamManagement user={user} />
      case "manager":
        return <ManagerDashboard user={user} />
      case "ai-coach":
        return <AICoach user={user} />
      case "settings":
        return <Settings user={user} onLogout={onLogout} />
      default:
        return <Overview user={user} />
    }
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      <main className="flex-1 overflow-y-auto">{renderActiveTab()}</main>
    </div>
  )
}
