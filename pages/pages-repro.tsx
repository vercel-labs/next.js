import Script from 'next/script'

function MyScript() {
  return <Script id="dup-script" src="/counter.js" strategy="beforeInteractive" />
}

export default function PagesRepro() {
  return (
    <main>
      <h1>pages router: beforeInteractive rendered 3x</h1>
      <MyScript />
      <MyScript />
      <MyScript />
    </main>
  )
}
