import Link from "next/link"
import styles from "./navbar.module.css"
import Button from "./button"

const Navbar = ({ type }) => {
  return (
    <nav className={styles.nav}>
      {/* Logo */}
      <h1 className={styles.logo}>
        <Link href="/">chatty</Link>
      </h1>
      {/* Navigation Links */}
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
        {/* Conditional rendering based on page */}
        {type === "home" && (
          <Button href="/login" nav>
            Log In
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
