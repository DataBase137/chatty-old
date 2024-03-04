"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import sendMessage from "../../utils/sendmessage";
import Sidebar from "./sidebar";
import { FaArrowUp } from "react-icons/fa";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const Page = () => {
    const supabase = createClientComponentClient();
    const textbox = useRef();
    const scroll = useRef();
    const [messages, setMessages] = useState(null);
    const [user, setUser] = useState(false);
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (textbox.current.value) {
            sendMessage(textbox.current.value);
            textbox.current.value = "";
        }
    }

    const channel = supabase.channel('message-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            (payload) => {
                if (payload.eventType === "INSERT") {
                    setMessages((current) => [...current, payload.new]);
                }
            }
        )
        .subscribe()

    const fetchChat = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*, profile: profiles(username)');
        setMessages(data);
    }

    useEffect(() => {
        if (scroll.current) {
            scroll.current.scrollIntoView(true);
        }
    }, [messages]);

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();

        if (data.success) return data.data; else router.push("/login");
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
            <Sidebar />
            <div className={styles.container}>
                <div className={styles.chat}>
                    {messages ? messages.map((message) => {
                        const date = new Date(message.created_at);
                        return (
                            <div className={styles.message} key={message.id}>
                                <div className={styles.messageLeft}>
                                    {/* <p className={styles.messageUser}>{message.profile.username}</p> */}
                                    <p className={styles.messageText}>{message.text}</p>
                                </div>
                                <p className={styles.messageTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                            </div>
                        )
                    }) : ""}
                    <div className={styles.scroll} ref={scroll}></div>
                </div>
                <div className={styles.typeArea}>
                    <form onSubmit={(event) => handleSubmit(event)} autoComplete="off">
                        <input type="text" placeholder="Type a message" ref={textbox} name="textbox" className={styles.input} />
                        <button type="submit" className={styles.sendBtn}><FaArrowUp /></button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Page;