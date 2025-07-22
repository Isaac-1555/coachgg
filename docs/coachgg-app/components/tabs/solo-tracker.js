"use client"

import { useState } from "react"
import { Plus, Target, Clock, Gamepad2, BarChart3, Trophy, Zap } from "lucide-react"

export default function SoloTracker({ user }) {
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("matches")
  const [matchData, setMatchData] = useState({
    game: "",
    result: "",
    kills: "",
    deaths: "",
    assists: "",
    duration: "",
  })

  const matches = [
    {
      id: 1,
      game: "Valorant",
      result: "Win",
      kills: 18,
      deaths: 12,
      assists: 7,
      duration: "32m",
      date: "2024-01-15",
      map: "Bind"
    },
    {
      id: 2,
      game: "League of Legends",
      result: "Loss",
      kills: 8,
      deaths: 6,
      assists: 12,
      duration: "28m",
      date: "2024-01-14",
      map: "Summoner's Rift"
    },
    {
      id: 3,
      game: "Valorant",
      result: "Win",
      kills: 22,
      deaths: 8,
      assists: 5,
      duration: "35m",
      date: "2024-01-14",
      map: "Haven"
    }
  ]

  const stats = {
    totalMatches: 127,
    winRate: 68,
    avgKDA: 1.8,
    bestStreak: 8,
    recentForm: [true, true, false, true, true] // true = win, false = loss
  }

  const handleSubmitMatch = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting match:", matchData)
    setIsAddMatchOpen(false)
    setMatchData({
      game: "",
      result: "",
      kills: "",
      deaths: "",
      assists: "",
      duration: "",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Solo Tracker</h1>
          <p className="text-secondary mt-1">Track your individual performance and improvement</p>
        </div>
        <button
          onClick={() => setIsAddMatchOpen(true)}
          className="btn btn-primary flex items-center gap-2 glow-green"
        >
          <Plus className="w-4 h-4" />
          Add Match
        </button>
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
                <p className="text-secondary text-sm">Avg KDA</p>
                <p className="text-2xl font-bold text-white">{stats.avgKDA}</p>
              </div>
              <Target className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Best Streak</p>
                <p className="text-2xl font-bold text-white">{stats.bestStreak}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Form</h3>
          <p className="card-description">Your last 5 matches</p>
        </div>
        <div className="card-content">
          <div className="flex items-center space-x-2">
            {stats.recentForm.map((isWin, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isWin ? "bg-green text-primary" : "bg-red text-white"
                }`}
              >
                {isWin ? "W" : "L"}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="tabs-list">
          <button
            className={`tabs-trigger ${activeTab === "matches" ? "active" : ""}`}
            onClick={() => setActiveTab("matches")}
          >
            Match History
          </button>
          <button
            className={`tabs-trigger ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            Statistics
          </button>
        </div>

        {activeTab === "matches" && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Match History</h3>
                <p className="card-description">Your recent gaming sessions</p>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {matches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-primary rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${match.result === "Win" ? "bg-green" : "bg-red"}`} />
                        <div>
                          <p className="font-medium text-white">{match.game}</p>
                          <p className="text-sm text-secondary">{match.map}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-secondary">KDA</p>
                          <p className="font-medium text-white">{match.kills}/{match.deaths}/{match.assists}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-secondary">Duration</p>
                          <p className="font-medium text-white">{match.duration}</p>
                        </div>
                        <div className="text-center">
                          <span className={`badge ${match.result === "Win" ? "badge-success" : "badge-danger"}`}>
                            {match.result}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="tabs-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Performance Trends</h3>
                  <p className="card-description">Your improvement over time</p>
                </div>
                <div className="card-content">
                  <p className="text-secondary">Chart visualization would go here</p>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Game Breakdown</h3>
                  <p className="card-description">Performance by game</p>
                </div>
                <div className="card-content">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Valorant</span>
                      <span className="text-green">72% WR</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">League of Legends</span>
                      <span className="text-purple">64% WR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Match Modal */}
      {isAddMatchOpen && (
        <div className="modal-overlay" onClick={() => setIsAddMatchOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Match</h2>
              <p className="modal-description">Record your latest gaming session</p>
            </div>
            <form onSubmit={handleSubmitMatch}>
              <div className="modal-content space-y-4">
                <div>
                  <label className="label">Game</label>
                  <select
                    className="select"
                    value={matchData.game}
                    onChange={(e) => setMatchData({ ...matchData, game: e.target.value })}
                    required
                  >
                    <option value="">Select a game</option>
                    <option value="valorant">Valorant</option>
                    <option value="lol">League of Legends</option>
                    <option value="dota2">Dota 2</option>
                    <option value="csgo">CS:GO</option>
                  </select>
                </div>
                <div>
                  <label className="label">Result</label>
                  <select
                    className="select"
                    value={matchData.result}
                    onChange={(e) => setMatchData({ ...matchData, result: e.target.value })}
                    required
                  >
                    <option value="">Select result</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="draw">Draw</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Kills</label>
                    <input
                      type="number"
                      className="input"
                      value={matchData.kills}
                      onChange={(e) => setMatchData({ ...matchData, kills: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Deaths</label>
                    <input
                      type="number"
                      className="input"
                      value={matchData.deaths}
                      onChange={(e) => setMatchData({ ...matchData, deaths: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Assists</label>
                    <input
                      type="number"
                      className="input"
                      value={matchData.assists}
                      onChange={(e) => setMatchData({ ...matchData, assists: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="input"
                    value={matchData.duration}
                    onChange={(e) => setMatchData({ ...matchData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddMatchOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}