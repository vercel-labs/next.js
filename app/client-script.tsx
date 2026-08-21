'use client'
import Script from 'next/script'
export default function ClientScript() {
  return (
    <Script
      id="client-inline-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: `window.__clientRan = true` }}
    />
  )
}
