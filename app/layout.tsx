import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { MetaTheme } from './meta-theme'

export const metadata: Metadata = { title: 'STATIC ROOT TITLE' }
export const viewport: Viewport = { themeColor: '#e0e7ff' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MetaTheme />
        <nav>
          <Link href="/">Home</Link> | <Link href="/dynamic">Dynamic</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
