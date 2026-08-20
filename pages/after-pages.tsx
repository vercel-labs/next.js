import Script from 'next/script'

function MyScript() {
  return <Script id="dup-script" src="/counter.js" strategy="afterInteractive" />
}

export default function After() {
  return (<main><h1>afterInteractive x3 (control)</h1><MyScript /><MyScript /><MyScript /></main>)
}
