"use client"

import { useState } from "react"
import { Calendar, Users, Plus, BarChart3, Clock, Trophy, Target } from "lucide-react"

export default function ManagerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: ""
  })

  const managedPlayers = [
    {
      id: 1,
      username: "ProGamer123",
      game: "Valorant",
      rank: "Diamond II",
      winRate: 72,
      recentMatches: 15,
      improvement: "+8%"
    },
    {
      id: 2,
      username: "LoLMaster",
      game: "League of Legends", 
      rank: "Platinum I",
      winRate: 68,
      recentMatches: 12,
      improvement: "+5%"
    },
    {
      id: 3,
      username: "DotaKing",
      game: "Dota 2",
      rank: "Ancient III",
      winRate: 64,
      recentMatches: 18,
      improvement: "-2%"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Team Practice Session",
      date: "2024-01-20",
      time: "18:00",
      type: "practice",
      attendees: 5
    },
    {
      id: 2,
      title: "Strategy Review Meeting",
      date: "2024-01-22",
      time: "19:30",
      type: "meeting",
      attendees: 8
    },
    {
      id: 3,
      title: "Tournament Qualifier",
      date: "2024-01-25",
      time: "20:00",
      type: "tournament",
      attendees: 5
    }
  ]

  const managerStats = {
    totalPlayers: 12,
    activeTeams: 3,
    upcomingEvents: 5,
    avgImprovement: 6.2
  }

  const handleAddEvent = (e) => {
    e.preventDefault()
    console.log("Adding event:", eventData)
    setIsAddEventOpen(false)
    setEventData({ title: "", description: "", date: "", time: "", type: "" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
          <p className="text-secondary mt-1">Oversee your players and teams performance</p>
        </div>
        <button
          onClick={() => setIsAddEventOpen(true)}
          className="btn btn-primary flex items-center gap-2 glow-green"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">{managerStats.totalPlayers}</p>
              </div>
              <Users className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Active Teams</p>
                <p className="text-2xl font-bold text-white">{managerStats.activeTeams}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Upcoming Events</p>
                <p className="text-2xl font-bold text-white">{managerStats.upcomingEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Avg Improvement</p>
                <p className="text-2xl font-bold text-white">+{managerStats.avgImprovement}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="tabs-list">
          <button
            className={`tabs-trigger ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tabs-trigger ${activeTab === "players" ? "active" : ""}`}
            onClick={() => setActiveTab("players")}
          >
            Players
          </button>
          <button
            className={`tabs-trigger ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="tabs-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple" />
                    Top Performers
                  </h3>
                  <p className="card-description">Players showing the most improvement</p>
                </div>
                <div className="card-content">
                  <div className="space-y-3">
                    {managedPlayers.slice(0, 3).map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-primary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white">{player.username}</p>
                            <p className="text-sm text-secondary">{player.game}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green font-medium">{player.improvement}</p>
                          <p className="text-xs text-secondary">{player.winRate}% WR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green" />
                    Upcoming Events
                  </h3>
                  <p className="card-description">Next scheduled activities</p>
                </div>
                <div className="card-content">
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-primary rounded-lg">
                        <div>
                          <p className="font-medium text-white">{event.title}</p>
                          <p className="text-sm text-secondary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.date} at {event.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${
                            event.type === "tournament" ? "badge-primary" :
                            event.type === "practice" ? "badge-secondary" : "badge-outline"
                          }`}>
                            {event.type}
                          </span>
                          <p className="text-xs text-secondary mt-1">{event.attendees} attendees</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "players" && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Managed Players</h3>
                <p className="card-description">Performance overview of all your players</p>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {managedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 bg-primary rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          <span className="bg-green text-primary font-bold">
                            {player.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{player.username}</p>
                          <p className="text-sm text-secondary">{player.game} • {player.rank}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-secondary">Win Rate</p>
                          <p className="font-medium text-white">{player.winRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-secondary">Recent Matches</p>
                          <p className="font-medium text-white">{player.recentMatches}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-secondary">Improvement</p>
                          <p className={`font-medium ${player.improvement.startsWith('+') ? 'text-green' : 'text-red'}`}>
                            {player.improvement}
                          </p>
                        </div>
                        <button className="btn btn-outline btn-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Event Calendar</h3>
                <p className="card-description">Manage your team's schedule</p>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-primary rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          event.type === "tournament" ? "bg-green" :
                          event.type === "practice" ? "bg-purple" : "bg-secondary"
                        }`} />
                        <div>
                          <p className="font-medium text-white">{event.title}</p>
                          <p className="text-sm text-secondary">{event.attendees} attendees</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-white">{event.date}</p>
                          <p className="text-sm text-secondary">{event.time}</p>
                        </div>
                        <button className="btn btn-outline btn-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="modal-overlay" onClick={() => setIsAddEventOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Event</h2>
              <p className="modal-description">Schedule a new team activity</p>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="modal-content space-y-4">
                <div>
                  <label className="label">Event Title</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter event title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Event Type</label>
                  <select
                    className="select"
                    value={eventData.type}
                    onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                    required
                  >
                    <option value="">Select event type</option>
                    <option value="practice">Practice Session</option>
                    <option value="meeting">Team Meeting</option>
                    <option value="tournament">Tournament</option>
                    <option value="scrim">Scrim Match</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      className="input"
                      value={eventData.date}
                      onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Time</label>
                    <input
                      type="time"
                      className="input"
                      value={eventData.time}
                      onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Description (Optional)</label>
                  <textarea
                    className="input"
                    rows="3"
                    placeholder="Add event details or notes"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddEventOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}