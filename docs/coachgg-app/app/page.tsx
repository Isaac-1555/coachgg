"use client"

import { useState, useEffect } from "react"
import AuthForm from "@/components/auth-form"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("coachgg_token")
    const userData = localStorage.getItem("coachgg_user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("coachgg_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("coachgg_token")
    localStorage.removeItem("coachgg_user")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-[#39FF14] text-xl">Loading CoachGG...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthForm onLogin={handleLogin} />}
    </div>
  )
}
