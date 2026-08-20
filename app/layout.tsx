import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav id="nav" style={{ height: '150vh', background: '#eee' }}>
          <Link id="home-link" href="/">
            Home (layout link)
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
