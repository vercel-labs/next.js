import Link from 'next/link'
import Script from 'next/script'

const Page = () => {
  return (
    <div className="container">
      <Script
        id="inline-remount-script"
        strategy="afterInteractive"
      >{`window.__inlineRemountCalls = (window.__inlineRemountCalls || 0) + 1`}</Script>
      <div id="page11">page11</div>
      <div>
        <Link href="/page12">Page12</Link>
      </div>
    </div>
  )
}

export default Page
