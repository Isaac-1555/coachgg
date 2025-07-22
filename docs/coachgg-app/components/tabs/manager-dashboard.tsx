"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Crown, CalendarIcon, Users, BarChart3, FileText, Clock, Target, TrendingUp } from "lucide-react"
import { format } from "date-fns"

interface ManagerDashboardProps {
  user: any
}

export default function ManagerDashboard({ user }: ManagerDashboardProps) {
  const [isEventOpen, setIsEventOpen] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [eventDate, setEventDate] = useState<Date>()
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    team: "",
  })
  const [noteData, setNoteData] = useState({
    player: "",
    content: "",
    type: "performance",
  })

  const managedTeams = [
    {
      id: 1,
      name: "Phoenix Esports",
      game: "Valorant",
      members: 5,
      winRate: 78,
      recentPerformance: "improving",
    },
    {
      id: 2,
      name: "Storm Gaming",
      game: "League of Legends",
      members: 6,
      winRate: 65,
      recentPerformance: "stable",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Scrim vs Team Alpha",
      date: "2024-01-15",
      time: "19:00",
      team: "Phoenix Esports",
      type: "practice",
    },
    {
      id: 2,
      title: "Tournament Qualifier",
      date: "2024-01-18",
      time: "15:00",
      team: "Storm Gaming",
      type: "tournament",
    },
  ]

  const playerNotes = [
    {
      id: 1,
      player: "ProPlayer1",
      content: "Excellent aim improvement, work on positioning",
      type: "performance",
      date: "2 days ago",
    },
    {
      id: 2,
      player: "SupportMain",
      content: "Great team communication, keep it up",
      type: "positive",
      date: "1 week ago",
    },
  ]

  const handleCreateEvent = () => {
    console.log("Creating event:", { ...eventData, date: eventDate })
    setIsEventOpen(false)
    setEventData({ title: "", description: "", team: "" })
    setEventDate(undefined)
  }

  const handleAddNote = () => {
    console.log("Adding note:", noteData)
    setIsNoteOpen(false)
    setNoteData({ player: "", content: "", type: "performance" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Crown className="w-8 h-8 text-[#39FF14]" />
            Manager Dashboard
          </h1>
          <p className="text-[#AAAAAA] mt-1">Manage your teams, schedule events, and track player progress</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#9B30FF] hover:bg-[#8A2BE2] text-white">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white">
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription className="text-[#AAAAAA]">Schedule a new event for your team</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                    placeholder="Scrim vs Team Alpha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-team">Team</Label>
                  <Select value={eventData.team} onValueChange={(value) => setEventData({ ...eventData, team: value })}>
                    <SelectTrigger className="bg-[#0D0D0D] border-[#333333]">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                      {managedTeams.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#0D0D0D] border-[#333333] hover:bg-[#333333]"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-[#333333]">
                      <Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                    placeholder="Event details..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateEvent} className="bg-[#9B30FF] hover:bg-[#8A2BE2] text-white">
                  Create Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white">
              <DialogHeader>
                <DialogTitle>Add Player Note</DialogTitle>
                <DialogDescription className="text-[#AAAAAA]">
                  Record observations about player performance
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="note-player">Player</Label>
                  <Input
                    id="note-player"
                    value={noteData.player}
                    onChange={(e) => setNoteData({ ...noteData, player: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                    placeholder="Player username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note-type">Note Type</Label>
                  <Select value={noteData.type} onValueChange={(value) => setNoteData({ ...noteData, type: value })}>
                    <SelectTrigger className="bg-[#0D0D0D] border-[#333333]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="improvement">Needs Improvement</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note-content">Note Content</Label>
                  <Textarea
                    id="note-content"
                    value={noteData.content}
                    onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333]"
                    placeholder="Your observations..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddNote} className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                  Add Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {managedTeams.map((team) => (
          <Card key={team.id} className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{team.name}</CardTitle>
                  <CardDescription className="text-[#AAAAAA]">
                    {team.game} • {team.members} members
                  </CardDescription>
                </div>
                <Badge
                  className={`${
                    team.recentPerformance === "improving" ? "bg-[#39FF14] text-[#0D0D0D]" : "bg-[#9B30FF] text-white"
                  }`}
                >
                  {team.recentPerformance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{team.members}</p>
                  <p className="text-[#AAAAAA] text-sm">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{team.winRate}%</p>
                  <p className="text-[#AAAAAA] text-sm">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">42</p>
                  <p className="text-[#AAAAAA] text-sm">Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#9B30FF]" />
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-[#AAAAAA]">Scheduled matches and practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-[#0D0D0D] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.type === "tournament" ? "bg-[#39FF14]" : "bg-[#9B30FF]"
                      }`}
                    />
                    <div>
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-[#AAAAAA] text-sm">{event.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{event.date}</p>
                    <p className="text-[#AAAAAA] text-xs">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Player Notes */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#39FF14]" />
              Recent Notes
            </CardTitle>
            <CardDescription className="text-[#AAAAAA]">Player observations and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {playerNotes.map((note) => (
                <div key={note.id} className="p-3 bg-[#0D0D0D] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{note.player}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        note.type === "positive" ? "border-[#39FF14] text-[#39FF14]" : "border-[#9B30FF] text-[#9B30FF]"
                      }`}
                    >
                      {note.type}
                    </Badge>
                  </div>
                  <p className="text-[#AAAAAA] text-sm mb-2">{note.content}</p>
                  <p className="text-[#666666] text-xs">{note.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#39FF14]" />
            Team Performance Analytics
          </CardTitle>
          <CardDescription className="text-[#AAAAAA]">Overview of all managed teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[#0D0D0D] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Total Teams</p>
                    <p className="text-2xl font-bold text-white">{managedTeams.length}</p>
                  </div>
                  <Users className="w-6 h-6 text-[#39FF14]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Avg Win Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(managedTeams.reduce((acc, team) => acc + team.winRate, 0) / managedTeams.length)}%
                    </p>
                  </div>
                  <Target className="w-6 h-6 text-[#9B30FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Events This Week</p>
                    <p className="text-2xl font-bold text-white">{upcomingEvents.length}</p>
                  </div>
                  <Clock className="w-6 h-6 text-[#39FF14]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#AAAAAA] text-sm">Improving Teams</p>
                    <p className="text-2xl font-bold text-white">
                      {managedTeams.filter((team) => team.recentPerformance === "improving").length}
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-[#9B30FF]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
