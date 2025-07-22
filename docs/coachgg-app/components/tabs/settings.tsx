"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, LogOut, Save, Upload } from "lucide-react"

interface SettingsProps {
  user: any
  onLogout: () => void
}

export default function Settings({ user, onLogout }: SettingsProps) {
  const [profile, setProfile] = useState({
    username: user.username,
    email: user.email,
    bio: "",
    timezone: "UTC-5",
  })

  const [notifications, setNotifications] = useState({
    matchReminders: true,
    teamInvites: true,
    aiInsights: true,
    weeklyReports: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    statsVisibility: "team",
    allowTeamInvites: true,
  })

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
    // Simulate API call
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notifications)
    // Simulate API call
  }

  const handleSavePrivacy = () => {
    console.log("Saving privacy:", privacy)
    // Simulate API call
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-[#AAAAAA] mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#39FF14]" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.profile_avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#39FF14] text-[#0D0D0D] text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-[#0D0D0D] bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-[#AAAAAA] text-sm mt-1">JPG, PNG or GIF (max 2MB)</p>
                </div>
              </div>

              <Separator className="bg-[#333333]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-[#0D0D0D] border-[#333333] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="bg-[#0D0D0D] border-[#333333] text-white"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-white">
                  Timezone
                </Label>
                <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC+0">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#9B30FF]" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Match Reminders</p>
                  <p className="text-[#AAAAAA] text-sm">Get notified about upcoming matches</p>
                </div>
                <Switch
                  checked={notifications.matchReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, matchReminders: checked })}
                />
              </div>

              <Separator className="bg-[#333333]" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Team Invites</p>
                  <p className="text-[#AAAAAA] text-sm">Notifications for team invitations</p>
                </div>
                <Switch
                  checked={notifications.teamInvites}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, teamInvites: checked })}
                />
              </div>

              <Separator className="bg-[#333333]" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">AI Insights</p>
                  <p className="text-[#AAAAAA] text-sm">Performance insights and suggestions</p>
                </div>
                <Switch
                  checked={notifications.aiInsights}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, aiInsights: checked })}
                />
              </div>

              <Separator className="bg-[#333333]" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Weekly Reports</p>
                  <p className="text-[#AAAAAA] text-sm">Summary of your weekly performance</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>

              <Button onClick={handleSaveNotifications} className="bg-[#9B30FF] hover:bg-[#8A2BE2] text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#39FF14]" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                >
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Stats Visibility</Label>
                <Select
                  value={privacy.statsVisibility}
                  onValueChange={(value) => setPrivacy({ ...privacy, statsVisibility: value })}
                >
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="team">Team Members Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Allow Team Invites</p>
                  <p className="text-[#AAAAAA] text-sm">Let others invite you to teams</p>
                </div>
                <Switch
                  checked={privacy.allowTeamInvites}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, allowTeamInvites: checked })}
                />
              </div>

              <Button onClick={handleSavePrivacy} className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">
                <Save className="w-4 h-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#9B30FF]" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="dark">Dark (Current)</SelectItem>
                    <SelectItem value="light" disabled>
                      Light (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Accent Color</Label>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-[#39FF14] rounded-lg border-2 border-white cursor-pointer" />
                  <div className="w-8 h-8 bg-[#9B30FF] rounded-lg border border-[#333333] cursor-pointer" />
                  <div className="w-8 h-8 bg-blue-500 rounded-lg border border-[#333333] cursor-pointer" />
                  <div className="w-8 h-8 bg-red-500 rounded-lg border border-[#333333] cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-[#333333] text-white hover:bg-[#333333] bg-transparent"
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#333333] text-white hover:bg-[#333333] bg-transparent"
              >
                Reset Statistics
              </Button>
              <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#9B30FF]/10 to-[#39FF14]/10 border-[#9B30FF]/30">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-2">CoachGG Pro</h3>
              <p className="text-[#AAAAAA] text-sm mb-3">
                Unlock advanced analytics, unlimited team creation, and priority AI coaching.
              </p>
              <Button className="w-full bg-gradient-to-r from-[#9B30FF] to-[#39FF14] text-white">Upgrade Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
