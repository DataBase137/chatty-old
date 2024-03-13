"use client";

import styles from "./sidebar.module.css";
import { FaUser, FaUsers, FaComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter();

    return (
        <>
            <div className={styles.container}>
                <div className={styles.top}>
                    <button><FaComment className={styles.icon} /></button>
                    <button><FaUsers className={styles.icon} /></button>
                </div>
                <div className={styles.bottom}>
                    <form action="/api/auth/signout" method="post">
                        <button type="submit" formAction="/api/auth/signout" className={styles.signOut}><FaUser className={styles.icon} /></button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Sidebar;