"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { GamepadIcon, Trophy, Zap } from "lucide-react"

interface AuthFormProps {
  onLogin: (user: any) => void
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: "player",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: "1",
        username: loginData.email.split("@")[0],
        email: loginData.email,
        role: "player",
        profile_avatar: "/placeholder.svg?height=40&width=40",
      }

      localStorage.setItem("coachgg_token", "mock-jwt-token")
      onLogin(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: "1",
        username: registerData.username,
        email: registerData.email,
        role: registerData.role,
        profile_avatar: "/placeholder.svg?height=40&width=40",
      }

      localStorage.setItem("coachgg_token", "mock-jwt-token")
      onLogin(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#39FF14] to-[#9B30FF] rounded-2xl mb-4">
            <GamepadIcon className="w-8 h-8 text-[#0D0D0D]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CoachGG</h1>
          <p className="text-[#AAAAAA]">Level up your esports game</p>
        </div>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-[#AAAAAA] text-center">
              Sign in to track your progress and improve your gameplay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#0D0D0D]">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-[#0D0D0D]"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-[#0D0D0D]"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="gamer@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-[#0D0D0D] border-[#333333] text-white placeholder:text-[#666666]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-[#0D0D0D] border-[#333333] text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#39FF14] hover:bg-[#2ECC11] text-[#0D0D0D] font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="ProGamer123"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      className="bg-[#0D0D0D] border-[#333333] text-white placeholder:text-[#666666]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="gamer@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="bg-[#0D0D0D] border-[#333333] text-white placeholder:text-[#666666]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="bg-[#0D0D0D] border-[#333333] text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#9B30FF] hover:bg-[#8A2BE2] text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-[#39FF14]">
            <Trophy className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs text-[#AAAAAA]">Track Stats</p>
          </div>
          <div className="text-[#9B30FF]">
            <Zap className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs text-[#AAAAAA]">AI Coach</p>
          </div>
          <div className="text-[#39FF14]">
            <GamepadIcon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs text-[#AAAAAA]">Team Play</p>
          </div>
        </div>
      </div>
    </div>
  )
}
