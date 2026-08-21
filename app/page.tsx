import Script from 'next/script'
import ClientScript from './client-script'

export default async function Page() {
  return (
    <main>
      <h1 id="title">nonce hydration repro</h1>
      <Script
        id="server-inline-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: `window.__serverRan = true` }}
      />
      <ClientScript />
    </main>
  )
}
