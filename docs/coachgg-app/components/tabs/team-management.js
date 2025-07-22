"use client"

import { useState } from "react"
import { Users, Plus, Crown, UserPlus, Settings, Trophy, Target } from "lucide-react"

export default function TeamManagement({ user }) {
  const [activeTab, setActiveTab] = useState("teams")
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    game: ""
  })

  const teams = [
    {
      id: 1,
      name: "Apex Legends",
      game: "Valorant",
      members: 5,
      captain: "ProGamer123",
      winRate: 72,
      isCaptain: true
    },
    {
      id: 2,
      name: "Diamond Squad",
      game: "League of Legends",
      members: 3,
      captain: "LoLMaster",
      winRate: 68,
      isCaptain: false
    }
  ]

  const teamStats = {
    totalTeams: 2,
    captainOf: 1,
    memberOf: 1,
    avgWinRate: 70
  }

  const handleCreateTeam = (e) => {
    e.preventDefault()
    console.log("Creating team:", teamData)
    setIsCreateTeamOpen(false)
    setTeamData({ name: "", description: "", game: "" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-secondary mt-1">Manage your teams and collaborate with teammates</p>
        </div>
        <button
          onClick={() => setIsCreateTeamOpen(true)}
          className="btn btn-primary flex items-center gap-2 glow-green"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Total Teams</p>
                <p className="text-2xl font-bold text-white">{teamStats.totalTeams}</p>
              </div>
              <Users className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Captain Of</p>
                <p className="text-2xl font-bold text-white">{teamStats.captainOf}</p>
              </div>
              <Crown className="w-8 h-8 text-purple" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Member Of</p>
                <p className="text-2xl font-bold text-white">{teamStats.memberOf}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">Avg Win Rate</p>
                <p className="text-2xl font-bold text-white">{teamStats.avgWinRate}%</p>
              </div>
              <Trophy className="w-8 h-8 text-purple" />
            </div>
            <div className="progress mt-2">
              <div className="progress-bar" style={{ width: `${teamStats.avgWinRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="tabs-list">
          <button
            className={`tabs-trigger ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            My Teams
          </button>
          <button
            className={`tabs-trigger ${activeTab === "invites" ? "active" : ""}`}
            onClick={() => setActiveTab("invites")}
          >
            Invitations
          </button>
        </div>

        {activeTab === "teams" && (
          <div className="tabs-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="card">
                  <div className="card-header">
                    <div className="flex items-center justify-between">
                      <h3 className="card-title flex items-center gap-2">
                        {team.isCaptain && <Crown className="w-5 h-5 text-purple" />}
                        {team.name}
                      </h3>
                      <span className="badge badge-outline">{team.game}</span>
                    </div>
                    <p className="card-description">Captain: {team.captain}</p>
                  </div>
                  <div className="card-content">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Members</span>
                        <span className="text-white font-medium">{team.members}/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Win Rate</span>
                        <span className="text-green font-medium">{team.winRate}%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${team.winRate}%` }}></div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm flex-1">
                          View Stats
                        </button>
                        {team.isCaptain && (
                          <button className="btn btn-primary btn-sm">
                            <Settings className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "invites" && (
          <div className="tabs-content">
            <div className="card">
              <div className="card-content">
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No pending invitations</h3>
                  <p className="text-secondary">You don't have any team invitations at the moment.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Compatibility Insight */}
      <div className="card" style={{ background: 'linear-gradient(to right, rgba(155, 48, 255, 0.1), rgba(57, 255, 20, 0.1))', borderColor: 'rgba(155, 48, 255, 0.3)' }}>
        <div className="card-content">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center glow-purple" style={{ background: 'linear-gradient(to right, #9B30FF, #39FF14)' }}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Team Compatibility Analysis</h3>
              <p className="text-secondary mb-4">
                Your playstyle shows 89% compatibility with aggressive entry fraggers. Consider recruiting players with complementary support roles for optimal team balance.
              </p>
              <button className="btn btn-primary btn-sm">View Full Analysis</button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {isCreateTeamOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateTeamOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Team</h2>
              <p className="modal-description">Start building your competitive team</p>
            </div>
            <form onSubmit={handleCreateTeam}>
              <div className="modal-content space-y-4">
                <div>
                  <label className="label">Team Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter team name"
                    value={teamData.name}
                    onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Primary Game</label>
                  <select
                    className="select"
                    value={teamData.game}
                    onChange={(e) => setTeamData({ ...teamData, game: e.target.value })}
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
                  <label className="label">Description (Optional)</label>
                  <textarea
                    className="input"
                    rows="3"
                    placeholder="Describe your team's goals and playstyle"
                    value={teamData.description}
                    onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCreateTeamOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}