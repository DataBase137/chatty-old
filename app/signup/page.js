"use client"

import styles from "./page.module.css";
import supabase from "../../utils/supabase"
import { useRef } from "react";

const Page = () => {
    const email = useRef();
    const password = useRef();
    const username = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        signup(email.current.value, password.current.value, username.current.value);
    }

    const signup = async (email, password, username) => {
        const { data: user, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    email
                },
                emailRedirectTo: 'http://localhost:3000/chat/'
            }
        });

        if (error) console.error(error, user);
    }

    return (
        <div className={styles.container}>
            <form onSubmit={(event) => handleSubmit(event)}>
                <input type="email" placeholder="Email" ref={email} name="email" className={styles.email} />
                <input type="password" placeholder="Password" ref={password} name="password" minLength="6" className={styles.password} />
                <input type="text" placeholder="Username" ref={username} name="username" minLength="3" className={styles.username} />
                <button type="submit" className={styles.sendBtn}>Sign Up</button>
            </form>
        </div>
    );
}

export default Page;