"use client"

import { Trophy, Target, TrendingUp, Calendar, Gamepad2, Users, Award, Zap } from "lucide-react"

export default function Overview({ user }) {
  const stats = {
    totalMatches: 127,
    winRate: 68,
    currentStreak: 5,
    rank: "Diamond II",
    favoriteGame: "Valorant",
    hoursPlayed: 234,
  }

  const recentMatches = [
    { game: "Valorant", result: "Win", kda: "18/12/7", date: "2 hours ago" },
    { game: "League of Legends", result: "Loss", kda: "8/6/12", date: "1 day ago" },
    { game: "Valorant", result: "Win", kda: "22/8/5", date: "2 days ago" },
  ]

  const achievements = [
    { title: "First Blood", description: "10 first kills in ranked", icon: Target, color: "#39FF14" },
    { title: "Team Player", description: "Join your first team", icon: Users, color: "#9B30FF" },
    { title: "Consistency", description: "5 game win streak", icon: TrendingUp, color: "#39FF14" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user.username}!</h1>
          <p className="text-secondary mt-1">Ready to level up your game today?</p>
        </div>
        <span className="badge badge-primary">{stats.rank}</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-white">{stats.totalMatches}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
              </div>
              <Trophy className="w-8 h-8 text-purple" />
            </div>
            <div className="progress mt-2">
              <div className="progress-bar" style={{ width: `${stats.winRate}%` }}></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Hours Played</p>
                <p className="text-2xl font-bold text-white">{stats.hoursPlayed}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-green" />
              Recent Matches
            </h3>
            <p className="card-description">Your latest gaming sessions</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${match.result === "Win" ? "bg-green" : "bg-red"}`} />
                    <div>
                      <p className="text-white font-medium">{match.game}</p>
                      <p className="text-secondary text-sm">KDA: {match.kda}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${match.result === "Win" ? "badge-success" : "badge-danger"}`}>
                      {match.result}
                    </span>
                    <p className="text-secondary text-xs mt-1">{match.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Award className="w-5 h-5 text-purple" />
              Recent Achievements
            </h3>
            <p className="card-description">Your latest unlocks and milestones</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-primary rounded-lg">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${achievement.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: achievement.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{achievement.title}</p>
                      <p className="text-secondary text-sm">{achievement.description}</p>
                    </div>
                    <Zap className="w-4 h-4 text-green" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Suggestion */}
      <div className="card" style={{ background: 'linear-gradient(to right, rgba(155, 48, 255, 0.1), rgba(57, 255, 20, 0.1))', borderColor: 'rgba(155, 48, 255, 0.3)' }}>
        <div className="card-content">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center glow-purple" style={{ background: 'linear-gradient(to right, #9B30FF, #39FF14)' }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">AI Coach Insight</h3>
              <p className="text-secondary mb-4">
                Your aim accuracy has improved by 12% over the last 5 matches! Try focusing on crosshair placement in
                your next Valorant session to maintain this upward trend.
              </p>
              <button className="btn btn-primary btn-sm">View Full Analysis</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}