import { useEffect, useRef, useState, useCallback } from "react"
import { FaRegPaperPlane } from "react-icons/fa"
import styles from "./messages.module.css"

// * Component to display individual messages
const Message = ({ message, profile, setProfileCache, user, supabase }) => {
  const date = new Date(message.created_at)

  useEffect(() => {
    // Function to fetch and cache profile data
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .match({ id: message.profile_id })
        .single()

      if (data) {
        setProfileCache((current) => ({
          ...current,
          [data.id]: data,
        }))
      }
    }

    // Fetch profile if it isn't already cached
    if (!profile) {
      fetchProfile()
    }
  }, [profile, message.profile_id, setProfileCache, supabase])

  // Check if message is sent by current user
  const isSentByUser = profile.id === user.id

  return (
    <div
      className={`${styles.message} ${isSentByUser ? styles.messageRight : styles.messageLeft}`}
    >
      <div className={styles.messageContent}>
        {/* Username of the person who sent it */}
        <p className={styles.messageUser}>{profile.username}</p>
        <div>
          {/* If not sent by user put text here */}
          {!isSentByUser && (
            <p className={styles.messageText}>{message.text}</p>
          )}
          {/* Display message timestamp */}
          <p className={styles.messageTime}>
            {date.toLocaleDateString("en-US", {
              month: "short",
              weekday: "short",
              day: "numeric",
            })}{" "}
            {date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          {/* If sent by user put text here */}
          {isSentByUser && <p className={styles.messageText}>{message.text}</p>}
        </div>
      </div>
    </div>
  )
}

// * Component to display messages in a chat
const Messages = ({ chatId, supabase, user }) => {
  const chat = useRef()
  const [messages, setMessages] = useState(null)
  const [profileCache, setProfileCache] = useState({})

  // Function to fetch messages
  const getMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profile: profiles(*)")
      .match({ chat_id: chatId })
      .order("created_at")

    // Formatting the profiles from the messages fetched
    const newProfiles = Object.fromEntries(
      data
        ?.map((message) => message.profile)
        .filter(Boolean)
        .map((profile) => [profile.id, profile])
    )

    // Caching given profiles
    setProfileCache((current) => ({
      ...current,
      ...newProfiles,
    }))

    setMessages(data)
  }, [chatId, supabase])

  useEffect(() => {
    // Fetch messages for given chats
    if (chatId) getMessages()
  }, [getMessages, chatId])

  // UseEffect to listen for inserts on the messages table (for given chat)
  useEffect(() => {
    const channel = supabase
      .channel("message-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          // Update messages when a new message is inserted
          setMessages((current) => [...current, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, chatId])

  // Function to send a messave
  const sendMessage = async (event) => {
    // Prevent default form submission method
    event.preventDefault()
    // Get the message text from input
    const message = event.target.elements.textbox.value.trim()

    if (message) {
      // Once the message is stored, clear the form
      event.target.reset()

      // Send message to the chat
      await supabase.from("messages").insert([
        {
          text: message,
          chat_id: chatId,
        },
      ])
    }
  }

  // Scroll chat window to bottom when new messages are added
  useEffect(() => {
    chat.current.scrollTop = chat.current.scrollHeight
  }, [messages])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.chat} ref={chat}>
          {messages
            ? messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  profile={profileCache[message.profile_id]}
                  setProfileCache={setProfileCache}
                  user={user}
                  supabase={supabase}
                />
              ))
            : ""}
        </div>
        <div className={styles.typeArea}>
          <form onSubmit={sendMessage} autoComplete="off">
            <input
              type="text"
              placeholder="Type a message"
              name="textbox"
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn}>
              <FaRegPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Messages
