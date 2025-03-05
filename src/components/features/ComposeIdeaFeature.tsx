"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

export function ComposeIdeaFeature() {
  const [ideaInput, setIdeaInput] = useState<string>("")
  const [format, setFormat] = useState<string>("short")
  const [composedIdea, setComposedIdea] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const composeIdea = async () => {
    if (!ideaInput.trim()) {
      setError("Please enter your idea first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/compose-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: ideaInput,
          format: format,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Composition failed')
      
      setComposedIdea(data.result)
    } catch (err: any) {
      setError(err.message || 'Failed to compose idea')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Compose Idea</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <label htmlFor="idea-input" className="block text-sm font-medium text-muted-foreground mb-2">
            Enter your tweet idea
          </label>
          <Textarea
            id="idea-input"
            placeholder="Write a simple idea for your tweet..."
            className="min-h-[100px] resize-none"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
          />
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Select format
          </div>
          <RadioGroup 
            value={format} 
            onValueChange={setFormat}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="short" />
              <Label htmlFor="short">Short form</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="long" id="long" />
              <Label htmlFor="long">Long form</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Button 
            onClick={composeIdea} 
            disabled={isLoading || !ideaInput.trim()}
            className="w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Compose Tweet</span>
          </Button>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </div>
        
        <div className="rounded-xl border-2 bg-card p-6 text-card-foreground shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-sm font-medium text-muted-foreground">Composed Tweet</div>
          </div>
          <div className="text-lg font-medium leading-relaxed">
            {isLoading ? (
              <div className="text-muted-foreground">Composing your tweet...</div>
            ) : composedIdea ? (
              composedIdea
            ) : ideaInput ? (
              <div className="text-muted-foreground italic">
                Click the Compose Tweet button to transform your idea
              </div>
            ) : (
              <div className="text-muted-foreground italic">
                Enter your idea, select a format, then click Compose Tweet
              </div>
            )}
          </div>
        </div>
        
        {composedIdea && (
          <div className="mt-4 flex gap-2">
            <Button 
              className="w-full"
              onClick={() => navigator.clipboard.writeText(composedIdea)}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 