"use client";

import { FaPlus } from "react-icons/fa";
import styles from "./chats.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Chats = ({ chatId, supabase }) => {
    const [chats, setChats] = useState();
    const router = useRouter();

    const createChat = async (name) => {
        await supabase
            .from('chats')
            .insert([
                {
                    name
                },
            ]);
    }

    const getChats = async () => {
        const { data } = await supabase
            .from('chats')
            .select('*')
            .order('created_at', { ascending: false });

        setChats(data);
    }

    useEffect(() => {
        getChats();
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Messages</h1>
                    <button onClick={() => { createChat() }}><FaPlus className={styles.icon} /></button>
                </div>
                <div className={styles.chats}>
                    {chats ? chats.map((chat) => {
                        const date = new Date(chat.created_at);

                        if (chatId === chat.id) {
                            return (
                                <div className={`${styles.chat} ${styles.chatSelected}`} key={chat.id} >
                                    <p className={styles.chatName}>{chat.name}</p>
                                    <p className={styles.chatTime} > {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div onClick={() => router.push(`/chat/${chat.id}`)} className={styles.chat} key={chat.id}>
                                    <p className={styles.chatName}>{chat.name}</p>
                                    < p className={styles.chatTime} > {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                                </div>
                            );
                        }
                    }) : ""}
                </div >
            </div >
        </>
    );
}

export default Chats;