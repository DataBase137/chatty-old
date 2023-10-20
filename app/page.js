"use client";

import { useEffect, useRef, useState } from "react";
import supabase from "../utils/supabase";
import styles from "../styles/chat.module.css"

const Page = () => {
  const textbox = useRef();
  const [chatLogs, setChatLogs] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendChatLog(textbox.current.value);
    textbox.current.value = "";
  }

  const getChatLogs = async () => {
    let { data, error } = await supabase
      .from('chatlogs')
      .select()
    return data;
  }

  const sendChatLog = async (log) => {
    const { data, error } = await supabase
      .from('chatlogs')
      .insert([
        { text: log },
      ])
      .select()
  }

  const channel = supabase
    .channel('chat log changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chatlogs',
      },
      ((payload) => {
        if (payload.eventType === "INSERT") {
          setChatLogs((current) => [...current, payload.new]);
        } else if (payload.eventType === "DELETE") {
          setChatLogs((current) => [current.find((element) => element.id !== payload.old.id)]);
        }
      }))
    .subscribe()

  const fetchChat = async () => {
    const chatlog = await getChatLogs();
    setChatLogs(chatlog);
  }

  useEffect(() => {
    fetchChat();
  }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatLog}>
        {chatLogs ? chatLogs.map((log) => {
          if (log) return <p key={log.id}>{log.text}</p>
        }) : ""}
      </div>
      <div className={styles.typeArea}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <input type="text" placeholder="Type something here..." ref={textbox} name="textbox" className={styles.chatbox} />
          <button type="submit" className={styles.sendBtn}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Page;