"use client"

import { FaPlus, FaUser } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./chats.module.css"

// * Component to display the time since the last update
const TimeSinceUpdate = ({ date }) => {
  // Function to calculate time difference
  const formatChatTime = (timestamp) => {
    const chatDate = new Date(timestamp)
    const currentDate = new Date()

    const diffMilliseconds = currentDate - chatDate
    const diffSeconds = Math.floor(diffMilliseconds / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffYears = Math.floor(diffDays / 365)

    if (diffYears > 0) {
      return `${diffYears}y`
    } else if (diffWeeks > 0) {
      return `${diffWeeks}w`
    } else if (diffDays > 0) {
      return `${diffDays}d`
    } else if (diffHours > 0) {
      return `${diffHours}h`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`
    } else {
      return `Now`
    }
  }

  // Setting to the formatted time
  const [formattedTime, setFormattedTime] = useState(formatChatTime(date))

  // UseEffect to refresh the formatted time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTime(formatChatTime(date))
    }, 60000)

    return () => clearInterval(interval)
  }, [date])

  // UseEffect to set formatted time on direct update
  useEffect(() => {
    setFormattedTime(formatChatTime(date))
  }, [date])

  // Returns the formatted time
  return <p className={styles.chatTime}>{formattedTime}</p>
}

// * Individual chat component
const Chat = ({ chat, chatId, supabase }) => {
  const [latestMessage, setLatestMessage] = useState("")
  const router = useRouter()
  const date = new Date(chat.last_update)

  // UseEffect to get the latest message sent in current chat
  useEffect(() => {
    const getLatestMessage = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, profile: profiles(*)")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: false })
        .limit(1)

      setLatestMessage(data[0])
    }

    getLatestMessage()
  }, [chat, supabase])

  // Check if the current chat is selected
  const isSelected = chatId === chat.id

  return (
    <div
      className={`${styles.chat} ${isSelected && styles.chatSelected}`}
      onClick={() => {
        if (!isSelected) router.push(`/chat/${chat.id}`)
      }}
    >
      {/* Left side of chat component */}
      <div className={styles.chatLeft}>
        <p className={styles.chatName}>{chat.name}</p>
        <p className={styles.chatLatestMessage}>
          {/* Displaying latest chat message */}
          {latestMessage.profile &&
            `${latestMessage.profile.username}: ${latestMessage.text}`}
        </p>
      </div>
      {/* Formatted time */}
      <TimeSinceUpdate date={date} />
    </div>
  )
}

// * Component to display list of chats
const Chats = ({ chatId, supabase, username }) => {
  const [chats, setChats] = useState([])

  // UseEffect to listen to updates on the chats table
  useEffect(() => {
    const channel = supabase
      .channel("chat-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
        },
        (payload) => {
          // First setting the current chats
          const updatedChats = [...chats]

          // Finding which index is the updated chat
          const index = updatedChats.findIndex(
            (chat) => chat.id === payload.new.id
          )

          // Making sure that the chat exists
          if (index !== -1) {
            // Setting the old chat to the new chat
            updatedChats[index] = payload.new

            // Sorting the chats by latest update
            updatedChats.sort(
              (a, b) => new Date(b.last_update) - new Date(a.last_update)
            )

            // Finally setting the chats
            setChats(updatedChats)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, chats, setChats])

  // Function for creating new chats
  const createChat = async (name) => {
    await supabase.from("chats").insert([
      {
        name,
      },
    ])
  }

  // Function to get list of chats
  const getChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .order("last_update", { ascending: false })

    setChats(data)
  }

  // Getting chats on initial page load
  useEffect(() => {
    getChats()
  }, [])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.header}>
            <h1>Messages</h1>
            <button onClick={createChat}>
              <FaPlus className={styles.icon} />
            </button>
          </div>
          <div className={styles.chats}>
            {chats
              ? chats.map((chat) => {
                  return (
                    <Chat
                      chat={chat}
                      chatId={chatId}
                      supabase={supabase}
                      key={chat.id}
                    />
                  )
                })
              : ""}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomInfo}>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                formAction="/api/auth/signout"
                className={styles.signOut}
              >
                <FaUser className={styles.icon} />
              </button>
            </form>
            <h2 className={styles.username}>{username}</h2>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chats
