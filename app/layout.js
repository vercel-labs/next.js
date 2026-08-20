import Link from 'next/link'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/page1" id="link1">Page 1</Link>{' | '}
          <Link href="/page2" id="link2">Page 2</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
