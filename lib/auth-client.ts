// Client-side auth function for use in client components
import { createClient } from '@/lib/supabase/client'
import { Session } from "@/types"
import { useState } from "react"
import { useEffect } from "react"

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session as Session)
    }
    getData()
  }, [supabase.auth])

  return {
    user: {
      id: session?.user?.id,
      email: session?.user?.email,
      name: session?.user?.name || session?.user?.email || "",
    }
  } as Session | null
} 