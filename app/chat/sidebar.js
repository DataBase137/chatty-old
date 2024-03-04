"use client";

import styles from "./sidebar.module.css";
import { FaUser, FaUsers, FaComment } from "react-icons/fa";

const Sidebar = () => {
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