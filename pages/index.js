import Link from 'next/link'
import Script from 'next/script'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/other">Go to other page</Link>
      <Script id="inline-with-id" strategy="afterInteractive">
        {`console.log('[HOME] inline script WITH id ran at ' + new Date().toISOString())`}
      </Script>
      <Script strategy="afterInteractive">
        {`console.log('[HOME] inline script WITHOUT id ran at ' + new Date().toISOString())`}
      </Script>
    </main>
  )
}
