import "../styles/global.css"

export const metadata = {
  title: 'chatty',
  description: 'a chat app',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}