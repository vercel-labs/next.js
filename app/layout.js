import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/category/pizza">Pizza</Link>
          <Link href="/category/pasta">Pasta</Link>
          <Link href="/category/salad">Salad</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
