import Script from 'next/script'

export default function Home() {
  return (
    <main>
      <h1>next/script inline export repro (pages router)</h1>
      {/* default strategy (afterInteractive): missing from exported HTML */}
      <Script id="lime">
        {`document.body.style.backgroundColor = 'lime'`}
      </Script>
      {/* beforeInteractive: IS inlined into exported HTML */}
      <Script id="lime-before" strategy="beforeInteractive">
        {`document.documentElement.dataset.before = 'ran'`}
      </Script>
    </main>
  )
}
