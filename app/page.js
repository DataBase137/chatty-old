"use client";

import { useEffect, useRef, useState } from "react";
import supabase from "../utils/supabase";
import styles from "./page.module.css"
import { FaArrowUp } from "react-icons/fa"

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

  useEffect(() => {
    scroll.current.scrollIntoView(true);
  }, [chatLogs]);

  return (
    <>
      <div className={styles.chatLogContainer}>
        {chatLogs ? chatLogs.map((log) => {
          const date = new Date(log.created_at);
          return (
            <div className={styles.chatLog}>
              <p className={styles.chatLogText} key={log.id}>{log.text}</p>
              <p className={styles.chatLogTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
            </div>
          )
        }) : ""}
        <div ref={scroll} className={styles.scroll}></div>
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