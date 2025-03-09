import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if API key is defined
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY environment variable' },
        { status: 500 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Make a simple API call to test the key
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Hello, this is a test." }],
        model: "gpt-3.5-turbo",
        max_tokens: 10,
      })

      return NextResponse.json({ 
        status: 'success',
        message: 'OpenAI API key is working',
        response: completion.choices[0].message.content
      })
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError)
      return NextResponse.json({ 
        status: 'error',
        error: 'OpenAI API error',
        message: openaiError.message,
        type: openaiError.type,
        code: openaiError.code
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Test endpoint error:', error)
    return NextResponse.json(
      { error: 'Test failed', message: error.message },
      { status: 500 }
    )
  }
} 