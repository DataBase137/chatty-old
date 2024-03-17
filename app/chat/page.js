"use client"

import { useEffect, useState, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Chats from "./chats"
import Messages from "./messages"
import { usePathname } from "next/navigation"

const Page = () => {
  // Initialize Supabase client
  // ! *DO NOT DELETE THIS PROVIDES A CLIENT FOR ALL NESTED COMPONENTS*
  const supabase = createClientComponentClient()

  // State variables
  const [username, setUsername] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [user, setUser] = useState(null)

  // Get chat ID from pathname
  const chatId = usePathname().slice(6)

  // Function to fetch user profile
  const getProfile = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      // ! User is defined as an object with a property of user if not surrounded with {} as shown above
      setUser(user)

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .single()

      if (error) {
        throw error
      }

      setUsername(profile?.username)
      setAvatarUrl(profile?.avatar_url)
    } catch (error) {
      console.error("Error fetching profile:", error.message)
    }
  }, [supabase])

  // Fetch user profile on page load
  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      {/* Render Chats component */}
      <Chats chatId={chatId} supabase={supabase} username={username} />

      {/* Render Messages component */}
      <Messages chatId={chatId} supabase={supabase} user={user} />
    </>
  )
}

export default Page
