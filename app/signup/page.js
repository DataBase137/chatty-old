"use client"

import styles from "./page.module.css";
import supabase from "../../utils/supabase"
import { useRef } from "react";

const Page = () => {
    const email = useRef();
    const password = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        signup(email.current.value, password.current.value);
    }

    const signup = async (email, password) => {
        const { data: user, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:3000/setup/'
            }
        });

        if (error) console.error(error, data); else console.log(user);
    }

    return (
        <div className={styles.container}>
            <form onSubmit={(event) => handleSubmit(event)}>
                <input type="email" placeholder="Email" ref={email} name="email" className={styles.email} />
                <input type="password" placeholder="Password" ref={password} name="password" minLength="6" className={styles.password} />
                <button type="submit" className={styles.sendBtn}>Sign Up</button>
            </form>
        </div>
    );
}

export default Page;