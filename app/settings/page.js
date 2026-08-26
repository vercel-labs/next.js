import { Suspense } from 'react'
import { getCurrentUser } from '../../lib/auth.js'

export default function Settings() {
  return (
    <main>
      <h2>settings</h2>
      <Suspense fallback={<p>Loading…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}

async function Dashboard() {
  const user = await getCurrentUser()
  return <h1>Welcome, {user.name}</h1>
}
