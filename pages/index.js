import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Index page</h1>
      <Link href="/profile">go to /profile (next.config redirect to /account)</Link>
    </main>
  )
}
