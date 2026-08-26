import { Suspense } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '../lib/auth.js'
import { getNotes } from '../lib/data.js'

export default async function Page() {
  const notes = await getNotes()
  return (
    <main>
      <h2>home</h2>
      <Suspense fallback={<p>Loading your dashboard…</p>}>
        <Dashboard />
      </Suspense>
      <nav>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/notes/${note.id}`} prefetch={true}>
                {note.text}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/settings">settings (no params, default prefetch)</Link>
          </li>
        </ul>
      </nav>
    </main>
  )
}

async function Dashboard() {
  const user = await getCurrentUser()
  return <h1>Welcome, {user.name}</h1>
}
