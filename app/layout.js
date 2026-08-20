import Link from 'next/link'

export const metadata = { title: 'focus repro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#content" id="skip-link">Skip to content</a>
        <nav>
          <ul>
            <li><Link href="/" id="link-home">Home</Link></li>
            <li><Link href="/a" id="link-a">Page A</Link></li>
            <li><Link href="/b" id="link-b">Page B</Link></li>
          </ul>
        </nav>
        <main id="content">{children}</main>
      </body>
    </html>
  )
}
