import Link from "next/link";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    
    return (
        <nav className={styles.nav}>
            <h1 className={styles.logo}><Link href="/">chatty</Link></h1>
            <div className={styles.links}>
                <ul>
                    <li><Link href="/chat">Chat</Link></li>
                    <li><Link href="#">Features</Link></li>
                    <li><Link href="#">Privacy</Link></li>
                </ul>
                <button className={styles.joinBtn} onClick={() => router.push("/login")}>Log In</button>
            </div>
        </nav>
    );
}

export default Navbar;