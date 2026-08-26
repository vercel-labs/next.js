import { Suspense } from 'react'
import { getCurrentUser } from '../../../lib/auth.js'

export default function NotePage({ params }) {
  return (
    <main>
      <h2>note page</h2>
      <Suspense fallback={<p>Loading note…</p>}>
        <NoteTitle params={params} />
      </Suspense>
      <Suspense fallback={<p>Loading…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}

async function NoteTitle({ params }) {
  const { id } = await params
  return <p>note {id}</p>
}

async function Dashboard() {
  const user = await getCurrentUser()
  return <h1>Welcome, {user.name}</h1>
}
