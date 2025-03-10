"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, Briefcase, Zap, Heart, Repeat, MessageSquare, Users } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TweetAnalysis } from "@/components/TweetAnalysis"
import { AudiencePersonaSimulator, PersonaType } from "@/components/AudiencePersonaSimulator"
import { motion } from "framer-motion"

type ToneType = "witty" | "sarcastic" | "professional" | "chaotic"

interface ToneOption {
  id: ToneType
  label: string
  icon: React.ReactNode
  sampleText: string
}

interface TweetToneFeatureProps {
  onSaveDraft: (content: string, tone: string, persona?: string | null, inputText?: string) => void
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
  const [charCount, setCharCount] = useState(0)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(null)
  const [showReactions, setShowReactions] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [retweetCount, setRetweetCount] = useState(0)
  const [replyCount, setReplyCount] = useState(0)
  const [personaApplied, setPersonaApplied] = useState(false)
  
  const MAX_CHARS = 280

  useEffect(() => {
    setCharCount(tweetInput.length)
  }, [tweetInput])

  useEffect(() => {
    // Show analysis when a tweet is converted
    if (convertedTweet) {
      const timer = setTimeout(() => {
        setShowAnalysis(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowAnalysis(false)
    }
  }, [convertedTweet])
  
  useEffect(() => {
    if (convertedTweet && selectedPersona) {
      setShowReactions(false)
      const timer = setTimeout(() => {
        setShowReactions(true)
        // Generate random engagement numbers based on persona
        // Different personas have different engagement patterns
        const baseCount = Math.floor(Math.random() * 30) + 10
        
        switch(selectedPersona) {
          case "gen-z":
            setLikeCount(baseCount * 2) // Gen Z gives more likes
            setRetweetCount(Math.floor(baseCount * 1.5))
            setReplyCount(baseCount)
            break
          case "corporate":
            setLikeCount(baseCount)
            setRetweetCount(Math.floor(baseCount * 0.5)) // Corporate shares less
            setReplyCount(Math.floor(baseCount * 0.7))
            break
          case "crypto":
            setLikeCount(baseCount)
            setRetweetCount(baseCount * 2) // Crypto bros love to retweet
            setReplyCount(Math.floor(baseCount * 0.8))
            break
          case "gamer":
            setLikeCount(baseCount * 1.5)
            setRetweetCount(baseCount)
            setReplyCount(baseCount * 1.5) // Gamers comment more
            break
          case "artist":
            setLikeCount(baseCount * 1.8) // Artists appreciate with likes
            setRetweetCount(Math.floor(baseCount * 0.7))
            setReplyCount(baseCount)
            break
          case "influencer":
            setLikeCount(baseCount * 3) // Influencers get lots of likes
            setRetweetCount(baseCount * 2)
            setReplyCount(baseCount * 1.2)
            break
          default:
            setLikeCount(baseCount)
            setRetweetCount(Math.floor(baseCount * 0.8))
            setReplyCount(Math.floor(baseCount * 0.6))
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [convertedTweet, selectedPersona])

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
    setShowAnalysis(false)
    setShowReactions(false)
    setPersonaApplied(!!selectedPersona)

    try {
      console.log("Making API request to convert tweet with tone:", tone, "persona:", selectedPersona)
      const response = await fetch('/api/convert-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: tweetInput,
          tone: tone,
          persona: selectedPersona
        }),
      })

      const data = await response.json()
      console.log("API response:", data)
      
      if (!response.ok) throw new Error(data.error || 'Conversion failed')
      
      if (!data.result) {
        throw new Error('API response missing result field')
      }
      
      setConvertedTweet(data.result)
    } catch (err: any) {
      console.error('Tweet conversion error:', err)
      setError(err.message || 'Failed to convert tweet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = (folderId: string) => {
    if (folderId && (convertedTweet || tweetInput)) {
      onSaveDraft(
        convertedTweet || tweetInput, 
        selectedTone, 
        selectedPersona || null,
        tweetInput
      )
      setIsSaveDialogOpen(false)
    }
  }
  
  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona)
    if (tweetInput && selectedTone) {
      convertTweet(selectedTone)
    }
  }
  
  // Get persona-specific styling
  const getPersonaStyle = () => {
    if (!selectedPersona) return {}
    
    const personaStyles = {
      "gen-z": {
        bg: "bg-gradient-to-r from-green-400/5 to-green-500/5",
        border: "border-green-400",
        text: "text-green-500"
      },
      "corporate": {
        bg: "bg-gradient-to-r from-blue-800/5 to-blue-900/5",
        border: "border-blue-800",
        text: "text-blue-800"
      },
      "crypto": {
        bg: "bg-gradient-to-r from-yellow-400/5 to-yellow-600/5",
        border: "border-yellow-500",
        text: "text-yellow-500"
      },
      "gamer": {
        bg: "bg-gradient-to-r from-purple-500/5 to-purple-700/5",
        border: "border-purple-600",
        text: "text-purple-600"
      },
      "artist": {
        bg: "bg-gradient-to-r from-pink-400/5 to-purple-500/5",
        border: "border-pink-500",
        text: "text-pink-500"
      },
      "influencer": {
        bg: "bg-gradient-to-r from-orange-400/5 to-pink-500/5",
        border: "border-orange-500",
        text: "text-orange-500"
      }
    }
    
    return personaStyles[selectedPersona] || {}
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Choose Your Tweet's Personality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <label htmlFor="tweet-input" className="block text-sm font-medium text-muted-foreground mb-2">
              What's on your mind?
            </label>
            <div className="relative">
              <Textarea
                id="tweet-input"
                placeholder="Enter your tweet idea here..."
                className="min-h-[100px] resize-none"
                value={tweetInput}
                onChange={(e) => setTweetInput(e.target.value)}
                maxLength={MAX_CHARS}
              />
              <div className={`text-xs mt-2 text-right ${charCount > MAX_CHARS * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {charCount}/{MAX_CHARS}
              </div>
            </div>
            {error && <div className="text-sm text-destructive mt-2">{error}</div>}
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-3">Select your tone:</div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {toneOptions.map((tone) => (
                <motion.button
                  key={tone.id}
                  className={`flex items-center gap-2 transition-all h-14 rounded-lg border-2 ${
                    selectedTone === tone.id 
                      ? "bg-gradient-to-r from-accent to-accent/80 text-white border-transparent shadow-lg" 
                      : "bg-card text-card-foreground border-border hover:border-accent/50"
                  }`}
                  onClick={() => {
                    setSelectedTone(tone.id)
                    if (tweetInput) convertTweet(tone.id)
                  }}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={selectedTone === tone.id ? { 
                    boxShadow: ["0px 0px 0px rgba(29, 161, 242, 0)", "0px 0px 15px rgba(29, 161, 242, 0.5)", "0px 0px 0px rgba(29, 161, 242, 0)"],
                  } : {}}
                  transition={selectedTone === tone.id ? { 
                    boxShadow: { repeat: Infinity, duration: 2 },
                  } : {}}
                >
                  <div className="flex items-center justify-center w-full">
                    {tone.icon}
                    <span className="font-medium ml-2">{tone.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Audience Persona Simulator */}
          <div className="pt-2">
            <AudiencePersonaSimulator 
              selectedPersona={selectedPersona}
              onPersonaSelect={handlePersonaSelect}
            />
          </div>

          <motion.div 
            className={`rounded-xl border-2 p-6 text-card-foreground shadow-md ${
              selectedPersona && personaApplied 
                ? getPersonaStyle().bg || "bg-gradient-to-r from-blue-50/5 to-white/5" 
                : "bg-gradient-to-r from-blue-50/5 to-white/5"
            } ${
              selectedPersona && personaApplied 
                ? getPersonaStyle().border ? `border-${getPersonaStyle().border}` : "border-border" 
                : "border-border"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedPersona && personaApplied && (
              <motion.div 
                className="absolute -top-3 right-3 bg-background px-2 py-0.5 rounded-full border border-border flex items-center gap-1 text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Users className="h-3 w-3" />
                <span className={getPersonaStyle().text}>Tailored for {selectedPersona}</span>
              </motion.div>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm font-medium text-muted-foreground">Preview Tweet</div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
              <div className="text-sm font-medium text-accent">{getActiveTone()?.label} Tone</div>
              {selectedPersona && personaApplied && (
                <>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                  <div className={`text-sm font-medium ${getPersonaStyle().text || "text-accent"}`}>
                    For {selectedPersona} audience
                  </div>
                </>
              )}
            </div>
            <div className="text-lg font-medium leading-relaxed">
              {isLoading ? (
                <div className="text-muted-foreground animate-pulse">Converting your tweet...</div>
              ) : convertedTweet ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={selectedPersona && personaApplied ? "animate-shimmer" : ""}
                >
                  {convertedTweet}
                  
                  {showReactions && (
                    <motion.div 
                      className="flex items-center gap-6 mt-4 pt-4 border-t border-border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <motion.div 
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                        whileHover={{ scale: 1.1, color: "#F91880" }}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{likeCount}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                        whileHover={{ scale: 1.1, color: "#00BA7C" }}
                      >
                        <Repeat className="h-4 w-4" />
                        <span>{retweetCount}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                        whileHover={{ scale: 1.1, color: "#1DA1F2" }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{replyCount}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
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
          </motion.div>

          {(convertedTweet || tweetInput) && (
            <div className="mt-4 flex gap-2">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 hover:animate-scale-up">
                    Save as Draft
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-fade-in">
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
      
      {/* Tweet Analysis Section */}
      {showAnalysis && <TweetAnalysis tweetContent={convertedTweet} />}
    </div>
  )
} 