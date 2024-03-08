"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./messages.module.css"
import { FaArrowUp } from "react-icons/fa";

const Messages = ({ chatId, supabase, user }) => {
    const chat = useRef();
    const [messages, setMessages] = useState(null);

    const getMessages = useCallback(async (id) => {
        const { data } = await supabase
            .from('messages')
            .select('*, profile: profiles(*)')
            .order('created_at')
            .eq('chat_id', id);

        setMessages(data);
    }, [supabase]);

    useEffect(() => {
        console.log(chatId);
        getMessages(chatId);
    }, [chatId]);

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
        chat.current.scrollTop = chat.current.scrollHeight;
    }, [messages]);

    const sendMessage = async (event) => {
        event.preventDefault();

        const message = event.target[0].value;
        if (message) {
            event.target.reset();

            await supabase
                .from('messages')
                .insert([
                    {
                        text: message,
                        chat_id: chatId,
                    },
                ]);
        } else {
            alert("no data");
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.chat} ref={chat}>
                    {messages ? messages.map((message) => {
                        const date = new Date(message.created_at);
                        return (
                            <div className={styles.message} key={message.id}>
                                <div className={styles.messageLeft}>
                                    <p className={styles.messageUser}>{message.profile?.username}</p>
                                    <p className={styles.messageText}>{message.text}</p>
                                </div>
                                <p className={styles.messageTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                            </div>
                        );
                    }) : ""}
                </div>
                <div className={styles.typeArea}>
                    <form onSubmit={(event) => sendMessage(event)} autoComplete="off">
                        <input type="text" placeholder="Type a message" name="textbox" className={styles.input} />
                        <button type="submit" className={styles.sendBtn}><FaArrowUp /></button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Messages;