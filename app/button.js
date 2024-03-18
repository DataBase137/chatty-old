"use client"

import styles from "./button.module.css"
import { useRouter } from "next/navigation"

const Button = ({ href, children, nav }) => {
  const router = useRouter()

  return (
    <button
      className={`${styles.btn} ${nav && styles.navBtn}`}
      onClick={() => router.push(href)}
    >
      {children}
    </button>
  )
}

export default Button
