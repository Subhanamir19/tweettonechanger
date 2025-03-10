import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create a response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // This is used for setting cookies in the response
          response.cookies.set({
            name,
            value,
            ...options,
          })
          return response
        },
        remove(name, options) {
          // This is used for removing cookies in the response
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
          return response
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getSession()

  return response
}

// Only run middleware on API routes and auth-related routes
export const config = {
  matcher: ['/api/:path*', '/login', '/register'],
} 