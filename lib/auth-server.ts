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