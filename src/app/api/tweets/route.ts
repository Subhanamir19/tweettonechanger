import { NextRequest, NextResponse } from 'next/server'
import { getTweetsByFolder, updateTweetFolder, deleteTweet } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/tweets request received')
    
    // Create a Supabase client using the request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )
    
    // Get the session
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    
    if (!user?.id) {
      console.log('Unauthorized: No user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')
    console.log('Fetching tweets for user:', user.id, 'folderId:', folderId)
    
    const tweets = await getTweetsByFolder(user.id, folderId)
    console.log('Tweets fetched:', tweets.length)
    return NextResponse.json(tweets)
  } catch (error) {
    console.error('Error fetching tweets:', error)
    return NextResponse.json({ error: 'Failed to fetch tweets', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Create a Supabase client using the request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )
    
    // Get the session
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tweetId, folderId } = await request.json()
    
    if (!tweetId) {
      return NextResponse.json({ error: 'Tweet ID is required' }, { status: 400 })
    }

    await updateTweetFolder(tweetId, folderId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating tweet folder:', error)
    return NextResponse.json({ error: 'Failed to update tweet folder', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Create a Supabase client using the request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )
    
    // Get the session
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tweetId = searchParams.get('id')
    
    if (!tweetId) {
      return NextResponse.json({ error: 'Tweet ID is required' }, { status: 400 })
    }

    await deleteTweet(tweetId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tweet:', error)
    return NextResponse.json({ error: 'Failed to delete tweet', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
} 