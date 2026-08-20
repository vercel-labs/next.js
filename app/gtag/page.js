import Script from 'next/script'

const trackingCode = 'G-XXXXXXXXXX'

export default function GtagPage() {
  return (
    <>
      <h1>real gtag.js with strategy="afterInteractive"</h1>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingCode}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${trackingCode}');`}
      </Script>
    </>
  )
}
