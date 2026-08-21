import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link href="/" id="home">Home</Link>
          <Link href="/no-param" id="no-param">No search param</Link>
          <Link href="/yes-param?foo=bar" id="yes-param">Yes search param</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
