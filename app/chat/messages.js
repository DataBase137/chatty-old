"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./messages.module.css"
import { FaRegPaperPlane } from "react-icons/fa";

const Message = ({ message, profile, setProfileCache, user }) => {
    const date = new Date(message.created_at);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .match({ id: message.profile_id })
                .single();

            if (data) {
                setProfileCache((current) => ({
                    ...current,
                    [data.id]: data,
                }))
            }

        }
        
        if (!profile) {
            fetchProfile();
        }
    }, [profile, message.profile_id]);

    return (
        <>        
        {profile.id === user.user.id ? 
            <div className={`${styles.message} ${styles.messageRight}`}>
                <div className={styles.messageContent}>
                    <p className={styles.messageUser}>{profile.username}</p>
                    <div>
                        <p className={styles.messageTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                        <p className={styles.messageText}>{message.text}</p>
                    </div>
                </div>
            </div> :
            <div className={`${styles.message} ${styles.messageLeft}`}>
                <div className={styles.messageContent}>
                    <p className={styles.messageUser}>{profile.username}</p>
                    <div>
                        <p className={styles.messageText}>{message.text}</p>
                        <p className={styles.messageTime}>{date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                    </div>
                </div>
            </div>
        }
        </>
    );
}

const Messages = ({ chatId, supabase, user }) => {
    const chat = useRef();
    const [messages, setMessages] = useState(null);
    const [profileCache, setProfileCache] = useState({});

    const getMessages = useCallback(async (id) => {
        const { data } = await supabase
            .from('messages')
            .select('*, profile: profiles(*)')
            .match({ chat_id: id })
            .order('created_at');

        const newProfiles = Object.fromEntries(
            data
                ?.map((message) => message.profile)
                .filter(Boolean)
                .map((profile) => [profile.id, profile])
        );

        setProfileCache((current) => ({
            ...current,
            ...newProfiles,
        }));

        setMessages(data);
    }, [supabase]);

    useEffect(() => {
        getMessages(chatId);
    }, [chatId]);

    useEffect(() => {
        const channel = supabase.channel('message-changes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `chat_id=eq.${chatId}`
            }, (payload) => {
                setMessages((current) => [...current, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase, chatId]);

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
        }
    }

    useEffect(() => {
        chat.current.scrollTop = chat.current.scrollHeight;
    }, [messages]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.chat} ref={chat}>
                    {messages ? messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            profile={profileCache[message.profile_id]}
                            setProfileCache={setProfileCache}
                            user={user}
                        />
                    )
                    ) : ""}
                </div>
                <div className={styles.typeArea}>
                    <form onSubmit={(event) => sendMessage(event)} autoComplete="off">
                        <input type="text" placeholder="Type a message" name="textbox" className={styles.input} />
                        <button type="submit" className={styles.sendBtn}><FaRegPaperPlane /></button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Messages;