"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export function VoiceChangerFeature() {
  const [voiceInput, setVoiceInput] = useState<string>("")
  const [personVoice, setPersonVoice] = useState<string>("")
  const [convertedVoice, setConvertedVoice] = useState<string>("")
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)
  const [voiceError, setVoiceError] = useState("")

  const convertVoice = async () => {
    if (!voiceInput.trim() || !personVoice.trim()) {
      setVoiceError("Please enter both text and a person's name")
      return
    }

    setIsVoiceLoading(true)
    setVoiceError("")

    try {
      const response = await fetch('/api/convert-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: voiceInput,
          person: personVoice,
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
            <Button 
              onClick={convertVoice} 
              disabled={isVoiceLoading || !voiceInput.trim() || !personVoice.trim()}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Convert</span>
            </Button>
          </div>
          {voiceError && <div className="text-sm text-red-500 mt-2">{voiceError}</div>}
        </div>
        
        <div className="rounded-xl border-2 bg-card p-6 text-card-foreground shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-sm font-medium text-muted-foreground">Preview Voice</div>
            {personVoice && (
              <>
                <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                <div className="text-sm font-medium text-primary">{personVoice}'s Voice</div>
              </>
            )}
          </div>
          <div className="text-lg font-medium leading-relaxed">
            {isVoiceLoading ? (
              <div className="text-muted-foreground">Converting your text...</div>
            ) : convertedVoice ? (
              convertedVoice
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
        </div>
        
        {convertedVoice && (
          <div className="mt-4 flex gap-2">
            <Button 
              className="w-full"
              onClick={() => navigator.clipboard.writeText(convertedVoice)}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 