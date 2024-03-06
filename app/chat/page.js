"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./page.module.css"
import Sidebar from "./sidebar";
import { FaArrowUp } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Page = () => {
    const supabase = createClientComponentClient();
    const textbox = useRef();
    const scroll = useRef();
    const [messages, setMessages] = useState(null);
    const [username, setUsername] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [user, setUser] = useState(null);

    // const getProfile = useCallback(async () => {
    const getProfile = async () => {
        "use server";

        const { data: user } = await supabase.auth.getUser();

        setUser(user);

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();

        setUsername(profile.username);
        setAvatarUrl(profile.avatar_url);
        // }, [supabase]);
    };

    const sendMessage = (message) => {
        console.log(message);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (textbox.current.value) {
            sendMessage(textbox.current.value);
            textbox.current.value = "";
        }
    }

    const fetchChat = useCallback(async () => {
        try {
            const { data, error, status } = await supabase
                .from('messages')
                .select('*, profile: profiles(username)');

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setMessages(data);
            }
        } catch (error) {
            console.log("Error loading messages");
        }
    }, [supabase])

    useEffect(() => {
        getProfile();
        fetchChat();
    }, [])

    useEffect(() => {
        const channel = supabase.channel('message-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages'
            }, (payload) => {
                if (payload.eventType === "INSERT") {
                    setMessages((current) => [...current, payload.new]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase]);

    useEffect(() => {
        if (scroll.current) {
            scroll.current.scrollIntoView(true);
        }
    }, [messages]);

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