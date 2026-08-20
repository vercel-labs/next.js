import { Suspense } from 'react'
import ClientOnly from '../components/client-only'

export default function Home() {
  return (
    <main>
      <h1>Issue 53987 repro (Pages Router)</h1>
      <Suspense fallback={<p id="fallback">Loading (fallback)...</p>}>
        <ClientOnly />
      </Suspense>
    </main>
  )
}
