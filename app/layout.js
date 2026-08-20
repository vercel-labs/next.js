import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">home</Link> | <Link href="/about">about</Link> |{' '}
          <Link href="/services">services</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
