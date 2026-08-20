import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <h1>Root layout</h1>
        <nav>
          <Link href="/" id="link-root">root</Link>{' | '}
          <Link href="/child" id="link-child">child</Link>{' | '}
          <Link href="/child/grandchild" id="link-grandchild">grandchild</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
