"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import styles from "./page.module.css"
import { FaArrowUp } from "react-icons/fa"
import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";

const Page = () => {
    const textbox = useRef();
    const scroll = useRef();
    const [chatLogs, setChatLogs] = useState(null);
    const [user, setUser] = useState();
    const router = useRouter();

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
                }
            }
        )
        .subscribe()

    const fetchChat = async () => {
        const chat = await getChatLogs();
        setChatLogs(chat);
    }

    const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            router.push("/login");
        } else {
            setUser(data);
            fetchChat();
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (scroll.current) {
            scroll.current.scrollIntoView(true);
        }
    }, [chatLogs]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' });

        if (error) console.error(error); else router.push("/login");
    }

    return (
        <div className={styles.container}>
            <Suspense>
                <div className={styles.user}>
                    {user ? user.email : ""}
                </div>
                <div className={styles.chat}>
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
                <button onClick={() => signOut()}>Sign Out</button>
            </Suspense>
        </div>
    )
}

export default Page;