"use client"

import { useEffect, useState, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Chats from "./chats"
import Messages from "./messages"

const Page = ({ params }) => {
  // Initialize Supabase client
  // ! *DO NOT DELETE THIS PROVIDES A CLIENT FOR ALL NESTED COMPONENTS*
  const supabase = createClientComponentClient()

  // State variables for user data
  const [username, setUsername] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [user, setUser] = useState(null)

  // Variables for chat
  const [chatId, setChatId] = useState(null)
  // ! Public chat ids are created randomly with no check for uniqueness and will throw an error if the same as an existing one
  const publicChatId = parseInt(params.chat)

  // Function to fetch user profile
  const getProfile = useCallback(async () => {
    try {
      // Fetch user information
      const {
        data: { user },
      } = await supabase.auth.getUser()
      // ! If not surrounded by {} (as shown above), 'user' is an object with a property named 'user'
      setUser(user)

      // Fetch user profile data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .single()

      if (error) throw error

      // Update state with profile data
      setUsername(profile?.username)
      setAvatarUrl(profile?.avatar_url)
    } catch (error) {
      console.error("Error fetching profile:", error.message)
    }
  }, [supabase])

  // Fetch user profile on page load
  useEffect(() => {
    getProfile()
  }, [getProfile])

  return (
    <>
      {/* Render Chats component */}
      <Chats
        chatId={chatId}
        setChatId={setChatId}
        publicChatId={publicChatId}
        supabase={supabase}
        username={username}
      />

      {/* Render Messages component */}
      <Messages
        chatId={chatId}
        publicChatId={publicChatId}
        supabase={supabase}
        user={user}
      />
    </>
  )
}

export default Page
