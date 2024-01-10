import Link from "next/link";
import styles from "./navbar.module.css";

const Navbar = () => {
    return (
        <nav className={styles.nav}>
            <h1 className={styles.logo}><Link href="/">chatty</Link></h1>
            <div className={styles.links}>
                <ul>
                    <li><Link href="/chat">Chat</Link></li>
                    <li><Link href="#">Link</Link></li>
                    <li><Link href="#">Link</Link></li>
                </ul>
                <button className={styles.joinBtn}>Sign Up</button>
            </div>
        </nav>
    );
}

export default Navbar;