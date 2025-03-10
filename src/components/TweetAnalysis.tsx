"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, BarChart, LineChart, Line, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

interface TweetAnalysisProps {
  tweetContent: string
}

export function TweetAnalysis({ tweetContent }: TweetAnalysisProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (tweetContent) {
      // Add a slight delay for animation effect
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [tweetContent])

  if (!tweetContent) return null
  
  // Mock data - in a real app, this would come from an API
  const engagementScore = Math.floor(Math.random() * 30) + 70 // 70-100
  const viralProbability = Math.floor(Math.random() * 40) + 50 // 50-90
  const reachEstimate = (Math.floor(Math.random() * 20) + 5) + "." + Math.floor(Math.random() * 10) + "k" // 5.0k-25.9k
  
  // Generate a random time between 8am and 8pm
  const hour = Math.floor(Math.random() * 12) + 8
  const minute = Math.floor(Math.random() * 60)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour > 12 ? hour - 12 : hour
  const formattedMinute = minute < 10 ? `0${minute}` : minute
  const optimalTime = `${formattedHour}:${formattedMinute} ${ampm}`
  
  // Generate random trends
  const engagementTrend = Math.floor(Math.random() * 20) + 1 // 1-20
  const viralTrend = Math.floor(Math.random() * 10) - 5 // -5 to 5
  const reachTrend = Math.floor(Math.random() * 30) + 10 // 10-40
  
  // Timeline data
  const timelineData = [
    { time: "Now", engagements: 0 },
    { time: "1h", engagements: Math.floor(Math.random() * 10) + 5 },
    { time: "2h", engagements: Math.floor(Math.random() * 20) + 15 },
    { time: "3h", engagements: Math.floor(Math.random() * 30) + 25 },
    { time: "6h", engagements: Math.floor(Math.random() * 40) + 35 },
    { time: "12h", engagements: Math.floor(Math.random() * 50) + 45 },
    { time: "24h", engagements: Math.floor(Math.random() * 60) + 55 },
    { time: "48h", engagements: Math.floor(Math.random() * 70) + 65 },
    { time: "72h", engagements: Math.floor(Math.random() * 80) + 75 },
  ]
  
  // Engagement breakdown
  const likesPercent = Math.floor(Math.random() * 20) + 40 // 40-60
  const retweetsPercent = Math.floor(Math.random() * 20) + 30 // 30-50
  const commentsPercent = Math.floor(Math.random() * 15) + 5 // 5-20
  const bookmarksPercent = Math.floor(Math.random() * 10) + 5 // 5-15
  const sharesPercent = 100 - likesPercent - retweetsPercent - commentsPercent - bookmarksPercent
  
  const engagementData = [
    { name: "Likes", value: likesPercent, color: "#1DA1F2" },
    { name: "Retweets", value: retweetsPercent, color: "#17BF63" },
    { name: "Comments", value: commentsPercent, color: "#794BC4" },
    { name: "Bookmarks", value: bookmarksPercent, color: "#F45D22" },
    { name: "Shares", value: sharesPercent, color: "#E0245E" },
  ]
  
  // Hashtag performance
  const hashtags = [
    { tag: "#marketing", growth: Math.floor(Math.random() * 30) + 10 },
    { tag: "#socialmediatips", growth: Math.floor(Math.random() * 30) + 10 },
    { tag: "#growth", growth: Math.floor(Math.random() * 20) + 5 },
  ]
  
  // Audience analysis
  const audienceData = [
    { name: "Tech", value: 38, color: "#1DA1F2" },
    { name: "Marketing", value: 24, color: "#17BF63" },
    { name: "Finance", value: 16, color: "#794BC4" },
    { name: "Creative", value: 12, color: "#9C27B0" },
    { name: "Other", value: 10, color: "#F45D22" },
  ]

  return (
    <div className={`mt-8 space-y-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Tweet Potential Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Engagement Score */}
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Engagement Score</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">{engagementScore}</div>
                <div className="text-sm text-muted-foreground">/100</div>
                <div className="text-xs text-green-500 ml-auto">+{engagementTrend}%</div>
              </div>
            </div>
            
            {/* Viral Probability */}
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Viral Probability</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">{viralProbability}%</div>
                <div className="text-xs text-muted-foreground ml-auto" style={{ color: viralTrend >= 0 ? '#10B981' : '#EF4444' }}>
                  {viralTrend >= 0 ? '+' : ''}{viralTrend}%
                </div>
              </div>
            </div>
            
            {/* Reach Estimate */}
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Reach Estimate</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">{reachEstimate}</div>
                <div className="text-xs text-green-500 ml-auto">+{reachTrend}%</div>
              </div>
            </div>
            
            {/* Optimal Post Time */}
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Optimal Post Time</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">{optimalTime}</div>
                <div className="text-xs text-muted-foreground ml-auto">Today</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engagement Prediction Timeline */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Engagement Prediction Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagements" 
                    name="Engagements"
                    stroke="#1DA1F2" 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              <span className="font-medium text-accent">{engagementTrend}% Engagements</span> Estimated
            </div>
          </CardContent>
        </Card>
        
        {/* Engagement Breakdown */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Hashtag Performance */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Hashtag Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hashtags.map((hashtag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-accent font-medium">{hashtag.tag}</div>
                  <div className="text-xs text-green-500">+{hashtag.growth}%</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent animate-slide-in" 
                      style={{ 
                        width: `${hashtag.growth * 2}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Audience Analysis */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Audience Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 text-sm bg-background border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors">
          Export data
        </button>
        <button className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90 transition-colors animate-scale-up">
          New Tweet
        </button>
      </div>
    </div>
  )
} 