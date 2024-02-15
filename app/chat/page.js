"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css"
import { FaArrowUp } from "react-icons/fa"
import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";
import sendMessage from "../../utils/sendmessage";
import getMessages from "../../utils/getmessages";

const Page = () => {
    const textbox = useRef();
    const scroll = useRef();
    const [chatLogs, setChatLogs] = useState(null);
    const [user, setUser] = useState(false);
    const router = useRouter();


    const handleSubmit = (event) => {
        event.preventDefault();
        if (textbox.current.value) {
            sendMessage(textbox.current.value);
            textbox.current.value = "";
        }
    }

    const channel = supabase.channel('chat-log-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            (payload) => {
                if (payload.eventType === "INSERT") {
                    setChatLogs((current) => [...current, payload.new]);
                }
            }
        )
        .subscribe()

    const fetchChat = async () => {
        const chat = await getMessages();
        setChatLogs(chat);
    }

    useEffect(() => {
        if (scroll.current) {
            scroll.current.scrollIntoView(true);
        }
    }, [chatLogs]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' });

        if (error) console.error(error); else router.push("/login");
    }

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();

        if (error) router.push("/login"); else return data;
    }

    useEffect(() => {
        getUser()
            .then((data) => {
                setUser(data)
                fetchChat()
            });
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.chat}>
                    {chatLogs ? chatLogs.map(async (message) => {
                        const date = new Date(message.created_at);
                        return (
                            <div className={styles.chatLog} key={message.id}>
                                <p>{message.profile.username}</p>
                                <p className={styles.chatLogText}>{message.text}</p>
                                <p className={styles.chatLogTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                            </div>
                        )
                    }) : ""}
                    <div ref={scroll}></div>
                </div>
                <div className={styles.typeArea}>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <input type="text" placeholder="Type a message" ref={textbox} name="textbox" className={styles.input} autoComplete="false" />
                        <button type="submit" className={styles.sendBtn}><FaArrowUp /></button>
                    </form>
                </div>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        </>
    )
}

export default Page;