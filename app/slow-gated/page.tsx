import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

// Same as /gated, but the gate resolves ~1.5s after the shell has streamed and
// hydrated, so the streamed <meta id="__next-page-redirect"> marker is injected
// into an already-live, hydrated document.
async function Gate() {
  const store = await cookies()
  await new Promise((r) => setTimeout(r, 1500))
  if (!store.get('session')) {
    redirect('/target')
  }
  return <p>gate ok</p>
}

export default function SlowGated() {
  return (
    <main>
      <h1>SlowGated</h1>
      <Suspense fallback={<p>checking…</p>}>
        <Gate />
      </Suspense>
      <Link href="/other">/other</Link> <Link href="/target">/target</Link>
    </main>
  )
}
