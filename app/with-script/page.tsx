import { Suspense } from 'react'
import Script from 'next/script'
import Click from '../Click'
import Lazy from '../Lazy'
import Pad from '../Pad'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <h1>with Script</h1>
      <Script strategy="afterInteractive" src="/slow-script.js" />
      <Suspense fallback={<div id="loading">Loading...</div>}>
        <Lazy />
      </Suspense>
      <Click />
      <Pad />
    </>
  )
}
