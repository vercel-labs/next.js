import { Suspense } from 'react'
import { connection } from 'next/server'

async function Dynamic() {
  await connection()
  await new Promise((r) => setTimeout(r, 30 + Math.random() * 120))
  return <p data-page="b">page b content {Date.now()}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-page-fallback="b">loading b…</p>}>
      <Dynamic />
    </Suspense>
  )
}
