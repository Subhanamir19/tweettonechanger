"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Heart, Repeat, MessageSquare, Users, Save, Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { TweetAnalysis } from "@/components/TweetAnalysis"
import { AudiencePersonaSimulator, PersonaType } from "@/components/AudiencePersonaSimulator"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VoiceChangerFeatureProps {
  onSaveDraft?: (content: string, tone: string, persona?: string | null, inputText?: string) => void
}

export function VoiceChangerFeature({ onSaveDraft }: VoiceChangerFeatureProps) {
  const [voiceInput, setVoiceInput] = useState<string>("")
  const [personVoice, setPersonVoice] = useState<string>("")
  const [convertedVoice, setConvertedVoice] = useState<string>("")
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)
  const [voiceError, setVoiceError] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(null)
  const [showReactions, setShowReactions] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [retweetCount, setRetweetCount] = useState(0)
  const [replyCount, setReplyCount] = useState(0)
  const [personaApplied, setPersonaApplied] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  useEffect(() => {
    // Show analysis when voice is converted
    if (convertedVoice) {
      const timer = setTimeout(() => {
        setShowAnalysis(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowAnalysis(false)
    }
  }, [convertedVoice])
  
  useEffect(() => {
    if (convertedVoice && selectedPersona) {
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
  }, [convertedVoice, selectedPersona])

  const convertVoice = async () => {
    if (!voiceInput.trim() || !personVoice.trim()) {
      setVoiceError("Please enter both text and a person's name")
      return
    }

    setIsVoiceLoading(true)
    setVoiceError("")
    setShowAnalysis(false)
    setShowReactions(false)
    setPersonaApplied(!!selectedPersona)

    try {
      const response = await fetch('/api/convert-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: voiceInput,
          person: personVoice,
          persona: selectedPersona
        }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Conversion failed')
      
      setConvertedVoice(data.result)
    } catch (err: any) {
      setVoiceError(err.message || 'Failed to convert voice')
    } finally {
      setIsVoiceLoading(false)
    }
  }
  
  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona)
    if (voiceInput && personVoice) {
      convertVoice()
    }
  }
  
  const handleSaveDraft = () => {
    if (onSaveDraft && convertedVoice) {
      onSaveDraft(
        convertedVoice,
        personVoice, // Using the person's voice as the "tone"
        selectedPersona || null,
        voiceInput
      )
      setIsSaveDialogOpen(false)
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
          <CardTitle className="text-2xl font-bold text-center">Voice Changer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <label htmlFor="voice-input" className="block text-sm font-medium text-muted-foreground mb-2">
              Enter your text
            </label>
            <Textarea
              id="voice-input"
              placeholder="Enter your text here..."
              className="min-h-[100px] resize-none"
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="person-voice" className="block text-sm font-medium text-muted-foreground mb-2">
              Enter the person's name
            </label>
            <div className="flex gap-2">
              <Input
                id="person-voice"
                placeholder="e.g., Elon Musk, Barack Obama, Taylor Swift..."
                value={personVoice}
                onChange={(e) => setPersonVoice(e.target.value)}
                className="flex-1"
              />
              <motion.button 
                onClick={convertVoice} 
                disabled={isVoiceLoading || !voiceInput.trim() || !personVoice.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-accent to-accent/80 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-4 h-4" />
                <span>Convert</span>
              </motion.button>
            </div>
            {voiceError && <div className="text-sm text-destructive mt-2">{voiceError}</div>}
          </div>
          
          {/* Audience Persona Simulator */}
          <div className="pt-2">
            <AudiencePersonaSimulator 
              selectedPersona={selectedPersona}
              onPersonaSelect={handlePersonaSelect}
            />
          </div>
          
          <motion.div 
            className={`rounded-xl border-2 p-6 text-card-foreground shadow-md relative ${
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
              <div className="text-sm font-medium text-muted-foreground">Preview Voice</div>
              {personVoice && (
                <>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                  <div className="text-sm font-medium text-accent">{personVoice}'s Voice</div>
                </>
              )}
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
              {isVoiceLoading ? (
                <div className="text-muted-foreground animate-pulse">Converting your text...</div>
              ) : convertedVoice ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={selectedPersona && personaApplied ? "animate-shimmer" : ""}
                >
                  {convertedVoice}
                  
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
              ) : voiceInput ? (
                <div className="text-muted-foreground italic">
                  Click the Convert button to transform your text
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  Enter your text and a person's name, then click Convert
                </div>
              )}
            </div>
          </motion.div>
          
          {convertedVoice && (
            <div className="mt-4 flex gap-2">
              <motion.button 
                className="flex-1 py-2 rounded-md bg-gradient-to-r from-accent to-accent/80 text-white flex items-center justify-center gap-2"
                onClick={() => navigator.clipboard.writeText(convertedVoice)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy className="h-4 w-4" />
                <span>Copy to Clipboard</span>
              </motion.button>
              
              {onSaveDraft && (
                <motion.button 
                  className="flex-1 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center gap-2"
                  onClick={handleSaveDraft}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="h-4 w-4" />
                  <span>Save as Draft</span>
                </motion.button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tweet Analysis Section */}
      {showAnalysis && <TweetAnalysis tweetContent={convertedVoice} />}
    </div>
  )
} 