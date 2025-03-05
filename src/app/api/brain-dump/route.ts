import OpenAI from 'openai'
import { NextResponse } from 'next/server'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text parameter' },
        { status: 400 }
      )
    }

    const prompt = `Convert these unstructured thoughts into an engaging, well-structured tweet that would get high engagement on X (Twitter). 
    Make it concise (max 280 characters), add relevant hashtags, and ensure it's attention-grabbing:
    
    Unstructured thoughts: "${text}"
    
    The response should only contain the converted tweet, nothing else.`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      temperature: 0.7,
    })

    const convertedTweet = completion.choices[0].message.content?.trim()

    if (!convertedTweet) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ convertedTweet })
  } catch (error) {
    console.error('Brain dump conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert brain dump to tweet' },
      { status: 500 }
    )
  }
} 