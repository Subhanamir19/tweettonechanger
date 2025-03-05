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
    const { text, tone } = await req.json()

    if (!text || !tone) {
      return NextResponse.json(
        { error: 'Missing text or tone parameter' },
        { status: 400 }
      )
    }

    const prompt = `Convert this tweet idea into a ${tone} tone. Keep it concise and twitter-appropriate (max 280 characters):
    Original idea: "${text}"
    Make it ${tone} while maintaining the core message. The response should only contain the converted tweet, nothing else.`

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
    console.error('Tweet conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert tweet' },
      { status: 500 }
    )
  }
} 