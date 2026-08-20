import Script from 'next/script'
import { useEffect } from 'react'

export default function PagesRouter() {
  useEffect(() => {
    performance.mark('hydrated')
    window.__hydrated = performance.getEntriesByName('hydrated')[0].startTime
  }, [])
  return (
    <>
      <h1>pages router: next/script strategy="afterInteractive"</h1>
      <Script src="/slow-third-party.js" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');`}
      </Script>
    </>
  )
}
