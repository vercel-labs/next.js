import { connection } from 'next/server'

// Force dynamic rendering on every request, like a real dev-mode page render.
export default async function DynamicPage() {
  await connection()
  const rows = Array.from({ length: 200 }, (_, i) => (
    <li key={i}>row {i} rendered at {Date.now()}</li>
  ))
  return (
    <main>
      <h1>dynamic</h1>
      <ul>{rows}</ul>
    </main>
  )
}
