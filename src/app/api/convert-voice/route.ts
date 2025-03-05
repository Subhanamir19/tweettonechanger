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
    const { text, person } = await req.json()

    if (!text || !person) {
      return NextResponse.json(
        { error: 'Missing text or person parameter' },
        { status: 400 }
      )
    }

    const prompt = `Convert this text to sound like it was written by ${person}. Maintain their unique speaking style, vocabulary, and mannerisms:
    Original text: "${text}"
    Make it sound authentically like ${person} would say or write it. The response should only contain the converted text, nothing else.`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 200,
      temperature: 0.7,
    })

    const convertedVoice = completion.choices[0].message.content?.trim()

    if (!convertedVoice) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ result: convertedVoice })
  } catch (error) {
    console.error('Voice conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert voice' },
      { status: 500 }
    )
  }
} 