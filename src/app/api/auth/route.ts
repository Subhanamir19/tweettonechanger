import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/auth request received')
    
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
    
    if (!data.session?.user) {
      console.log('No authenticated user found')
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    console.log('Authenticated user found:', data.session.user.id)
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: data.session.user.id,
        email: data.session.user.email
      }
    })
  } catch (error) {
    console.error('Error checking authentication:', error)
    return NextResponse.json({ 
      error: 'Failed to check authentication',
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
} 