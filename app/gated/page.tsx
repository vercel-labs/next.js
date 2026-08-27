import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

// Request-time gate behind Suspense: the shell has already been streamed when
// redirect() throws, so Next cannot send a 3xx and instead injects
// <meta id="__next-page-redirect" http-equiv="refresh" content="1;url=/target">
// into the streamed document.
async function Gate() {
  const store = await cookies()
  if (!store.get('session')) {
    redirect('/target')
  }
  return <p>gate ok</p>
}

export default function Gated() {
  return (
    <main>
      <h1>Gated</h1>
      <Suspense fallback={<p>checking…</p>}>
        <Gate />
      </Suspense>
      <Link href="/other">/other</Link>
    </main>
  )
}
