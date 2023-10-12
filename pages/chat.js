import Head from "next/head";
import styles from "../styles/chat.module.css";
import { useRef, useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://hdqndctixcgyvlmhohhy.supabase.co", process.env.SUPABASE_KEY);


const Chat = ({ chatlogs }) => {
  const form = useRef();
  const chat = useRef();
  const textbox = useRef();
  const handleSubmit = (value) => {
    console.log(value);
    textbox.current.value = "";
  }

  const chatlogschat = chatlogs.forEach(element => {
    return (
      <>
        <p>{element.text}</p>
        <br />
      </>
    )
  })

  console.log(chatlogschat);

  return (
    <>
      <Head>
        <title>chatty</title>
      </Head>
      <div className={styles.sidebar}>

      </div>
      <div className={styles.mainChatAreaThingyThing}>
        <div className={styles.chat} ref={chat}>
          {chatlogschat}
        </div>
        <div className={styles.textbox}>
          <input
            type="text"
            ref={textbox}
            placeholder="Type something here..."
          />
          <button onClick={(e) => {
            if (textbox.current.value != "") {
              handleSubmit(textbox.current.value)
            }
          }} type="submit" className={styles.sendButton}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Chat;

export async function getStaticProps() {
  const { data: chatlogs } = await supabase.from('chatlogs').select('*')
  return {
    props: {
      chatlogs
    }
  }
}