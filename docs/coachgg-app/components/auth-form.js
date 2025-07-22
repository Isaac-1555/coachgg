"use client"

import { useState } from "react"
import { GamepadIcon, Trophy, Zap } from "lucide-react"

export default function AuthForm({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player"
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: "1",
        username: loginData.email.split("@")[0],
        email: loginData.email,
        role: "player",
        profile_avatar: null
      }
      
      localStorage.setItem("coachgg_token", "mock_token_123")
      onLogin(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: "1",
        username: registerData.username,
        email: registerData.email,
        role: registerData.role,
        profile_avatar: null
      }
      
      localStorage.setItem("coachgg_token", "mock_token_123")
      onLogin(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CoachGG</h1>
          <p className="text-secondary">Level up your esports game</p>
        </div>

        {/* Auth Card */}
        <div className="card">
          {/* Tabs */}
          <div className="card-header">
            <div className="tabs">
              <div className="tabs-list">
                <button
                  className={`tabs-trigger ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`tabs-trigger ${activeTab === "register" ? "active" : ""}`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </div>
            </div>
          </div>

          <div className="card-content">
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="label">Username</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    className="select"
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  >
                    <option value="player">Player</option>
                    <option value="manager">Manager</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center space-x-3">
                <GamepadIcon className="w-6 h-6 text-green" />
                <div>
                  <h3 className="font-semibold text-white">Track Your Stats</h3>
                  <p className="text-sm text-secondary">Monitor your performance across multiple games</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-purple" />
                <div>
                  <h3 className="font-semibold text-white">AI Coach</h3>
                  <p className="text-sm text-secondary">Get personalized feedback and improvement tips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}