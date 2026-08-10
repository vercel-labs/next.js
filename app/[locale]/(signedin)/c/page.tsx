import { Suspense } from 'react'
import { connection } from 'next/server'

async function Dynamic() {
  await connection()
  await new Promise((r) => setTimeout(r, 30 + Math.random() * 120))
  return <p data-page="c">page c content {Date.now()}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-page-fallback="c">loading c…</p>}>
      <Dynamic />
    </Suspense>
  )
}
