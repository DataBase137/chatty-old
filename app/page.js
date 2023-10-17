"use client";

import { useEffect, useRef } from "react";
import sendChatLog from "./api/sendChatLog";
import updateChatLogs from "./api/chatLogs";
import getChatLogs from "./api/getChatLogs";

export default function Page() {
  const textbox = useRef();
  const chat = useRef();
  const handleSubmit = (value) => {
    console.log(value);
    sendChatLog(value);
    textbox.current.value = "";
  }

  useEffect(() => {
    updateChatLogs();
  }, []);

  const chatLogs = getChatLogs();
  console.log(chatLogs);

  return (
    <>
      <div ref={chat}>
        {/* {
          chatLogs?.map((log) => {
            <p key={log.id}>{log.text}</p>
          })
        } */}
      </div>
      <input type="text" placeholder="Type something here..." ref={textbox} name="textbox" />
      <button type="submit" onClick={() => handleSubmit(textbox.current.value)}>Send</button>
    </>
  )
}