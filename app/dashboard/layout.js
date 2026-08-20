import Link from 'next/link'
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>
        <Link href="/dashboard">To Dashboard</Link>{' | '}
        <Link href="/dashboard/blog">To Blog</Link>
      </nav>
      {children}
    </div>
  )
}
