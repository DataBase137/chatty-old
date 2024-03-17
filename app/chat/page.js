"use client"

import { useEffect, useState, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Chats from "./chats"
import { usePathname } from "next/navigation"
import Messages from "./messages"

const Page = () => {
  const supabase = createClientComponentClient()
  const [username, setUsername] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [user, setUser] = useState(null)
  const chatId = usePathname().slice(6)

  const getProfile = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser()

    setUser(user)

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user?.user.id)
      .single()

    setUsername(profile.username)
    setAvatarUrl(profile.avatar_url)
  }, [supabase])

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      <Chats chatId={chatId} supabase={supabase} username={username} />
      <Messages chatId={chatId} supabase={supabase} user={user} />
    </>
  )
}

export default Page
