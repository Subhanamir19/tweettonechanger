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
    const { idea, format } = await req.json()

    if (!idea || !format) {
      return NextResponse.json(
        { error: 'Missing idea or format parameter' },
        { status: 400 }
      )
    }

    let prompt = ""
    
    if (format === "short") {
      prompt = `Convert this simple tweet idea into a fully furnished, engaging tweet. Keep it concise and Twitter-appropriate (max 280 characters):
      
      Idea: "${idea}"
      
      The response should only contain the composed tweet, nothing else.`
    } else {
      prompt = `Convert this simple tweet idea into a fully furnished, engaging long-form tweet thread. Create a compelling narrative that expands on the idea with relevant details, examples, or insights:
      
      Idea: "${idea}"
      
      Format the response as a thread with 3-5 tweets, each separated by a line break. Each tweet should be under 280 characters.
      The response should only contain the composed tweet thread, nothing else.`
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: format === "short" ? 100 : 500,
      temperature: 0.7,
    })

    const result = completion.choices[0].message.content?.trim()

    if (!result) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Idea composition error:', error)
    return NextResponse.json(
      { error: 'Failed to compose idea' },
      { status: 500 }
    )
  }
} 