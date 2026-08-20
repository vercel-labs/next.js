import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
