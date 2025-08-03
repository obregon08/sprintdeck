// Server-side only auth function for use in mutations and queries
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Session } from "@/types"

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const session: Session = {
    user: {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email || "",
    }
  }

  return session
}

// Admin client for user lookup (requires service role key)
export async function createAdminClient() {
  const { createClient } = await import("@supabase/supabase-js")
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function findUserByEmail(email: string): Promise<{ id: string; email: string; name?: string } | null> {
  try {
    const supabase = await createAdminClient()
    
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error("Error fetching users:", error)
      return null
    }
    
    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email || "",
    }
  } catch (error) {
    console.error("Error in findUserByEmail:", error)
    return null
  }
} 