"use client";

import styles from "./page.module.css";
import { useRef } from "react";
import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";

const Page = () => {
    const email = useRef();
    const password = useRef();
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email.current.value, password.current.value);
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) console.error(error); else router.push("/chat");
    }

    return (
        <div className={styles.container}>
            <form onSubmit={(event) => handleSubmit(event)}>
                <input type="email" placeholder="Email" ref={email} name="email" className={styles.email} />
                <input type="password" placeholder="Password" ref={password} name="password" minLength="6" className={styles.password} />
                <button type="submit" className={styles.sendBtn}>Log in</button>
            </form>
        </div>
    );
}

export default Page;