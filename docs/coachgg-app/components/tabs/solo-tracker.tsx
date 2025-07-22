"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Target, Clock, Gamepad2, BarChart3, Trophy, Zap } from "lucide-react"

interface SoloTrackerProps {
  user: any
}

export default function SoloTracker({ user }: SoloTrackerProps) {
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false)
  const [matchData, setMatchData] = useState({
    game: "",
    result: "",
    kills: "",
    deaths: "",
    assists: "",
    duration: "",
  })

  const games = ["Valorant", "League of Legends", "CS2", "Dota 2", "Overwatch 2"]

  const matches = [
    {
      id: 1,
      game: "Valorant",
      result: "Win",
      kda: "18/12/7",
      duration: "32m",
      date: "2 hours ago",
      map: "Ascent",
    },
    {
      id: 2,
      game: "League of Legends",
      result: "Loss",
      kda: "8/6/12",
      duration: "28m",
      date: "1 day ago",
      champion: "Jinx",
    },
    {
      id: 3,
      game: "Valorant",
      result: "Win",
      kda: "22/8/5",
      duration: "41m",
      date: "2 days ago",
      map: "Bind",
    },
  ]

  const stats = {
    valorant: {
      matches: 45,
      winRate: 72,
      avgKDA: 1.4,
      bestMap: "Ascent",
    },
    lol: {
      matches: 38,
      winRate: 64,
      avgKDA: 1.8,
      bestRole: "ADC",
    },
  }

  const handleAddMatch = () => {
    // Simulate adding match
    console.log("Adding match:", matchData)
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
          <p className="text-[#AAAAAA] mt-1">Track your individual performance and improvement</p>
        </div>
        <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white">
            <DialogHeader>
              <DialogTitle>Add New Match</DialogTitle>
              <DialogDescription className="text-[#AAAAAA]">Record your latest gaming session</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="game">Game</Label>
                  <Select value={matchData.game} onValueChange={(value) => setMatchData({ ...matchData, game: value })}>
                    <SelectTrigger className="bg-[#0D0D0D] border-[#333333]">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                      {games.map((game) => (
                        <SelectItem key={game} value={game}>
                          {game}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <Select
                    value={matchData.result}
                    onValueChange={(value) => setMatchData({ ...matchData, result: value })}
                  >
                    <SelectTrigger className="bg-[#0D0D0D] border-[#333333]">
                      <SelectValue placeholder="Win/Loss" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                      <SelectItem value="Win">Win</SelectItem>
                      <SelectItem value="Loss">Loss</SelectItem>
                      <SelectItem value="Draw">Draw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kills">Kills</Label>
                  <Input
                    id="kills"
                    type="number"
                    value={matchData.kills}
                    onChange={(e) => setMatchData({ ...matchData, kills: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deaths">Deaths</Label>
                  <Input
                    id="deaths"
                    type="number"
                    value={matchData.deaths}
                    onChange={(e) => setMatchData({ ...matchData, deaths: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assists">Assists</Label>
                  <Input
                    id="assists"
                    type="number"
                    value={matchData.assists}
                    onChange={(e) => setMatchData({ ...matchData, assists: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={matchData.duration}
                  onChange={(e) => setMatchData({ ...matchData, duration: e.target.value })}
                  className="bg-[#0D0D0D] border-[#333333]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMatch} className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                Add Match
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Game Stats Tabs */}
      <Tabs defaultValue="valorant" className="w-full">
        <TabsList className="bg-[#1A1A1A] border-[#333333]">
          <TabsTrigger value="valorant" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-[#0D0D0D]">
            Valorant
          </TabsTrigger>
          <TabsTrigger value="lol" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-[#0D0D0D]">
            League of Legends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="valorant" className="space-y-6">
          {/* Valorant Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Matches</p>
                    <p className="text-xl font-bold text-white">{stats.valorant.matches}</p>
                  </div>
                  <Gamepad2 className="w-6 h-6 text-[#39FF14]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Win Rate</p>
                    <p className="text-xl font-bold text-white">{stats.valorant.winRate}%</p>
                  </div>
                  <Trophy className="w-6 h-6 text-[#9B30FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Avg KDA</p>
                    <p className="text-xl font-bold text-white">{stats.valorant.avgKDA}</p>
                  </div>
                  <Target className="w-6 h-6 text-[#39FF14]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Best Map</p>
                    <p className="text-xl font-bold text-white">{stats.valorant.bestMap}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-[#9B30FF]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lol" className="space-y-6">
          {/* League of Legends Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Matches</p>
                    <p className="text-xl font-bold text-white">{stats.lol.matches}</p>
                  </div>
                  <Gamepad2 className="w-6 h-6 text-[#39FF14]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Win Rate</p>
                    <p className="text-xl font-bold text-white">{stats.lol.winRate}%</p>
                  </div>
                  <Trophy className="w-6 h-6 text-[#9B30FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Avg KDA</p>
                    <p className="text-xl font-bold text-white">{stats.lol.avgKDA}</p>
                  </div>
                  <Target className="w-6 h-6 text-[#39FF14]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Best Role</p>
                    <p className="text-xl font-bold text-white">{stats.lol.bestRole}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-[#9B30FF]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Matches */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#39FF14]" />
            Recent Matches
          </CardTitle>
          <CardDescription className="text-[#AAAAAA]">Your latest gaming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${match.result === "Win" ? "bg-[#39FF14]" : "bg-red-500"}`} />
                  <div>
                    <p className="text-white font-medium">{match.game}</p>
                    <p className="text-[#AAAAAA] text-sm">
                      {match.map || match.champion} • {match.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white font-medium">KDA: {match.kda}</p>
                    <p className="text-[#AAAAAA] text-sm">{match.date}</p>
                  </div>
                  <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-[#9B30FF]/10 to-[#39FF14]/10 border-[#9B30FF]/30">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#9B30FF] to-[#39FF14] rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Performance Insight</h3>
              <p className="text-[#AAAAAA] mb-4">
                Your Valorant performance shows consistent improvement in aim accuracy (+15% over last 10 matches).
                Consider working on map positioning to further boost your win rate.
              </p>
              <div className="flex space-x-2">
                <Badge className="bg-[#39FF14] text-[#0D0D0D]">Aim: Improving</Badge>
                <Badge className="bg-[#9B30FF] text-white">Positioning: Focus Area</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
