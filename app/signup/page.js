"use client"

import styles from "./page.module.css";
import supabase from "../../utils/supabase"
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar";

const Page = () => {
    const email = useRef();
    const password = useRef();
    const username = useRef();
    const router = useRouter();

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
                    username
                },
                emailRedirectTo: 'http://localhost:3000/chat/'
            }
        });
    }

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();

        if (!error) router.push("/chat")
    }

    useEffect(() => {
        getUser()
    }, []);

    return (
        <>
            <div className={styles.container}>
                <Navbar type="signup" />
                <div className={styles.left}>

                </div>
                <div className={styles.right}>
                    <div className={styles.module}>
                        <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
                            <input type="email" placeholder="Email" ref={email} name="email" className={styles.input} />
                            <input type="password" placeholder="Password" ref={password} name="password" minLength="6" className={styles.input} />
                            <input type="text" placeholder="Username" ref={username} name="username" minLength="3" className={styles.input} />
                            <button type="submit" className={styles.sendBtn}>Sign Up</button>
                        </form>
                        <p className={styles.redirect}>Already a user? <a onClick={() => { router.push("/login") }}>Log In</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;