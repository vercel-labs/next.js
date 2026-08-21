import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function Slow() {
  await new Promise((r) => setTimeout(r, 300))
  return <p id="slow">slow content</p>
}

export default function Page() {
  return (
    <main>
      <h1>shell</h1>
      <Suspense fallback={<p id="fallback">loading…</p>}>
        <Slow />
      </Suspense>
    </main>
  )
}
