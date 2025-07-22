"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Crown, Mail, Trophy, Target, TrendingUp, UserPlus, Settings } from "lucide-react"

interface TeamManagementProps {
  user: any
}

export default function TeamManagement({ user }: TeamManagementProps) {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [teamData, setTeamData] = useState({ name: "", description: "" })
  const [inviteEmail, setInviteEmail] = useState("")

  const teams = [
    {
      id: 1,
      name: "Phoenix Esports",
      role: "Captain",
      members: 5,
      game: "Valorant",
      winRate: 78,
      rank: "Immortal",
      members_list: [
        { id: 1, username: "ProPlayer1", role: "Duelist", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 2, username: "SupportMain", role: "Controller", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 3, username: "FlashMaster", role: "Initiator", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 4, username: "AnkerHold", role: "Sentinel", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: 2,
      name: "Nexus Gaming",
      role: "Member",
      members: 6,
      game: "League of Legends",
      winRate: 65,
      rank: "Diamond",
      members_list: [
        { id: 5, username: "TopLaner", role: "Top", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 6, username: "JungleKing", role: "Jungle", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 7, username: "MidGod", role: "Mid", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 8, username: "ADCMain", role: "ADC", avatar: "/placeholder.svg?height=32&width=32" },
        { id: 9, username: "SupportPro", role: "Support", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ]

  const handleCreateTeam = () => {
    console.log("Creating team:", teamData)
    setIsCreateTeamOpen(false)
    setTeamData({ name: "", description: "" })
  }

  const handleInvite = () => {
    console.log("Inviting:", inviteEmail)
    setIsInviteOpen(false)
    setInviteEmail("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-[#AAAAAA] mt-1">Manage your teams and collaborate with teammates</p>
        </div>
        <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription className="text-[#AAAAAA]">
                Start a new team and invite players to join
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamData.name}
                  onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                  className="bg-[#0D0D0D] border-[#333333]"
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description (Optional)</Label>
                <Input
                  id="team-description"
                  value={teamData.description}
                  onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                  className="bg-[#0D0D0D] border-[#333333]"
                  placeholder="Team description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTeam} className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams List */}
      <div className="space-y-6">
        {teams.map((team) => (
          <Card key={team.id} className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#39FF14] to-[#9B30FF] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {team.name}
                      {team.role === "Captain" && <Crown className="w-4 h-4 text-[#39FF14]" />}
                    </CardTitle>
                    <CardDescription className="text-[#AAAAAA]">
                      {team.game} • {team.members} members • {team.role}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-[#9B30FF] text-white">{team.rank}</Badge>
                  <Badge variant="outline" className="border-[#39FF14] text-[#39FF14]">
                    {team.winRate}% WR
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="bg-[#0D0D0D] border-[#333333]">
                  <TabsTrigger
                    value="members"
                    className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-[#0D0D0D]"
                  >
                    Members
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-[#0D0D0D]"
                  >
                    Team Stats
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">Team Members</h4>
                      {team.role === "Captain" && (
                        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-[#0D0D0D] bg-transparent"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Invite
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white">
                            <DialogHeader>
                              <DialogTitle>Invite Player</DialogTitle>
                              <DialogDescription className="text-[#AAAAAA]">
                                Send an invitation to join {team.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="invite-email">Email Address</Label>
                                <Input
                                  id="invite-email"
                                  type="email"
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                  className="bg-[#0D0D0D] border-[#333333]"
                                  placeholder="player@example.com"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleInvite} className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                                <Mail className="w-4 h-4 mr-2" />
                                Send Invite
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div className="grid gap-3">
                      {team.members_list.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-[#0D0D0D] rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-[#39FF14] text-[#0D0D0D] text-xs">
                                {member.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{member.username}</p>
                              <p className="text-[#AAAAAA] text-sm">{member.role}</p>
                            </div>
                          </div>
                          {team.role === "Captain" && (
                            <Button size="sm" variant="ghost" className="text-[#AAAAAA] hover:text-white">
                              <Settings className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-[#0D0D0D] border-[#333333]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#AAAAAA] text-sm">Team Matches</p>
                            <p className="text-xl font-bold text-white">42</p>
                          </div>
                          <Trophy className="w-6 h-6 text-[#39FF14]" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0D0D0D] border-[#333333]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#AAAAAA] text-sm">Win Rate</p>
                            <p className="text-xl font-bold text-white">{team.winRate}%</p>
                          </div>
                          <Target className="w-6 h-6 text-[#9B30FF]" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0D0D0D] border-[#333333]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#AAAAAA] text-sm">Current Rank</p>
                            <p className="text-xl font-bold text-white">{team.rank}</p>
                          </div>
                          <TrendingUp className="w-6 h-6 text-[#39FF14]" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {teams.length === 0 && (
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-[#666666] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
            <p className="text-[#AAAAAA] mb-6">Create your first team or wait for an invitation</p>
            <Button
              className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]"
              onClick={() => setIsCreateTeamOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
