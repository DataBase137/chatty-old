"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css"
import { FaArrowUp } from "react-icons/fa"
import supabase from "../utils/supabase";

const Page = () => {
  const textbox = useRef();
  const scroll = useRef();
  const [chatLogs, setChatLogs] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (textbox.current.value) {
      sendChatLog(textbox.current.value);
      textbox.current.value = "";
    }
  }

  const getChatLogs = async () => {
    let { data, error } = await supabase
      .from('chat')
      .select('*')
    return data;
  }

  const sendChatLog = async (log) => {
    const { data, error } = await supabase
      .from('chat')
      .insert([
        { text: log },
      ])
      .select()
  }


  const channel = supabase.channel('chat-log-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chat' },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setChatLogs((current) => [...current, payload.new]);
        } else if (payload.eventType === "DELETE") {
          setChatLogs((current) => [current.find((element) => element.id !== payload.old.id)]);
        }
      }
    )
    .subscribe()

  const fetchChat = async () => {
    const chat = await getChatLogs();
    setChatLogs(chat);
  }

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    scroll.current.scrollIntoView(true);
  }, [chatLogs]);

  return (
    <>
      <div className={styles.chatLogContainer}>
        {chatLogs ? chatLogs.map((log) => {
          const date = new Date(log.created_at);
          return (
            <div className={styles.chatLog} key={log.id}>
              <p className={styles.chatLogText}>{log.text}</p>
              <p className={styles.chatLogTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
            </div>
          )
        }) : ""}
        <div ref={scroll}></div>
      </div>
      <div className={styles.typeArea}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <input type="text" placeholder="Type a message" ref={textbox} name="textbox" className={styles.input} />
          <button type="submit" className={styles.sendBtn}><FaArrowUp /></button>
        </form>
      </div>
    </>
  )
}

export default Page;