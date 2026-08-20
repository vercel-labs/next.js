import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { startRecorder } from '../components/frames'

function Header() {
  return <header id="header" style={{ background: '#fee' }}>HEADER <Link href="/">index</Link> | <Link href="/dyn">dyn (next/dynamic ssr:false)</Link> | <Link href="/lazy">lazy (React.lazy)</Link></header>
}
function Footer() {
  return <footer id="footer" style={{ background: '#efe' }}>FOOTER</footer>
}

export default function App({ Component, pageProps }) {
  useEffect(() => { startRecorder() }, [])
  return (
    <div id="app-root-wrapper">
      <Suspense fallback={<div id="parent-fallback">PARENT SUSPENSE FALLBACK</div>}>
        <div>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </Suspense>
    </div>
  )
}
