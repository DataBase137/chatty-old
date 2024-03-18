import styles from "./page.module.css"
import Navbar from "../navbar"
import Link from "next/link"

// * Log In Page Component
const Page = () => {
  return (
    <>
      <div className={styles.container}>
        <Navbar type="login" />
        <div className={styles.left}></div>
        <div className={styles.right}>
          <div className={styles.module}>
            <form
              className={styles.form}
              action="/api/auth/login"
              method="post"
            >
              <input
                type="email"
                placeholder="Email"
                name="email"
                className={styles.input}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                minLength="6"
                className={styles.input}
                autoComplete="current-password"
              />
              <button
                type="submit"
                formAction="/api/auth/login"
                className={styles.sendBtn}
              >
                Log In
              </button>
            </form>
            <p className={styles.redirect}>
              Not a user yet? <Link href="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
