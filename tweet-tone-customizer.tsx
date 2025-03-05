"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Sparkles, Briefcase, Zap, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type ToneType = "witty" | "sarcastic" | "professional" | "chaotic"

interface ToneOption {
  id: ToneType
  label: string
  icon: React.ReactNode
  sampleText: string
}

export default function TweetToneCustomizer() {
  const [selectedTone, setSelectedTone] = useState<ToneType>("professional")
  const router = useRouter()

  const toneOptions: ToneOption[] = [
    {
      id: "witty",
      label: "Witty",
      icon: <Sparkles className="w-4 h-4" />,
      sampleText: "Just discovered that my coffee maker has better communication skills than my ex 😂 #MorningThoughts",
    },
    {
      id: "sarcastic",
      label: "Sarcastic",
      icon: <MessageCircle className="w-4 h-4" />,
      sampleText: "Oh great, another meeting that could've been an email. Living the dream! ✨",
    },
    {
      id: "professional",
      label: "Professional",
      icon: <Briefcase className="w-4 h-4" />,
      sampleText:
        "Excited to announce our latest product launch! Looking forward to sharing more details soon. #Innovation",
    },
    {
      id: "chaotic",
      label: "Chaotic",
      icon: <Zap className="w-4 h-4" />,
      sampleText: "KEYBOARD SMASH TIME!!!1! asdfjkl; 🎉🚀 WHO NEEDS PUNCTUATION ANYWAY?!?! #YOLO",
    },
  ]

  const getActiveTone = () => {
    return toneOptions.find((tone) => tone.id === selectedTone)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Button
        onClick={() => router.push("/")}
        className="absolute -top-14 right-0 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-xl px-4 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Tweet Tone Customizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {toneOptions.map((tone) => (
              <Button
                key={tone.id}
                variant={selectedTone === tone.id ? "default" : "outline"}
                className={`flex items-center gap-2 transition-all ${
                  selectedTone === tone.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => setSelectedTone(tone.id)}
              >
                {tone.icon}
                {tone.label}
              </Button>
            ))}
          </div>

          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="mb-2 text-sm text-muted-foreground">Preview:</div>
            <div className="text-lg">{getActiveTone()?.sampleText}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

