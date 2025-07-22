"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Overview from "./tabs/overview"
import SoloTracker from "./tabs/solo-tracker"
import TeamManagement from "./tabs/team-management"
import ManagerDashboard from "./tabs/manager-dashboard"
import AICoach from "./tabs/ai-coach"
import Settings from "./tabs/settings"

export default function Dashboard({ user, onLogout }) {
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
    <div className="flex h-screen bg-primary">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      <main className="flex-1 overflow-y-auto">{renderActiveTab()}</main>
    </div>
  )
}