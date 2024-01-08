import Link from "next/link";
import styles from "./navbar.module.css";

const Navbar = () => {
    return (
        <nav className={styles.nav}>
            <h1 className={styles.logo}>chatty</h1>
            <div className={styles.links}>
                <ul>
                    <li><Link legacyBehavior href="#"><a>Link</a></Link></li>
                    <li><Link legacyBehavior href="#"><a>Link</a></Link></li>
                    <li><Link legacyBehavior href="#"><a>Link</a></Link></li>
                </ul>
                <button className={styles.joinBtn}>Sign Up</button>
            </div>
        </nav>
    );
}

export default Navbar;