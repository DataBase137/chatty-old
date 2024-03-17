"use client"

import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import Navbar from "../navbar"

// * Sign Up Page Component
const Page = () => {
  const router = useRouter()

  return (
    <>
      <div className={styles.container}>
        <Navbar type="signup" />
        <div className={styles.left}></div>
        <div className={styles.right}>
          <div className={styles.module}>
            <form
              className={styles.form}
              action="/api/auth/sign-up"
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
                autoComplete="new-password"
              />
              <input
                type="text"
                placeholder="Username"
                name="username"
                minLength="3"
                className={styles.input}
                autoComplete="off"
              />
              <button
                type="submit"
                formAction="/api/auth/sign-up"
                className={styles.sendBtn}
              >
                Sign Up
              </button>
            </form>
            <p className={styles.redirect}>
              Already a user?{" "}
              <a
                onClick={() => {
                  router.push("/login")
                }}
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
