"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export function BrainDumpFeature() {
  const [brainDumpInput, setBrainDumpInput] = useState<string>("")
  const [convertedBrainDump, setConvertedBrainDump] = useState<string>("")
  const [isBrainDumpLoading, setIsBrainDumpLoading] = useState(false)
  const [brainDumpError, setBrainDumpError] = useState("")

  const convertBrainDump = async () => {
    if (!brainDumpInput.trim()) {
      setBrainDumpError("Please enter your thoughts first")
      return
    }

    setIsBrainDumpLoading(true)
    setBrainDumpError("")

    try {
      const response = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: brainDumpInput,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Conversion failed')
      
      setConvertedBrainDump(data.convertedTweet)
    } catch (err: any) {
      setBrainDumpError(err.message || 'Failed to convert brain dump')
    } finally {
      setIsBrainDumpLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Brain Dump</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <label htmlFor="brain-dump-input" className="block text-sm font-medium text-muted-foreground mb-2">
            Dump your thoughts here
          </label>
          <Textarea
            id="brain-dump-input"
            placeholder="Write whatever is on your mind, no matter how unstructured..."
            className="min-h-[100px] resize-none"
            value={brainDumpInput}
            onChange={(e) => setBrainDumpInput(e.target.value)}
          />
        </div>
        
        <div>
          <Button 
            onClick={convertBrainDump} 
            disabled={isBrainDumpLoading || !brainDumpInput.trim()}
            className="w-full flex items-center justify-center gap-2"
          >
            <Twitter className="w-4 h-4" />
            <span>Create Tweet</span>
          </Button>
          {brainDumpError && <div className="text-sm text-red-500 mt-2">{brainDumpError}</div>}
        </div>
        
        <div className="rounded-xl border-2 bg-card p-6 text-card-foreground shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-sm font-medium text-muted-foreground">Structured Tweet</div>
          </div>
          <div className="text-lg font-medium leading-relaxed">
            {isBrainDumpLoading ? (
              <div className="text-muted-foreground">Converting your thoughts...</div>
            ) : convertedBrainDump ? (
              convertedBrainDump
            ) : brainDumpInput ? (
              <div className="text-muted-foreground italic">
                Click the Create Tweet button to transform your thoughts
              </div>
            ) : (
              <div className="text-muted-foreground italic">
                Enter your unstructured thoughts, then click Create Tweet
              </div>
            )}
          </div>
        </div>
        
        {convertedBrainDump && (
          <div className="mt-4 flex gap-2">
            <Button 
              className="w-full"
              onClick={() => navigator.clipboard.writeText(convertedBrainDump)}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 