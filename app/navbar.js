import Link from "next/link"
import styles from "./navbar.module.css"
import { useRouter } from "next/navigation"

const Navbar = ({ type }) => {
  const router = useRouter()

  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>
        <Link href="/">chatty</Link>
      </h1>
      <div className={styles.links}>
        <ul>
          <li>
            <Link href="#">Info</Link>
          </li>
          <li>
            <Link href="#">Features</Link>
          </li>
          <li>
            <Link href="#">Privacy</Link>
          </li>
        </ul>
        {type === "home" && (
          <button
            className={styles.joinBtn}
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
