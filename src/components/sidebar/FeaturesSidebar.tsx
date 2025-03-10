"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, Briefcase, Zap, Mic, Brain, Twitter } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface FeaturesSidebarProps {
  selectedFeature: string
  onFeatureSelect: (feature: string) => void
}

export function FeaturesSidebar({ 
  selectedFeature, 
  onFeatureSelect 
}: FeaturesSidebarProps) {
  const features = [
    {
      id: "tweet-tone",
      label: "Tweet Tone",
      icon: <Twitter className="h-4 w-4" />,
      description: "Customize your tweet's tone"
    },
    {
      id: "voice-changer",
      label: "Voice Changer",
      icon: <Mic className="h-4 w-4" />,
      description: "Transform text into someone's voice"
    },
    {
      id: "brain-dump",
      label: "Brain Dump",
      icon: <Brain className="h-4 w-4" />,
      description: "Turn your thoughts into tweets"
    },
    {
      id: "compose-idea",
      label: "Compose Idea",
      icon: <Sparkles className="h-4 w-4" />,
      description: "Convert a simple idea into a full tweet"
    }
  ]

  return (
    <div className="w-64 bg-background border-r border-border h-screen sticky top-0 left-0 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Features</h2>
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          {features.map((feature) => (
            <Button
              key={feature.id}
              variant="ghost"
              className={`w-full justify-start transition-all hover:animate-scale-up ${
                selectedFeature === feature.id ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
              }`}
              onClick={() => onFeatureSelect(feature.id)}
            >
              {feature.icon}
              <span className="ml-2 flex-1 text-left">{feature.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 