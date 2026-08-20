import Script from 'next/script'

export default function Page() {
  return (
    <>
      <p>after-interactive</p>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
    </>
  )
}
