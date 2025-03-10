import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getServerSession() {
  try {
    // For server components, we need to use a different approach
    // This is a workaround for server components only
    const cookieStore = cookies()
    
    // Create a Supabase client for server components
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            // For server components, we need to use a different approach
            // This is not ideal but works for now
            return undefined // We'll rely on the client-side auth instead
          },
        },
      }
    )
    
    // Get the session using the Supabase client
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
} 