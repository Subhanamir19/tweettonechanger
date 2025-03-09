"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const testOpenAI = async () => {
    setApiStatus('loading')
    try {
      const response = await fetch('/api/test-openai')
      const data = await response.json()
      console.log('Test API response:', data)
      
      setApiResponse(data)
      setApiStatus(data.status === 'success' ? 'success' : 'error')
    } catch (error) {
      console.error('Test API error:', error)
      setApiStatus('error')
      setApiResponse({ error: 'Failed to fetch' })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">OpenAI API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button 
              onClick={testOpenAI}
              disabled={apiStatus === 'loading'}
            >
              {apiStatus === 'loading' ? 'Testing...' : 'Test OpenAI API'}
            </Button>
          </div>

          {apiStatus && (
            <div className="rounded-xl border-2 bg-card p-6 text-card-foreground shadow-md">
              <div className="text-lg font-medium mb-2">
                Status: {' '}
                <span className={apiStatus === 'success' ? 'text-green-500' : apiStatus === 'error' ? 'text-red-500' : 'text-blue-500'}>
                  {apiStatus.toUpperCase()}
                </span>
              </div>
              
              <div className="text-sm whitespace-pre-wrap font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded">
                {JSON.stringify(apiResponse, null, 2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 