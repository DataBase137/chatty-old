"use client"

import styles from "./page.module.css";
import supabase from "../../utils/supabase"
import { useRef, useState, useEffect } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";

const Page = () => {
    const email = useRef();
    const password = useRef();
    const username = useRef();
    const [noUser, setNoUser] = useState(false);
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
                    username,
                    email
                },
                emailRedirectTo: 'http://localhost:3000/chat/'
            }
        });
    }

    const userPromise = new Promise(async (resolve, reject) => {
        const { data, error } = await supabase.auth.getUser();
        if (error) resolve(); else reject();
    });

    useEffect(() => {
        userPromise
            .then(() => setNoUser(true))
            .catch(() => router.push("/chat"));
    }, []);

    return (
        <>
            {noUser ?
                <div className={styles.container}>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <input type="email" placeholder="Email" ref={email} name="email" className={styles.email} />
                        <input type="password" placeholder="Password" ref={password} name="password" minLength="6" className={styles.password} />
                        <input type="text" placeholder="Username" ref={username} name="username" minLength="3" className={styles.username} />
                        <button type="submit" className={styles.sendBtn}>Sign Up</button>
                    </form>
                </div>
                : <Loading />}
        </>
    );
}

export default Page;