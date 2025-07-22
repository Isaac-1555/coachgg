"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, TrendingUp, Calendar, Gamepad2, Users, Award, Zap } from "lucide-react"

interface OverviewProps {
  user: any
}

export default function Overview({ user }: OverviewProps) {
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
          <p className="text-[#AAAAAA] mt-1">Ready to level up your game today?</p>
        </div>
        <Badge className="bg-[#39FF14] text-[#0D0D0D] hover:bg-[#2ECC11]">{stats.rank}</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#AAAAAA] text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-white">{stats.totalMatches}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-[#39FF14]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#AAAAAA] text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
              </div>
              <Trophy className="w-8 h-8 text-[#9B30FF]" />
            </div>
            <Progress value={stats.winRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#AAAAAA] text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#39FF14]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#AAAAAA] text-sm">Hours Played</p>
                <p className="text-2xl font-bold text-white">{stats.hoursPlayed}</p>
              </div>
              <Calendar className="w-8 h-8 text-[#9B30FF]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#39FF14]" />
              Recent Matches
            </CardTitle>
            <CardDescription className="text-[#AAAAAA]">Your latest gaming sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#0D0D0D] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${match.result === "Win" ? "bg-[#39FF14]" : "bg-red-500"}`} />
                    <div>
                      <p className="text-white font-medium">{match.game}</p>
                      <p className="text-[#AAAAAA] text-sm">KDA: {match.kda}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result}</Badge>
                    <p className="text-[#AAAAAA] text-xs mt-1">{match.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#9B30FF]" />
              Recent Achievements
            </CardTitle>
            <CardDescription className="text-[#AAAAAA]">Your latest unlocks and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#0D0D0D] rounded-lg">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${achievement.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: achievement.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{achievement.title}</p>
                      <p className="text-[#AAAAAA] text-sm">{achievement.description}</p>
                    </div>
                    <Zap className="w-4 h-4 text-[#39FF14]" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Coach Suggestion */}
      <Card className="bg-gradient-to-r from-[#9B30FF]/10 to-[#39FF14]/10 border-[#9B30FF]/30">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#9B30FF] to-[#39FF14] rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">AI Coach Insight</h3>
              <p className="text-[#AAAAAA] mb-4">
                Your aim accuracy has improved by 12% over the last 5 matches! Try focusing on crosshair placement in
                your next Valorant session to maintain this upward trend.
              </p>
              <Badge className="bg-[#39FF14] text-[#0D0D0D] hover:bg-[#2ECC11]">View Full Analysis</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
