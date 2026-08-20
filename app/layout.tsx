import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/" id="home-link">Home</Link>{' '}
          <Link href="/dashboard" id="dashboard-link">Dashboard</Link>{" "}<Link href="/dynamic" id="dynamic-link">Dynamic</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
