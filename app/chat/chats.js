"use client"

import { FaPlus } from "react-icons/fa"
import styles from "./chats.module.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaUser } from "react-icons/fa"

const TimeSinceUpdate = ({ date }) => {
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

  const [elapsedTime, setElapsedTime] = useState(formatChatTime(date))

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(formatChatTime(date))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [date])

  useEffect(() => {
    setElapsedTime(formatChatTime(date))
  }, [date])

  return <p className={styles.chatTime}>{elapsedTime}</p>
}

const Chat = ({ chat, chatId, supabase }) => {
  const [latestMessage, setLatestMessage] = useState("")
  const router = useRouter()
  const date = new Date(chat.last_update)

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

  const isSelected = chatId === chat.id

  return (
    <div
      className={`${styles.chat} ${isSelected && styles.chatSelected}`}
      onClick={() => {
        if (!isSelected) router.push(`/chat/${chat.id}`)
      }}
    >
      <div className={styles.chatLeft}>
        <p className={styles.chatName}>{chat.name}</p>
        <p className={styles.chatLatestMessage}>
          {latestMessage.profile &&
            `${latestMessage.profile.username}: ${latestMessage.text}`}
        </p>
      </div>
      <TimeSinceUpdate date={date} />
    </div>
  )
}

const Chats = ({ chatId, supabase, username }) => {
  const [chats, setChats] = useState([])

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
          const updatedChats = [...chats]

          const index = updatedChats.findIndex(
            (chat) => chat.id === payload.new.id
          )

          if (index !== -1) {
            updatedChats[index] = payload.new

            updatedChats.sort(
              (a, b) => new Date(b.last_update) - new Date(a.last_update)
            )

            setChats(updatedChats)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, chats, setChats])

  const createChat = async (name) => {
    await supabase.from("chats").insert([
      {
        name,
      },
    ])
  }

  const getChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .order("last_update", { ascending: false })

    setChats(data)
  }

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
