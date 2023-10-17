"use client";

import { useEffect, useRef, useState } from "react";
import supabase from "../utils/supabase";

export default function Page() {
  const textbox = useRef();
  const [chatLogs, setChatLogs] = useState(null);
  const [updated, setUpdated] = useState();

  const handleSubmit = (value) => {
    sendChatLog(value);
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
      (() => {
        setUpdated(true);
      }))
    .subscribe()

    useEffect(() => {
      setUpdated(false);
    }, [updated])

  const fetchChat = async () => {
    const chatlog = await getChatLogs();
    setChatLogs(chatlog);
  }

  useEffect(() => {
    fetchChat()
  }, [updated])


  return (
    <>
      <div>
        {chatLogs ? chatLogs.map((log) => <p key={log.id}>{log.text}</p>) : ""}
      </div>
      <input type="text" placeholder="Type something here..." ref={textbox} name="textbox" />
      <button type="submit" onClick={() => handleSubmit(textbox.current.value)}>Send</button>
    </>
  )
}