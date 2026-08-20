import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/a" prefetch={true}>A (prefetch true)</Link>{' | '}
          <Link href="/b">B (prefetch default)</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
