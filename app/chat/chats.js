"use client";

import { FaPlus } from "react-icons/fa";
import styles from "./chats.module.css";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Chats = () => {
    const [chats, setChats] = useState();
    const supabase = createClientComponentClient();

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
                    <h1>Chats</h1>
                    <button onClick={() => { createChat() }}><FaPlus className={styles.icon} /></button>
                </div>
                <div className={styles.chats}>
                    {chats ? chats.map((chat) => {
                        const date = new Date(chat.created_at);
                        return (
                            <div className={styles.chat} key={chat.id}>
                                <p className={styles.chatName}>{chat.name}</p>
                                {/* {date.toLocaleDateString("en-US", { month: "short", weekday: "short", day: "numeric" })} */}
                                <p className={styles.chatTime}>{date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                            </div>
                        );
                    }) : ""}
                </div>
            </div>
        </>
    );
}

export default Chats;