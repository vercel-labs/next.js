import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">Home</Link> | <Link href="/records">Records</Link>
        </nav>
        <div id="content">{children}</div>
      </body>
    </html>
  )
}
