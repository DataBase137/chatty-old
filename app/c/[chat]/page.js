import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Chats from "./chats"
//// import Messages from "./messages"
import { cookies } from "next/headers"

const Page = async ({ params: { chat } }) => {
  // Initialize Supabase client
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  // ! DO NOT DELETE THIS PROVIDES A CLIENT FOR ALL NESTED COMPONENTS

  // Fetch user information
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // ! If not surrounded by {} (as shown above), 'user' is an object with a property named 'user'

  // Fetch user profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <>
      <Chats chatId={chat} supabase={supabase} user={user} profile={profile} />
      // TODO Redo messages component
      {/* <Messages
        chatId={chat}
        supabase={supabase}
        user={user}
        profile={profile}
      /> */}
    </>
  )
}

export default Page
