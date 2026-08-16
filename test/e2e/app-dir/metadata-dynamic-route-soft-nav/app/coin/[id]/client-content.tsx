'use client'

import { lazy, Suspense, useEffect, useState } from 'react'

const CoinInfo = lazy(() => import('./coin-info'))

// The page content is rendered by a client component that only suspends after
// hydration (the lazy chunk is requested from an effect). This is what made the
// title of the *previous* dynamic page stick around in the regressed version.
export function ClientContent({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <Suspense fallback={<p id="client-fallback">loading info…</p>}>
      {mounted ? <CoinInfo id={id} /> : <p id="client-pending">pending…</p>}
    </Suspense>
  )
}
