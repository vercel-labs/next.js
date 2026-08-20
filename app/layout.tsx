import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header id="sticky-header">
          <Link href="/page-a">Page A</Link> | <Link href="/page-b">Page B</Link>
        </header>
        {children}
      </body>
    </html>
  )
}
