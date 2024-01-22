"use client"

import { useRef } from "react";
import styles from "./page.module.css"
import supabase from "../../utils/supabase";

const Page = () => {
    const username = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        setUsername(username.current.value);
    };

    const setUsername = async (username) => {
        const { data: user, error: userError } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from("profiles")
            .update({
                username,
                email: user.email,
                
            })
            .eq("id", user.id);

        if (error) console.error(error); else console.log(data);
    };

    return (
        <div className={styles.container}>
            <form onSubmit={(event) => handleSubmit(event)}>
                <input type="text" placeholder="Username" ref={username} name="username" minLength="3" className={styles.username} />
                <button type="submit" className={styles.sendBtn}>Set Username</button>
            </form>
        </div>
    );
}

export default Page;