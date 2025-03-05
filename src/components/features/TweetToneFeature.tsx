"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, Briefcase, Zap } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ToneType = "witty" | "sarcastic" | "professional" | "chaotic"

interface ToneOption {
  id: ToneType
  label: string
  icon: React.ReactNode
  sampleText: string
}

interface TweetToneFeatureProps {
  onSaveDraft: (content: string, tone: string) => void
  folders: { id: string; name: string; count: number }[]
}

export function TweetToneFeature({ onSaveDraft, folders }: TweetToneFeatureProps) {
  const [selectedTone, setSelectedTone] = useState<ToneType>("professional")
  const [tweetInput, setTweetInput] = useState<string>("")
  const [convertedTweet, setConvertedTweet] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

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
      sampleText: "Excited to announce our latest product launch! Looking forward to sharing more details soon. #Innovation",
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

  const convertTweet = async (tone: ToneType) => {
    if (!tweetInput.trim()) {
      setError("Please enter a tweet idea first!")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/convert-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: tweetInput,
          tone: tone,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Conversion failed')
      
      setConvertedTweet(data.result)
    } catch (err: any) {
      setError(err.message || 'Failed to convert tweet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = (folderId: string) => {
    if (folderId && (convertedTweet || tweetInput)) {
      onSaveDraft(convertedTweet || tweetInput, selectedTone)
      setIsSaveDialogOpen(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Choose Your Tweet's Personality</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <label htmlFor="tweet-input" className="block text-sm font-medium text-muted-foreground mb-2">
            What's on your mind?
          </label>
          <Textarea
            id="tweet-input"
            placeholder="Enter your tweet idea here..."
            className="min-h-[100px] resize-none"
            value={tweetInput}
            onChange={(e) => setTweetInput(e.target.value)}
          />
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-3">Select your tone:</div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {toneOptions.map((tone) => (
              <Button
                key={tone.id}
                variant={selectedTone === tone.id ? "default" : "outline"}
                className={`flex items-center gap-2 transition-all h-14 ${
                  selectedTone === tone.id 
                    ? "bg-primary text-primary-foreground scale-105 shadow-lg" 
                    : "hover:bg-muted hover:scale-102"
                }`}
                onClick={() => {
                  setSelectedTone(tone.id)
                  if (tweetInput) convertTweet(tone.id)
                }}
                disabled={isLoading}
              >
                {tone.icon}
                <span className="font-medium">{tone.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border-2 bg-card p-6 text-card-foreground shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-sm font-medium text-muted-foreground">Preview Tweet</div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
            <div className="text-sm font-medium text-primary">{getActiveTone()?.label} Tone</div>
          </div>
          <div className="text-lg font-medium leading-relaxed">
            {isLoading ? (
              <div className="text-muted-foreground">Converting your tweet...</div>
            ) : convertedTweet ? (
              convertedTweet
            ) : tweetInput ? (
              <div className="text-muted-foreground italic">
                Click a tone button to convert your tweet
              </div>
            ) : (
              <div>
                <div className="text-muted-foreground mb-2 text-sm">Example:</div>
                {getActiveTone()?.sampleText}
              </div>
            )}
          </div>
        </div>

        {(convertedTweet || tweetInput) && (
          <div className="mt-4 flex gap-2">
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  Save as Draft
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save to Folder</DialogTitle>
                </DialogHeader>
                <Select onValueChange={handleSaveDraft}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name} ({folder.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 