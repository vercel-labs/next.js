import Link from 'next/link'
import Nav from './nav'
export const metadata = { title: 'Home - repro' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><meta name="x-test" content="1" /></head>
      <body>
        <nav>
          <Link href="/coin/bitcoin" id="l-bitcoin">bitcoin</Link>{' | '}
          <Link href="/coin/ethereum" id="l-ethereum">ethereum</Link>{' | '}
          <Link href="/" id="l-home">home</Link>
        </nav>
        <Nav />
        {children}
      </body>
    </html>
  )
}
