import { Suspense } from 'react'
import Script from 'next/script'
import Click from '../Click'
import Lazy from '../Lazy'
import Pad from '../Pad'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <h1>with CDN Script</h1>
      <Script strategy="afterInteractive" src="https://code.jquery.com/jquery-3.6.1.min.js" />
      <Suspense fallback={<div id="loading">Loading...</div>}>
        <Lazy />
      </Suspense>
      <Click />
      <Pad />
    </>
  )
}
