import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function Car() {
  await new Promise((r) => setTimeout(r, 5000))
  return <p id="car">Car loaded</p>
}

export default function Page() {
  return (
    <main>
      <h1 id="shell">Shell rendered</h1>
      <Suspense fallback={<p id="fallback">Loading car...</p>}>
        <Car />
      </Suspense>
    </main>
  )
}
