"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Zap, TrendingUp, Target, AlertCircle, CheckCircle, Lightbulb, BarChart3 } from "lucide-react"

interface AICoachProps {
  user: any
}

export default function AICoach({ user }: AICoachProps) {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI Coach. I've analyzed your recent performance and I'm ready to help you improve. What would you like to work on today?",
      timestamp: "2 minutes ago",
    },
  ])

  const insights = [
    {
      id: 1,
      type: "improvement",
      title: "Aim Consistency",
      description:
        "Your headshot percentage has improved by 15% over the last 10 matches. Keep practicing aim training!",
      priority: "high",
      game: "Valorant",
    },
    {
      id: 2,
      type: "warning",
      title: "Map Positioning",
      description: "You tend to overextend on Bind. Try playing more defensively and use your utility first.",
      priority: "medium",
      game: "Valorant",
    },
    {
      id: 3,
      type: "positive",
      title: "Team Communication",
      description: "Excellent callouts in your last 5 matches. Your team coordination has significantly improved.",
      priority: "low",
      game: "General",
    },
  ]

  const suggestions = [
    {
      id: 1,
      title: "Aim Training Routine",
      description: "Spend 15 minutes daily on aim trainers focusing on flick shots",
      category: "Mechanical Skills",
      difficulty: "Easy",
    },
    {
      id: 2,
      title: "Map Study Session",
      description: "Review common angles and positioning on Ascent and Bind",
      category: "Game Knowledge",
      difficulty: "Medium",
    },
    {
      id: 3,
      title: "VOD Review",
      description: "Analyze your last 3 losses to identify decision-making patterns",
      category: "Strategic Thinking",
      difficulty: "Hard",
    },
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: chatMessages.length + 1,
      type: "user",
      content: message,
      timestamp: "Just now",
    }

    setChatMessages([...chatMessages, newMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        content:
          "I understand you want to improve your gameplay. Based on your recent matches, I recommend focusing on crosshair placement and pre-aiming common angles. Would you like me to create a specific training routine for you?",
        timestamp: "Just now",
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <TrendingUp className="w-5 h-5 text-[#39FF14]" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "positive":
        return <CheckCircle className="w-5 h-5 text-[#39FF14]" />
      default:
        return <Lightbulb className="w-5 h-5 text-[#9B30FF]" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Bot className="w-8 h-8 text-[#9B30FF]" />
            AI Coach
          </h1>
          <p className="text-[#AAAAAA] mt-1">Get personalized insights and improvement suggestions</p>
        </div>
        <Badge className="bg-gradient-to-r from-[#9B30FF] to-[#39FF14] text-white">
          <Zap className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1A1A1A] border-[#333333] h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#9B30FF]" />
                Chat with AI Coach
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">
                Ask questions about your gameplay and get personalized advice
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start space-x-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8">
                          {msg.type === "ai" ? (
                            <AvatarFallback className="bg-gradient-to-r from-[#9B30FF] to-[#39FF14] text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          ) : (
                            <AvatarImage src={user.profile_avatar || "/placeholder.svg"} />
                          )}
                        </Avatar>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.type === "user" ? "bg-[#39FF14] text-[#0D0D0D]" : "bg-[#0D0D0D] text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.type === "user" ? "text-[#0D0D0D]/70" : "text-[#AAAAAA]"}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex space-x-2 mt-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask your AI coach anything..."
                  className="bg-[#0D0D0D] border-[#333333] text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} className="bg-[#9B30FF] hover:bg-[#8A2BE2] text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Panel */}
        <div className="space-y-6">
          {/* Performance Insights */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#39FF14]" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-3 bg-[#0D0D0D] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(insight.priority)}`} />
                    </div>
                    <p className="text-[#AAAAAA] text-xs mb-2">{insight.description}</p>
                    <Badge variant="outline" className="text-xs border-[#333333] text-[#AAAAAA]">
                      {insight.game}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Suggestions */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#9B30FF]" />
                Training Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 bg-[#0D0D0D] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          suggestion.difficulty === "Easy"
                            ? "border-[#39FF14] text-[#39FF14]"
                            : suggestion.difficulty === "Medium"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-red-500 text-red-500"
                        }`}
                      >
                        {suggestion.difficulty}
                      </Badge>
                    </div>
                    <p className="text-[#AAAAAA] text-xs mb-2">{suggestion.description}</p>
                    <Badge variant="outline" className="text-xs border-[#333333] text-[#AAAAAA]">
                      {suggestion.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[#9B30FF]/10 to-[#39FF14]/10 border-[#9B30FF]/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Analysis</h3>
              <p className="text-[#AAAAAA]">Get instant feedback on your recent performance</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-[#9B30FF] text-[#9B30FF] hover:bg-[#9B30FF] hover:text-white bg-transparent"
              >
                Analyze Last 5 Games
              </Button>
              <Button className="bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D]">Generate Training Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
