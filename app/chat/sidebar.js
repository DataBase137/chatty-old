"use client";

import styles from "./sidebar.module.css";
import supabase from "../../utils/supabase";
import { FaUser, FaUsers, FaComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' });

        if (error) console.error(error); else router.push("/login");
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.top}>
                    <button><FaComment className={styles.icon} /></button>
                    <button><FaUsers className={styles.icon} /></button>
                </div>
                <div className={styles.bottom}>
                    <button className={styles.signOut} onClick={() => signOut()}><FaUser className={styles.icon} /></button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;