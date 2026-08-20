import Script from 'next/script'

export default function Services() {
  return (
    <main>
      <h1 id="services">Services</h1>
      {/* external widget script, same pattern as the issue report */}
      <div id="widget-root">
        <a
          className="twitter-timeline"
          href="https://twitter.com/vercel?ref_src=twsrc%5Etfw"
        >
          Tweets by vercel
        </a>
      </div>
      <div id="local-widget-root" />
      <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
      <Script src="/local-widget.js" strategy="afterInteractive" />
    </main>
  )
}
